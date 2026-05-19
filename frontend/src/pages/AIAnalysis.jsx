import { useState } from 'react';
import axios from 'axios';
import { FiCpu, FiSend, FiAlertTriangle, FiUsers, FiFileText, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = ['Water Supply', 'Electricity', 'Roads', 'Garbage', 'Noise', 'Public Safety', 'Health', 'Other'];

const AIAnalysis = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await axios.post(`${API_URL}/ai/analyze`, formData);
      setAnalysis(res.data.analysis);
      toast.success('AI Analysis completed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#f97316', 'Critical': '#ef4444' };
    return colors[priority] || '#6b7280';
  };

  const getPriorityBadge = (priority) => {
    const classes = { 'Low': 'badge-low', 'Medium': 'badge-medium', 'High': 'badge-high', 'Critical': 'badge-critical' };
    return classes[priority] || 'badge-medium';
  };

  return (
    <div className="ai-page">
      <div className="page-header">
        <h1><FiCpu /> AI Complaint Analyzer</h1>
        <p className="subtitle">Analyze any complaint to detect priority, suggest department, and generate responses</p>
      </div>

      <div className="ai-layout">
        <div className="ai-form-section glass-card">
          <h2>Enter Complaint Details</h2>
          <form onSubmit={handleAnalyze}>
            <div className="input-group">
              <input
                id="ai-title"
                type="text"
                name="title"
                placeholder="Complaint Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <select
                id="ai-category"
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
              <textarea
                id="ai-description"
                name="description"
                placeholder="Describe the complaint in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
              {loading ? <span className="spinner-small"></span> : <><FiCpu /> Analyze with AI</>}
            </button>
          </form>
        </div>

        {analysis && (
          <div className="ai-results-section">
            <div className="ai-result-card glass-card priority-card">
              <div className="result-icon" style={{ backgroundColor: getPriorityColor(analysis.priority) + '22', color: getPriorityColor(analysis.priority) }}>
                <FiAlertTriangle />
              </div>
              <h3>Priority Detection</h3>
              <span className={`badge badge-lg ${getPriorityBadge(analysis.priority)}`}>
                {analysis.priority}
              </span>
              <div className="priority-bar">
                <div className="priority-fill" style={{ width: `${analysis.priorityScore}%`, backgroundColor: getPriorityColor(analysis.priority) }}></div>
              </div>
              <p className="score-text">Urgency Score: {analysis.priorityScore}/100</p>
            </div>

            <div className="ai-result-card glass-card dept-card">
              <div className="result-icon" style={{ backgroundColor: '#3b82f622', color: '#3b82f6' }}>
                <FiUsers />
              </div>
              <h3>Recommended Department</h3>
              <p className="dept-name">{analysis.department}</p>
            </div>

            <div className="ai-result-card glass-card summary-card">
              <div className="result-icon" style={{ backgroundColor: '#8b5cf622', color: '#8b5cf6' }}>
                <FiFileText />
              </div>
              <h3>Complaint Summary</h3>
              <p className="summary-text">{analysis.summary}</p>
            </div>

            <div className="ai-result-card glass-card response-card">
              <div className="result-icon" style={{ backgroundColor: '#10b98122', color: '#10b981' }}>
                <FiMessageSquare />
              </div>
              <h3>Auto-Generated Response</h3>
              <p className="response-text">{analysis.autoResponse}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
