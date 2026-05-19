import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiCpu, FiMapPin, FiMail, FiUser, FiCalendar, FiTag, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints/${id}`);
      setComplaint(res.data);
      setStatus(res.data.status);
    } catch (error) {
      toast.error('Failed to fetch complaint details');
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${API_URL}/complaints/${id}`, { status });
      toast.success('Status updated successfully!');
      fetchComplaint();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await axios.post(`${API_URL}/ai/analyze`, {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        complaintId: complaint._id
      });
      toast.success('AI Analysis completed!');
      fetchComplaint();
    } catch (error) {
      toast.error('AI Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (s) => {
    const colors = { 'Pending': '#f59e0b', 'In Progress': '#3b82f6', 'Resolved': '#10b981', 'Rejected': '#ef4444' };
    return colors[s] || '#6b7280';
  };

  const getPriorityBadge = (priority) => {
    const classes = { 'Low': 'badge-low', 'Medium': 'badge-medium', 'High': 'badge-high', 'Critical': 'badge-critical' };
    return classes[priority] || 'badge-medium';
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>;
  if (!complaint) return null;

  return (
    <div className="detail-page">
      <button className="btn btn-secondary btn-back" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="detail-grid">
        <div className="detail-main glass-card">
          <div className="detail-header">
            <h1>{complaint.title}</h1>
            <div className="detail-badges">
              <span className={`badge ${getPriorityBadge(complaint.priority)}`}>{complaint.priority} Priority</span>
              <span className="badge badge-category">{complaint.category}</span>
            </div>
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{complaint.description}</p>
          </div>

          <div className="detail-meta-grid">
            <div className="meta-item">
              <FiUser className="meta-icon" />
              <div>
                <label>Reported By</label>
                <span>{complaint.name}</span>
              </div>
            </div>
            <div className="meta-item">
              <FiMail className="meta-icon" />
              <div>
                <label>Email</label>
                <span>{complaint.email}</span>
              </div>
            </div>
            <div className="meta-item">
              <FiMapPin className="meta-icon" />
              <div>
                <label>Location</label>
                <span>{complaint.location}</span>
              </div>
            </div>
            <div className="meta-item">
              <FiCalendar className="meta-icon" />
              <div>
                <label>Submitted On</label>
                <span>{new Date(complaint.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="status-card glass-card">
            <h3><FiCheckCircle /> Update Status</h3>
            <div className="current-status">
              <span className="status-dot-lg" style={{ backgroundColor: getStatusColor(complaint.status) }}></span>
              <span>Current: <strong>{complaint.status}</strong></span>
            </div>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button className="btn btn-primary btn-block" onClick={handleStatusUpdate}>
              Update Status
            </button>
          </div>

          <div className="ai-card glass-card">
            <h3><FiCpu /> AI Analysis</h3>
            {complaint.aiAnalysis?.priority ? (
              <div className="ai-results">
                <div className="ai-result-item">
                  <label>Priority Level</label>
                  <span className={`badge ${getPriorityBadge(complaint.aiAnalysis.priority)}`}>
                    {complaint.aiAnalysis.priority}
                  </span>
                </div>
                <div className="ai-result-item">
                  <label>Recommended Department</label>
                  <span className="ai-dept">{complaint.aiAnalysis.department}</span>
                </div>
                <div className="ai-result-item">
                  <label>Summary</label>
                  <p className="ai-summary">{complaint.aiAnalysis.summary}</p>
                </div>
                <div className="ai-result-item">
                  <label>Auto Response</label>
                  <p className="ai-response">{complaint.aiAnalysis.autoResponse}</p>
                </div>
                <p className="ai-timestamp">Analyzed: {new Date(complaint.aiAnalysis.analyzedAt).toLocaleString()}</p>
              </div>
            ) : (
              <div className="ai-empty">
                <p>No AI analysis yet</p>
                <button className="btn btn-accent btn-block" onClick={handleAIAnalysis} disabled={analyzing}>
                  {analyzing ? <span className="spinner-small"></span> : <><FiCpu /> Run AI Analysis</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
