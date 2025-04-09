import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './FundRaising.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

const FundRaising = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentLink: '',
    minimumFund: '',
  });

  const [activeTab, setActiveTab] = useState('needFunding');
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects', err);
    }
  };

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', {
        ...formData,
        submittedBy: email,
      });
      setFormData({
        title: '',
        description: '',
        documentLink: '',
        minimumFund: '',
      });
      fetchProjects();
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <>
      <Header />

      <div className="fundraising-wrapper">
        <div className="role-switcher">
          <div
            className={`role-option ${
              activeTab === 'needFunding' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('needFunding')}
          >
            Need Funding
          </div>
          <div
            className={`role-option ${
              activeTab === 'fundSomeone' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('fundSomeone')}
          >
            Want to Fund Someone
          </div>
        </div>

        {activeTab === 'needFunding' && (
          <div className="fundraising-form-container">
            <h2>Submit a Project for Funding</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
              <input
                type="text"
                name="documentLink"
                placeholder="Add any relevant document link (optional)"
                value={formData.documentLink}
                onChange={handleChange}
              />
              <input
                type="number"
                name="minimumFund"
                placeholder="Minimum Required Amount (₹)"
                value={formData.minimumFund}
                onChange={handleChange}
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}

        {activeTab === 'fundSomeone' && (
          <div className="fundraising-projects">
            <h2>Active Fundraising Projects</h2>
            <div className="projects-grid">
              {projects.map(proj => (
                <div key={proj._id} className="project-card">
                  <h3>{proj.title}</h3>
                  <p>
                    <strong>Description:</strong> {proj.description}
                  </p>
                  <p>
                    <strong>Required:</strong> ₹{proj.amount}
                  </p>
                  <p>
                    <strong>Submitted By:</strong> {proj.submittedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default FundRaising;
