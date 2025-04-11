import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './SearchPeople.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Connections from './Connections';
import axios from 'axios';

const SearchPeople = () => {
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://api.sheetbest.com/sheets/6794bafd-366b-4b94-a42f-ac3629755813'); // Replace with your actual API URL
        setPeople(res.data);
      } catch (err) {
        console.error('Error fetching people from sheet:', err);
      }
    };

    fetchData();
  }, []);

  const branches = [...new Set(people.map(p => p.branch))];
  const years = [...new Set(people.map(p => p.year))];

  const resetFilters = () => {
    setQuery('');
    setSelectedBranch('');
    setSelectedYear('');
  };

  const filteredPeople = people.filter(person => {
    const matchQuery = person.name?.toLowerCase().includes(query.toLowerCase());
    const matchBranch = selectedBranch ? person.branch === selectedBranch : true;
    const matchYear = selectedYear ? person.year === selectedYear : true;
    return matchQuery && matchBranch && matchYear;
  });

  return (
    <>
      <Header />
      <div className="main-wrapper">
        <div className="left-section">
          <div className="search-people-container">
            <h2>Search People</h2>
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search by name..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="filter-input"
              />

              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="filter-dropdown"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="filter-dropdown"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button onClick={resetFilters} className="filter-reset-btn">
                All
              </button>
            </div>

            <div className="people-list-searchPeople">
              {filteredPeople.length === 0 ? (
                <p>No people found.</p>
              ) : (
                filteredPeople.map((person, index) => {
                  const firstName = person.name.split(' ')[0]; // Get the first name
                  return (
                    <div key={index} className="person-card-searchPeople">
                      <div className="person-left">
                        <Link to={`/profile/${person.email}`}> {/* Link to the profile page */}
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`} // Use first name only
                            alt={person.name}
                            className="avatar"
                          />
                        </Link>
                        <div className="person-details">
                          <h4>{person.name} {person.surname}</h4>
                          <p><i className="fas fa-graduation-cap"></i> {person.branch}</p>
                          <p><i className="fas fa-calendar-alt"></i> Class of {person.year}</p>
                          <p><i className="fas fa-briefcase"></i> {person.email}</p>
                        </div>
                      </div>
                      <div className="person-actions-searchPeople">
                        <button className="connect-btn">Connect</button>
                        <button className="message-btn">Message</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="right-section">
          <Connections />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPeople;
