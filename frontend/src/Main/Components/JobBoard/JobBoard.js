import React, { useState, useEffect } from 'react';
import './JobBoard.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeLink: '',
    coverLetter: ''
  });

  useEffect(() => {
    // Simulating API fetch with sample data
    // In a real application, you would fetch this from your backend
    setTimeout(() => {
      setJobs([
        {
          id: 1,
          position: 'Frontend Developer',
          company: 'TechNova Solutions',
          location: 'Mumbai, India',
          type: 'Full-time',
          salary: '₹8-12 LPA',
          postedDate: '2025-04-05',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TN',
          description: 'We are looking for a skilled frontend developer with expertise in React.js to join our growing team.'
        },
        {
          id: 2,
          position: 'Data Science Intern',
          company: 'Analytics Edge',
          location: 'Bangalore, India',
          type: 'Internship',
          salary: '₹25,000/month',
          postedDate: '2025-04-07',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AE',
          description: 'Summer internship opportunity for students interested in data analysis and machine learning.'
        },
        {
          id: 3,
          position: 'Product Manager',
          company: 'InnovateTech',
          location: 'Pune, India',
          type: 'Full-time',
          salary: '₹18-22 LPA',
          postedDate: '2025-04-01',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IT',
          description: 'Experienced product manager needed to lead our flagship software product development.'
        },
        {
          id: 4,
          position: 'DevOps Engineer',
          company: 'CloudSys',
          location: 'Remote',
          type: 'Full-time',
          salary: '₹14-18 LPA',
          postedDate: '2025-04-08',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS',
          description: 'Looking for DevOps enthusiasts to help scale our cloud infrastructure.'
        },
        {
          id: 5,
          position: 'UI/UX Design Intern',
          company: 'CreativeMinds',
          location: 'Hyderabad, India',
          type: 'Internship',
          salary: '₹20,000/month',
          postedDate: '2025-04-03',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CM',
          description: 'Join our design team to create beautiful and functional user interfaces.'
        },
        {
          id: 6,
          position: 'Backend Developer',
          company: 'ServerStack',
          location: 'Delhi, India',
          type: 'Full-time',
          salary: '₹10-15 LPA',
          postedDate: '2025-04-06',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SS',
          description: 'Java and Spring Boot developer needed for our enterprise application team.'
        },
        {
          id: 7,
          position: 'Machine Learning Engineer',
          company: 'AI Innovations',
          location: 'Bangalore, India',
          type: 'Full-time',
          salary: '₹16-20 LPA',
          postedDate: '2025-04-02',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AI',
          description: 'Help us build the next generation of AI-powered solutions.'
        },
        {
          id: 8,
          position: 'Marketing Intern',
          company: 'GrowthHackers',
          location: 'Mumbai, India',
          type: 'Internship',
          salary: '₹15,000/month',
          postedDate: '2025-04-09',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GH',
          description: 'Learn digital marketing strategies while working on real campaigns.'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredJobs = jobs.filter(job => {
    // Filter by job type
    const typeMatch = filter === 'all' || job.type.toLowerCase() === filter;
    
    // Filter by search term
    const searchMatch = 
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  // Calculate days ago for each job
  const calculateDaysAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate - postedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    // Reset form when opening for a new application
    setApplicationForm({
      fullName: '',
      email: '',
      phone: '',
      resumeLink: '',
      coverLetter: ''
    });
    // Add class to body to prevent scrolling
    document.body.classList.add('modal-open');
  };

  const closeApplicationForm = () => {
    setShowApplicationForm(false);
    setSelectedJob(null);
    // Remove class from body to allow scrolling again
    document.body.classList.remove('modal-open');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({
      ...applicationForm,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the application data to your backend
    console.log('Application submitted:', { job: selectedJob, applicant: applicationForm });
    
    // Show success message
    alert('Your application has been submitted successfully!');
    
    // Close the form
    closeApplicationForm();
  };

  return (
    <div className="job-board-container">
      <Header />
      
      <main className="job-board-main">
        <div className="page-header">
          <h1>Job Board</h1>
          <p>Discover opportunities to advance your career</p>
        </div>
        
        <div className="job-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search positions, companies, or locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-options">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All Jobs
            </button>
            <button 
              className={filter === 'full-time' ? 'active' : ''} 
              onClick={() => setFilter('full-time')}
            >
              Full-time
            </button>
            <button 
              className={filter === 'internship' ? 'active' : ''} 
              onClick={() => setFilter('internship')}
            >
              Internships
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="jobs-container">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div className="company-logo">
                      <img src={job.logo} alt={`${job.company} logo`} />
                    </div>
                    <div className="job-info">
                      <h3 className="job-title">{job.position}</h3>
                      <h4 className="company-name">{job.company}</h4>
                      <div className="job-meta">
                        <span className="job-location">
                          <i className="fas fa-map-marker-alt"></i> {job.location}
                        </span>
                        <span className="job-type">
                          <i className="fas fa-briefcase"></i> {job.type}
                        </span>
                        <span className="job-salary">
                          <i className="fas fa-money-bill-wave"></i> {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="job-posted">
                      <span>{calculateDaysAgo(job.postedDate)}</span>
                    </div>
                  </div>
                  <div className="job-description">
                    <p>{job.description}</p>
                  </div>
                  <div className="job-actions">
                    <button className="apply-btn" onClick={() => handleApplyClick(job)}>Apply Now</button>
                    <button className="save-btn">
                      <i className="far fa-bookmark"></i> Save
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-jobs-found">
                <i className="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search filters or search term</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {showApplicationForm && selectedJob && (
        <div className="application-modal-overlay" onClick={closeApplicationForm}>
          <div className="application-modal" onClick={(e) => e.stopPropagation()}>
            <div className="application-modal-header">
              <h2>Apply for {selectedJob.position}</h2>
              <p className="modal-company">{selectedJob.company} • {selectedJob.location}</p>
              <button className="close-modal-btn" onClick={closeApplicationForm}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form className="application-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={applicationForm.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={applicationForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={applicationForm.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="resumeLink">Resume Link/URL *</label>
                <input
                  type="url"
                  id="resumeLink"
                  name="resumeLink"
                  value={applicationForm.resumeLink}
                  onChange={handleInputChange}
                  placeholder="Enter a link to your resume (Google Drive, Dropbox, etc.)"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={applicationForm.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Why do you want to work at this company? (Optional)"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-submit">
                <button type="submit" className="submit-application-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default JobBoard;
