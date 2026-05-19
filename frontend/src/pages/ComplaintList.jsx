import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiFilter, FiMapPin, FiTrash2, FiEye, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = ['All', 'Water Supply', 'Electricity', 'Roads', 'Garbage', 'Noise', 'Public Safety', 'Health', 'Other'];

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      params.limit = 100;

      const res = await axios.get(`${API_URL}/complaints`, { params });
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      fetchComplaints();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/complaints/search?location=${searchLocation}`);
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await axios.delete(`${API_URL}/complaints/${id}`);
      toast.success('Complaint deleted successfully');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'In Progress': '#3b82f6',
      'Resolved': '#10b981',
      'Rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      'Low': 'badge-low',
      'Medium': 'badge-medium',
      'High': 'badge-high',
      'Critical': 'badge-critical'
    };
    return classes[priority] || 'badge-medium';
  };

  return (
    <div className="list-page">
      <div className="page-header">
        <div>
          <h1>📋 All Complaints</h1>
          <p className="subtitle">{total} complaints found</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchComplaints}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="filters-bar glass-card">
        <div className="filter-group">
          <FiFilter className="filter-icon" />
          <div className="category-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="search-group">
          <div className="input-group search-input">
            <FiMapPin className="input-icon" />
            <input
              id="search-location"
              type="text"
              placeholder="Search by location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            <FiSearch /> Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div><p>Loading complaints...</p></div>
      ) : complaints.length === 0 ? (
        <div className="empty-state glass-card">
          <p>No complaints found.</p>
          <Link to="/complaints/new" className="btn btn-primary">Create New Complaint</Link>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map(complaint => (
            <div key={complaint._id} className="complaint-card glass-card">
              <div className="card-header">
                <span className={`badge ${getPriorityBadge(complaint.priority)}`}>{complaint.priority}</span>
                <span className="card-date">{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 className="card-title">{complaint.title}</h3>
              <p className="card-desc">{complaint.description.substring(0, 120)}...</p>

              <div className="card-meta">
                <span className="badge badge-category">{complaint.category}</span>
                <span className="card-location"><FiMapPin /> {complaint.location}</span>
              </div>

              <div className="card-footer">
                <div className="card-status">
                  <span className="status-dot" style={{ backgroundColor: getStatusColor(complaint.status) }}></span>
                  {complaint.status}
                </div>
                <div className="card-actions">
                  <Link to={`/complaints/${complaint._id}`} className="btn-icon" title="View Details">
                    <FiEye />
                  </Link>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(complaint._id)} title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
