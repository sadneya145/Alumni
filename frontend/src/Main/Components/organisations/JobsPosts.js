import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import JobsPost from "../../../StaffSpy-main/jobPost.csv"; // make sure staff.csv is here

const JobsPosts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(JobsPost)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        setData(parsed.data);
      });
  }, []);

  return (
    <div>
      <h2>Scraped LinkedIn Staff</h2>
      {data.map((person, i) => (
        <div key={i}>
          <strong>{person.full_name}</strong> - {person.headline}
          <br />
          <a href={person.profile_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default JobsPosts;
