import React, { useEffect, useState } from 'react';
import API from '../api/api';
import ReportForm from '../components/ReportForm';

export default function UserDashboard({ user }) {
  const [complaints, setComplaints] = useState([]);

  const fetch = async () => {
    const res = await API.get(`/complaints/user/${user._id}`);
    setComplaints(res.data);
  };

  useEffect(()=>{ fetch(); }, []);

  return (
    <div>
      <h1>Community Issues</h1>
      <ReportForm user={user} onSubmitted={fetch} />
      <ul>
        {complaints.map(c => (
          <li key={c._id}>{c.title} — {c.category} — {c.status}</li>
        ))}
      </ul>
    </div>
  );
}
