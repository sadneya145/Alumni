import React, {useState} from 'react';
import {provider} from '../../firebase';
import {
  signInWithPopup,
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import axios from 'axios';
import Swal from 'sweetalert2';
import './LoginSignup.css';

const Signup = () => {
  const [role, setRole] = useState('Student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const newUser = {
        name: user.displayName,
        email: user.email,
        role,
        organizationName: role === 'Organization' ? organizationName : null,
      };

      await axios.post('http://localhost:5000/api/users', newUser);
      Swal.fire('Success!', 'You have successfully signed up!', 'success');
      window.location.href = '/home';
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing in with Google');
    }
  };

  const handleFormSignup = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const newUser = {
        name,
        email: firebaseUser.email,
        role,
        organizationName: role === 'Organization' ? organizationName : null,
      };

      await axios.post('http://localhost:5000/api/users', newUser);
      Swal.fire('Success!', 'You have successfully signed up!', 'success');
      window.location.href = '/home';
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="role-switcher">
          {['Student', 'Alumni', 'Organization'].map(r => (
            <div
              key={r}
              className={`role-option ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
            >
              {r}
            </div>
          ))}
          <div
            className="slider"
            style={{
              left: `${
                ['Student', 'Alumni', 'Organization'].indexOf(role) * 33.33
              }%`,
            }}
          ></div>
        </div>

        <div className="form-container">
          <h2>{role} Signup</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleFormSignup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              required
              onChange={e => setName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              required
              onChange={e => setConfirmPassword(e.target.value)}
            />

            {role === 'Organization' && (
              <>
                <label>Organization Name</label>
                <input
                  type="text"
                  value={organizationName}
                  required
                  onChange={e => setOrganizationName(e.target.value)}
                />
              </>
            )}

            <button type="submit" className="submit-btn">
              Signup
            </button>
          </form>

          <p className="alternate">
            Already a member? <a href="/">Log in</a>
          </p>

          <hr />
          <button className="google-btn" onClick={handleGoogleSignIn}>
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

export default Signup;
