import React, {useState} from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import axios from 'axios';
import './LoginSignup.css';
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const [activeRole, setActiveRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const studentEmailRegex = /^\d{4}\.[a-zA-Z]+\.[a-zA-Z]+@ves\.ac\.in$/;

  const handleLogin = async e => {
    e.preventDefault();

    if (activeRole === 'Student' && !studentEmailRegex.test(email)) {
      setError(
        'Invalid email format. Use yearofstudy.firstname.lastname@ves.ac.in'
      );
      return;
    }

    if (activeRole === 'Alumni') {
      const verifiedAlumni = await verifyAlumni(email);
      if (!verifiedAlumni) {
        setError('Email not found in alumni records.');
        return;
      }
      localStorage.setItem('alumniName', verifiedAlumni.Name);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // ✅ Connect with backend to get user info
      const response = await axios.get(
        `http://localhost:5000/api/users/${firebaseUser.email}`
      );
      const userData = response.data;

      localStorage.setItem('role', userData.role);
      localStorage.setItem('name', userData.name);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    }
  };

  // ✅ Alumni verification from Google Sheet
  const verifyAlumni = async email => {
    try {
      const res = await axios.get(
        'https://opensheet.vercel.app/15R-tU7kAPUd7eGGLHKQogVjJWefMsKuScVipSmL5G7Y/Sheet1'
      );
      const alumniList = res.data;
      return alumniList.find(
        alum => alum.Email?.toLowerCase() === email.toLowerCase()
      );
    } catch (error) {
      console.error('Failed to verify alumni', error);
      return null;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google User logged in:', result.user);
      window.location.href = '/home';
    } catch (err) {
      setError('Error logging in with Google. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="role-switcher">
          {['Student', 'Alumni', 'Organisation'].map(role => (
            <div
              key={role}
              className={`role-option ${activeRole === role ? 'active' : ''}`}
              onClick={() => setActiveRole(role)}
            >
              {role}
            </div>
          ))}
          <div
            className="slider"
            style={{
              left: `${
                ['Student', 'Alumni', 'Organisation'].indexOf(activeRole) *
                33.33
              }%`,
            }}
          ></div>
        </div>

        <div className="form-container">
          <h2>{activeRole} Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>

          <p className="alternate">
            Not a member? <a href="/signup">Sign up</a>
          </p>

          <hr />
          <b>OR</b>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
              alt="Google"
              className="google-logo"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
