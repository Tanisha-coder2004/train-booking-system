import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Ticket } from "lucide-react";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentHold');
    navigate('/');
    window.location.reload(); // Simple way to reset state across all components
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="icon">🚅</span>
        TrainTick
      </Link>
      
      <div className="nav-links">
        <Link to="/search" className="nav-item">Search</Link>
        
        {token ? (
          <>
            <Link to="/bookings" className="nav-item">
              <Ticket size={14} />
              Bookings
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
