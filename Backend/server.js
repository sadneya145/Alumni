// tbzt ehwi tbnx jncf password
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {Resend} = require('resend');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://sadneyasam05:root@cluster0.7gxwyxh.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['Student', 'Alumni', 'Organization', 'admin'],
    required: true,
  },
  verified: { type: Boolean, default: false }, // Admin verified
  isEmailVerified: { type: Boolean, default: false }, // Email verified
  emailToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});


// Create User Model
const User = mongoose.model('User', userSchema);



app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  if (!['Student', 'Alumni', 'Organization'].includes(role)) {
    return res.status(403).json({ message: 'Only Student, Alumni, and Organization roles are allowed' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const emailToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({ name, email, role, emailToken });
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sadneyasam05@gmail.com',
        pass: 'tbzt ehwi tbnx jncf', // use env variable or App Password
        
      },
    });

    const url = `http://localhost:5000/api/verify-email/${emailToken}`;

    await transporter.sendMail({
      from: 'your.email@gmail.com',
      to: newUser.email,
      subject: 'Verify your email',
      html: `<p>Hi ${name},</p>
             <p>Please click the link below to verify your email:</p>
             <a href="${url}">${url}</a>`,
    });

    res.status(201).json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API Routes
// app.post('/api/users', async (req, res) => {
//   const {name, email, role} = req.body;

//   if (!name || !email || !role) {
//     return res.status(400).json({message: 'All fields (name, email, role) are required'});
//   }

//   if (!['Student', 'Alumni', 'Organization'].includes(role)) {
//     return res.status(403).json({message: 'Only Student, Alumni, and Organization roles are allowed to sign up directly'});
//   }

//   try {
//     const existingUser = await User.findOne({email});
//     if (existingUser) {
//       return res.status(400).json({message: 'User already exists'});
//     }

//     const newUser = new User({name, email, role});
//     await newUser.save();

//     res.status(201).json({message: 'Signup successful. Awaiting admin verification.', user: newUser});
//   } catch (err) {
//     res.status(500).json({message: 'Internal server error'});
//   }
// });

app.patch('/api/users/verify/:email', async (req, res) => {
  const {adminEmail} = req.body;
  const userEmail = req.params.email;

  try {
    const admin = await User.findOne({email: adminEmail});
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({message: 'Only admins can verify users'});
    }

    const user = await User.findOneAndUpdate(
      {email: userEmail},
      {verified: true},
      {new: true}
    );

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'User verified successfully', user});
  } catch (err) {
    res.status(500).json({message: 'Internal server error'});
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({message: 'Internal server error'});
  }
});

app.get('/api/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isEmailVerified = true;
    user.emailToken = null;
    await user.save();

    res.send('<h2>Email verified successfully! 😊</h2>');
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (!user.isEmailVerified) {
    return res.status(403).json({ message: 'Please verify your email to login' });
  }

  res.status(200).json({ message: 'Login successful', user });
});



// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

const Admin = mongoose.model('Admin', AdminSchema);

// 🔹 **Admin Login API** 🔹
app.post('/api/admin/login', async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: 'Email and password are required'});
  }

  try {
    const admin = await Admin.findOne({email});

    if (!admin) {
      return res.status(400).json({message: 'Admin not found'});
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid password'});
    }

    const token = jwt.sign({email: admin.email, role: 'admin'}, 'secretkey', {
      expiresIn: '2h',
    });

    res.json({message: 'Admin login successful', token});
  } catch (error) {
    console.error('Error in /api/admin/login:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// 🔹 **Create Admin (Run Once Manually)** 🔹
app.post('/api/admin/register', async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: 'Email and password are required'});
  }

  try {
    const existingAdmin = await Admin.findOne({email});
    if (existingAdmin) {
      return res.status(400).json({message: 'Admin already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({email, password: hashedPassword});

    await admin.save();
    res.json({message: 'Admin registered successfully'});
  } catch (error) {
    console.error('Error in /api/admin/register:', error);
    res.status(500).json({message: 'Server error'});
  }
});

app.get('/api/users/:email', async (req, res) => {
  const {email} = req.params;

  try {
    const user = await User.findOne({email});
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (err) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// Define Event Schema
const eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  date: {type: String, required: true},
  time: {type: String, required: true},
  meetingLink: {type: String, required: true}, // Online event link
  qrCode: {type: String}, // Store generated QR code link
});

const Event = mongoose.model('Event', eventSchema);

app.post('/api/events', async (req, res) => {
  try {
    const {title, description, date, time} = req.body;

    if (!title || !description || !date || !time) {
      return res.status(400).json({message: 'All fields are required!'});
    }

    // Generate a unique Meeting Link and QR Code link
    const uniqueQR = `http://localhost:3000/video_call/room/${crypto
      .randomBytes(5)
      .toString('hex')}`;

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      meetingLink: uniqueQR,
      qrCode: uniqueQR,
    });
    await newEvent.save();

    res
      .status(201)
      .json({message: 'Event Created Successfully', event: newEvent});
  } catch (error) {
    res.status(500).json({message: 'Error creating event', error});
  }
});

// API to Fetch All Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({message: 'Error fetching events', error});
  }
});

// newsletter
// Initialize Resend
const resend = new Resend('re_123456789');

// Define Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
});
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// API: Publish Newsletter (Only Alumni)
app.post('/api/newsletters', async (req, res) => {
  const {title, content, authorEmail} = req.body;

  try {
    const author = await User.findOne({email: authorEmail});
    if (!author || author.role !== 'Alumni') {
      return res
        .status(403)
        .json({message: 'Only alumni can publish newsletters'});
    }

    const newNewsletter = new Newsletter({title, content, author: author._id});
    await newNewsletter.save();

    // Fetch all user emails (Students, Alumni, Organizations)
    const users = await User.find();
    const emailList = users.map(user => user.email);

    if (emailList.length > 0) {
      await resend.emails.send({
        from: 'newsletter@yourdomain.com',
        to: emailList,
        subject: `New Alumni Newsletter: ${title}`,
        html: `<h2>${title}</h2><p>${content}</p><p>Published by: ${author.name}</p>`,
      });
    }

    res
      .status(201)
      .json({message: 'Newsletter published and all users notified!'});
  } catch (error) {
    res.status(500).json({message: 'Error publishing newsletter', error});
  }
});

// API: Get All Newsletters
app.get('/api/newsletters', async (req, res) => {
  try {
    const newsletters = await Newsletter.find().populate(
      'author',
      'name email'
    );
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({message: 'Error fetching newsletters'});
  }
});

const ProfileSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  firstname: String,
  lastname: String,
  role: String,
  batch: String,
  department: String,
  avatar: String,
  resume: String,
  achievements: [
    {
      title: String,
      description: String,
      icon: String,
    },
  ],
  stats: {
    eventsAttended: Number,
    internshipsCompleted: Number,
    projectsCompleted: Number,
    connectionsCount: Number,
  },
  activities: [
    {
      type: {type: String, required: true},
      title: {type: String, required: true},
      date: {type: String, required: true},
      points: {type: Number, required: true},
    },
  ],
});

const Profile = mongoose.model('Profile', ProfileSchema);

// ✅ Create a new profile using email
app.post('/api/profile', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res
      .status(201)
      .json({message: 'Profile created successfully', profile: newProfile});
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({error: 'Error creating profile'});
  }
});

// ✅ Get a profile by email
app.get('/api/profile/:email', async (req, res) => {
  try {
    const profile = await Profile.findOne({email: req.params.email});
    if (!profile) return res.status(404).json({message: 'Profile not found'});
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({error: 'Error fetching profile'});
  }
});

// ✅ Update profile data by email
app.put('/api/profile/:email', async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      {email: req.params.email},
      {$set: req.body},
      {new: true}
    );
    if (!updatedProfile)
      return res.status(404).json({message: 'Profile not found'});
    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({error: 'Error updating profile'});
  }
});

// const multer = require("multer");
// const path = require("path");

// // Configure Multer for resume upload
// const storage = multer.diskStorage({
//     destination: "./uploads/resumes/",
//     filename: (req, file, cb) => {
//         cb(null, `${req.body.email}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });
// const upload = multer({ storage });

// // Resume Upload API
// app.post("/api/profile/upload-resume", upload.single("resume"), async (req, res) => {
//     try {
//         const profile = await Profile.findOneAndUpdate(
//             { email: req.body.email },
//             { $set: { resume: `/uploads/resumes/${req.file.filename}` } },
//             { new: true }
//         );
//         if (!profile) return res.status(404).json({ message: "Profile not found" });
//         res.json({ message: "Resume uploaded successfully", resumeUrl: profile.resume });
//     } catch (error) {
//         console.error("Error uploading resume:", error);
//         res.status(500).json({ error: "Error uploading resume" });
//     }
// });

// // ✅ Set up storage for resumes
// const storage = multer.diskStorage({
//   destination: "./resume", // Save resumes in the 'resume' folder
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.email}_${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({ storage });

// // ✅ Resume Upload & Profile Extraction API
// app.post("/api/profile/:email/upload-resume", upload.single("resume"), async (req, res) => {
//   try {
//     const resumePath = req.file.path;
//     const dataBuffer = await fs.readFile(resumePath);
//     const pdfData = await pdfParse(dataBuffer);

//     const extractedText = pdfData.text;

//     // ✅ Extract user details using Regex or NLP (basic parsing)
//     const firstname = extractedText.match(/Name[:\s]+(\w+)/i)?.[1] || "Unknown";
//     const lastname = extractedText.match(/Name[:\s]+\w+\s(\w+)/i)?.[1] || "Unknown";
//     const role = extractedText.match(/Role[:\s]+([\w\s]+)/i)?.[1] || "Student";
//     const department = extractedText.match(/Department[:\s]+([\w\s]+)/i)?.[1] || "General";
//     const batch = extractedText.match(/Batch[:\s]+(\d+)/i)?.[1] || "2024";

//     // ✅ Extract achievements, activities, internships, and skills (basic detection)
//     const achievements = extractedText.includes("Award") ? [{ title: "Award Winner", description: "Mentioned in Resume", icon: "award" }] : [];
//     const internships = extractedText.includes("Intern") ? [{ title: "Internship Experience", description: "As mentioned in resume", icon: "briefcase" }] : [];
//     const projects = extractedText.includes("Project") ? 1 : 0;

//     // ✅ Update Profile in MongoDB
//     const profile = await Profile.findOneAndUpdate(
//       { email: req.params.email },
//       {
//         firstname,
//         lastname,
//         role,
//         department,
//         batch,
//         resume: `/resume/${req.file.filename}`, // Store resume path
//         achievements,
//         stats: { eventsAttended: 2, internshipsCompleted: internships.length, projectsCompleted: projects, connectionsCount: 10 },
//         activities: [{ type: "workshop", title: "Workshop Attended", date: new Date().toISOString(), points: 20 }]
//       },
//       { new: true, upsert: true }
//     );

//     res.json({ message: "Resume uploaded & profile updated!", profile });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     res.status(500).json({ error: "Failed to process resume" });
//   }
// });

const upload = multer({dest: 'uploads/'});

app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: 'No file uploaded'});
  }

  try {
    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.path);
      extractedText = data.text;
    } else if (
      req.file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({path: req.file.path});
      extractedText = result.value;
    } else {
      return res.status(400).json({error: 'Invalid file format'});
    }

    console.log(
      '\ud83d\udcdd Extracted Resume Text:',
      extractedText.substring(0, 500)
    );
    const profile = extractProfileData(extractedText);
    console.log('\u2705 Extracted Profile:', profile);

    res.json(profile);
  } catch (error) {
    console.error('\u274c Error processing resume:', error);
    res.status(500).json({error: 'Error processing resume'});
  } finally {
    fs.unlink(req.file.path, err => {
      if (err) console.error('Failed to delete uploaded file:', err);
    });
  }
});

function extractProfileData(text) {
  const profile = {
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: [],
    projects: [],
    skills: [],
    leadership: [],
    linkedin: '',
    github: '',
  };

  // Extract Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[\w]+/);
  profile.email = emailMatch ? emailMatch[0] : 'Not Found';

  // Extract Phone Number
  const phoneMatch = text.match(/\+?\d{10,12}/);
  profile.phone = phoneMatch ? phoneMatch[0] : 'Not Found';

  // Extract Name (Assuming the first line is the name)
  const lines = text.split('\n').filter(line => line.trim() !== '');
  profile.name = lines.length > 0 ? lines[0] : 'Not Found';

  // Extract Education
  const educationMatch = text.match(/Bachelors.*?\d{4}/i);
  profile.education = educationMatch ? educationMatch[0] : 'Not Found';

  // Extract LinkedIn
  const linkedInMatch = text.match(/linkedin\.com\/[a-zA-Z0-9-_\/]+/);
  profile.linkedin = linkedInMatch
    ? `https://${linkedInMatch[0]}`
    : 'Not Found';

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9-_\/]+/);
  profile.github = githubMatch ? `https://${githubMatch[0]}` : 'Not Found';

  // Extract Experience
  const experienceMatch = text.match(/EXPERIENCE[\s\S]*?TECHNICAL PROJECTS/i);
  if (experienceMatch) {
    profile.experience = experienceMatch[0]
      .split('-')
      .map(exp => exp.trim())
      .filter(exp => exp.length > 0);
  }

  // Extract Projects
  const projectsMatch = text.match(/TECHNICAL PROJECTS[\s\S]*?PUBLICATIONS/i);
  if (projectsMatch) {
    profile.projects = projectsMatch[0]
      .split('-')
      .map(proj => proj.trim())
      .filter(proj => proj.length > 0);
  }

  // Extract Skills
  const skillsMatch = text.match(
    /SKILLS AND ACHIEVEMENTS[\s\S]*?LEADERSHIP ROLES/i
  );
  if (skillsMatch) {
    profile.skills = skillsMatch[0]
      .split(/,|\n|•/) // Handles comma, new lines, and bullet points
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  // Extract Leadership Roles
  const leadershipMatch = text.match(/LEADERSHIP ROLES[\s\S]*/i);
  if (leadershipMatch) {
    profile.leadership = leadershipMatch[0]
      .split('-')
      .map(role => role.trim())
      .filter(role => role.length > 0);
  }

  return profile;
}


// fund
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  minimumFund: Number,
  // Add more fields if needed
});

const Project= mongoose.model('Project', projectSchema);

// POST /api/projects
app.post('/api/projects', async (req, res) => {
  const { title, description, minimumFund } = req.body;
  const newProject = new Project({ title, description, minimumFund });
  await newProject.save();
  res.status(201).send(newProject);
});

// GET /api/projects
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});



// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// mongodb+srv://sadneyasam05:root@cluster0.7gxwyxh.mongodb.net/?retryWrites=true&w=majority
