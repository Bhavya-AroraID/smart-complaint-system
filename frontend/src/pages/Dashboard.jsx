import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle, FiAlertCircle, FiCheckCircle, FiClock, FiTrendingUp, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    critical: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints?limit=100`);
      const complaints = res.data.complaints;

      setStats({
        total: res.data.total,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        rejected: complaints.filter(c => c.status === 'Rejected').length,
        critical: complaints.filter(c => c.priority === 'Critical').length
      });

      setRecentComplaints(complaints.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p className="subtitle">Here's your complaint management overview</p>
        </div>
        <Link to="/complaints/new" className="btn btn-primary">
          <FiPlusCircle /> New Complaint
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card stat-total">
          <div className="stat-icon-wrap"><FiTrendingUp /></div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>
        </div>
        <div className="stat-card glass-card stat-pending">
          <div className="stat-icon-wrap"><FiClock /></div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card glass-card stat-progress">
          <div className="stat-icon-wrap"><FiAlertCircle /></div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card glass-card stat-resolved">
          <div className="stat-icon-wrap"><FiCheckCircle /></div>
          <div className="stat-info">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card glass-card stat-rejected">
          <div className="stat-icon-wrap"><FiXCircle /></div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
        <div className="stat-card glass-card stat-critical">
          <div className="stat-icon-wrap"><FiAlertCircle /></div>
          <div className="stat-info">
            <h3>{stats.critical}</h3>
            <p>Critical</p>
          </div>
        </div>
      </div>

      <div className="recent-section glass-card">
        <div className="section-header">
          <h2>Recent Complaints</h2>
          <Link to="/complaints" className="link-more">View All →</Link>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="empty-state">
            <FiAlertCircle className="empty-icon" />
            <p>No complaints yet. Create your first one!</p>
            <Link to="/complaints/new" className="btn btn-primary">
              <FiPlusCircle /> Create Complaint
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map(complaint => (
                  <tr key={complaint._id}>
                    <td>
                      <Link to={`/complaints/${complaint._id}`} className="table-link">
                        {complaint.title}
                      </Link>
                    </td>
                    <td><span className="badge badge-category">{complaint.category}</span></td>
                    <td>{complaint.location}</td>
                    <td><span className={`badge ${getPriorityBadge(complaint.priority)}`}>{complaint.priority}</span></td>
                    <td>
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(complaint.status) }}></span>
                      {complaint.status}
                    </td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
