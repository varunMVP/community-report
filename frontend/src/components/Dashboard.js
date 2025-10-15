import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user, onLogout }) {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter 
        ? `http://localhost:5000/api/issues?status=${filter}`
        : 'http://localhost:5000/api/issues';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIssues(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch issues');
      setLoading(false);
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIssues(issues.filter(issue => issue._id !== issueId));
    } catch (err) {
      alert('Failed to delete issue');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>🏛️ Civic Issues Dashboard</h1>
        </div>
        <div className="user-info">
          <span className="user-name">Welcome, {user.name}</span>
          {user.role === 'admin' && <span className="admin-badge">ADMIN</span>}
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button className="nav-btn active">All Issues</button>
        <button className="nav-btn" onClick={() => navigate('/report')}>
          ➕ Report New Issue
        </button>
        {user.role === 'admin' && (
          <button className="nav-btn" onClick={() => navigate('/admin')}>
            👨‍💼 Admin Panel
          </button>
        )}
      </div>

      <div className="filters">
        <label>Filter by Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading issues...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : issues.length === 0 ? (
        <div className="no-issues">
          <p>No issues found. Be the first to report one!</p>
        </div>
      ) : (
        <div className="issues-grid">
          {issues.map(issue => (
            <div key={issue._id} className="issue-card">
              {issue.image && (
                <img 
                  src={`http://localhost:5000${issue.image}`} 
                  alt={issue.title}
                  className="issue-image"
                />
              )}
              
              <div className="issue-content">
                <div className="issue-header">
                  <div>
                    <h3 className="issue-title">{issue.title}</h3>
                    <span className="issue-category">{issue.category}</span>
                  </div>
                </div>

                <p className="issue-description">{issue.description}</p>
                
                <div className="issue-location">
                  📍 {issue.location}
                </div>

                <div className="issue-footer">
                  <span className={`issue-status ${issue.status.replace(' ', '-')}`}>
                    {issue.status.toUpperCase()}
                  </span>
                  <div className="issue-meta">
                    <div>By: {issue.userName}</div>
                    <div>{formatDate(issue.createdAt)}</div>
                  </div>
                </div>

                {issue.userId === user.id && (
                  <div className="issue-actions">
                    <button 
                      onClick={() => handleDelete(issue._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;