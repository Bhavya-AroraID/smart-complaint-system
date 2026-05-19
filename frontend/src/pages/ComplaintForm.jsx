import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiMapPin, FiMail, FiUser, FiFileText, FiTag, FiAlignLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = ['Water Supply', 'Electricity', 'Roads', 'Garbage', 'Noise', 'Public Safety', 'Health', 'Other'];

const ComplaintForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: '',
    description: '',
    category: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/complaints`, formData);

      // Auto-analyze with AI
      try {
        await axios.post(`${API_URL}/ai/analyze`, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          complaintId: res.data.complaint._id
        });
      } catch (aiError) {
        console.log('AI analysis skipped');
      }

      toast.success('Complaint submitted successfully!');
      navigate('/complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>📝 Register New Complaint</h1>
        <p className="subtitle">Fill in the details below to submit your complaint</p>
      </div>

      <div className="form-container glass-card">
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-grid">
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                id="complaint-name"
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                id="complaint-email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group full-width">
              <FiFileText className="input-icon" />
              <input
                id="complaint-title"
                type="text"
                name="title"
                placeholder="Complaint Title (min 5 characters)"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={5}
              />
            </div>

            <div className="input-group">
              <FiTag className="input-icon" />
              <select
                id="complaint-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <FiMapPin className="input-icon" />
              <input
                id="complaint-location"
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group full-width">
              <FiAlignLeft className="input-icon textarea-icon" />
              <textarea
                id="complaint-description"
                name="description"
                placeholder="Describe your complaint in detail (min 10 characters)"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={5}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner-small"></span> : <><FiSend /> Submit Complaint</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
