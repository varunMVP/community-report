import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReportIssue({ user, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Roads',
    'Utilities',
    'Public Safety',
    'Sanitation',
    'Parks',
    'Street Lighting',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      
      if (image) {
        data.append('image', image);
      }

      await axios.post('http://localhost:5000/api/issues', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Issue reported successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <div className="dashboard-header">
        <div>
          <h1>🏛️ Report New Issue</h1>
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <button onClick={() => navigate('/dashboard')} className="btn-logout">
            Back to Dashboard
          </button>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="report-form">
        <h2>Report a Civic Issue</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Issue Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief title of the issue"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Detailed description of the issue"
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Street address or landmark"
            />
          </div>

          <div className="form-group">
            <label>Upload Image (Optional)</label>
            <div className="file-input-wrapper">
              <label className="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? '✅ Image Selected' : '📷 Click to upload image'}
              </label>
            </div>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Issue Report'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;