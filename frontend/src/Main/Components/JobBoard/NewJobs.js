import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './NewJobs.css';
import jobsPages from '../../../JobSpy-main/JobSpy-main/jobs.csv'
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

const FrontPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(jobsPages)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setJobs(results.data);
          },
        });
      })
      .catch((error) => console.error('Error loading CSV:', error));
  }, []);

  return (
    <div className="newjobs">
        <Header/>
    <div className="page-container">
      <h1 className="title">🚀 Latest Job Listings</h1>
      <div className="job-grid">
        {jobs.map((job, index) => (
          <div className="job-card" key={index}>
            <div className="job-title">{job.title}</div>
            <div className="company-name">{job.company}</div>
            <div className="job-location">{job.location}</div>
            <div className="job-desc">
              {job.description?.slice(0, 140)}...
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="job-link"
              >
                View Job →
              </a>
              {job.is_remote === 'TRUE' && (
                <span className="remote-badge">Remote</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default FrontPage;
