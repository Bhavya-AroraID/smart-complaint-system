import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX, FiShield, FiHome, FiPlusCircle, FiList, FiCpu } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/complaints/new', label: 'New Complaint', icon: <FiPlusCircle /> },
    { path: '/complaints', label: 'All Complaints', icon: <FiList /> },
    { path: '/ai-analysis', label: 'AI Analysis', icon: <FiCpu /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <FiShield className="brand-icon" />
          <span>SmartComplaint</span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          {user && navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {user && (
            <div className="nav-user-section">
              <span className="nav-user-name">{user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
