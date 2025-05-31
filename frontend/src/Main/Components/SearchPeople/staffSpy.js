import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Staff from '../../../StaffSpy-main/staff.csv'

function StaffProfiles() {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    // Fetch CSV file from public folder
    fetch(Staff)
      .then((response) => response.text())
      .then((csvText) => {
        // Parse CSV text to JSON array
        Papa.parse(csvText, {
          header: true, // first row is header
          skipEmptyLines: true,
          complete: (results) => {
            setStaffData(results.data);
          },
        });
      });
  }, []);

  // A helper to parse JSON-string columns (like experiences, schools)
  const parseJSONField = (field) => {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  return (
    <div>
      <h1>Staff Profiles</h1>
      {staffData.length === 0 && <p>Loading...</p>}
      {staffData.map((user, idx) => {
        const experiences = parseJSONField(user.experiences);
        const schools = parseJSONField(user.schools);
        const skills = parseJSONField(user.skills);

        return (
          <div key={idx} style={{ border: "1px solid gray", marginBottom: 20, padding: 15 }}>
            <h2>{user.name}</h2>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Headline:</strong> {user.headline}</p>
            <p><strong>Current Company:</strong> {user.current_company}</p>

            <h3>Experiences</h3>
            <ul>
              {experiences.map((exp, i) => (
                <li key={i}>
                  <b>{exp.title}</b> at {exp.company} ({exp.start_date} - {exp.end_date || "Present"})
                </li>
              ))}
            </ul>

            <h3>Education</h3>
            <ul>
              {schools.map((school, i) => (
                <li key={i}>{school.degree} from {school.school}</li>
              ))}
            </ul>

            <h3>Skills</h3>
            <ul>
              {skills.map((skill, i) => (
                <li key={i}>{skill.name}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default StaffProfiles;
