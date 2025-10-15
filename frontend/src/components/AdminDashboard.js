import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard({ user, onLogout }) {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchIssues();
  }, [filter, user, navigate]);

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

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      fetchIssues();
    } catch (err) {
      alert('Failed to update status');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStats = () => {
    return {
      total: issues.length,
      open: issues.filter(i => i.status === 'open').length,
      inProgress: issues.filter(i => i.status === 'in progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      closed: issues.filter(i => i.status === 'closed').length
    };
  };

  const stats = getStatusStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>👨‍💼 Admin Dashboard</h1>
        </div>
        <div className="user-info">
          <span className="admin-badge">ADMIN</span>
          <span className="user-name">{user.name}</span>
          <button onClick={() => navigate('/dashboard')} className="btn-logout">
            User View
          </button>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <h3 style={{ color: '#667eea', fontSize: '32px', margin: '0' }}>{stats.total}</h3>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Total Issues</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <h3 style={{ color: '#ffc107', fontSize: '32px', margin: '0' }}>{stats.open}</h3>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Open</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <h3 style={{ color: '#17a2b8', fontSize: '32px', margin: '0' }}>{stats.inProgress}</h3>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>In Progress</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <h3 style={{ color: '#28a745', fontSize: '32px', margin: '0' }}>{stats.resolved}</h3>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Resolved</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <h3 style={{ color: '#6c757d', fontSize: '32px', margin: '0' }}>{stats.closed}</h3>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Closed</p>
        </div>
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
          <p>No issues found.</p>
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

                <div className="issue-actions">
                  <select 
                    value={issue.status}
                    onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                    className="btn-update-status"
                  >
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button 
                    onClick={() => handleDelete(issue._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;