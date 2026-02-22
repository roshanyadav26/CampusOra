import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
let user = null;

try {
  user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
  localStorage.removeItem("user"); // remove bad data
}  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      
      {/* ===== LEFT SECTION ===== */}
      <div className="nav-left">
        <h2 className="logo">CampusOra</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/owner-dashboard">My Rooms</Link>

          {token && user?.role === "student" && (
            <Link to="/rooms">Rooms</Link>
          )}

          {token && user?.role === "owner" && (
            <Link to="/add-room">Add Room</Link>
          )}

          {/* ✅ Messages for both */}
          {token && (
            <Link to="/chat">Messages</Link>
          )}

          <Link to="/contact">Contact</Link>
        </div>
      </div>  {/* ✅ THIS WAS MISSING */}

      {/* ===== RIGHT SECTION ===== */}
      <div className="nav-right">
        {!token && (
          <>
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}

        {token && (
          <div className="profile-wrapper">
            <div
              className="profile-trigger"
              onClick={() => setOpen(!open)}
            >
              <span className="profile-icon">👤</span>
              <span className="profile-name">{user?.name}</span>
              <span className="caret">▼</span>
            </div>

            {open && (
              <div className="profile-dropdown">
                <p className="dropdown-name">{user?.name}</p>
                <p className="dropdown-role">
                  {user?.role === "student" ? "Student" : "Room Owner"}
                </p>
                <hr />
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
