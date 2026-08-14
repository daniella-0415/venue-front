import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Firebase logout will be added here
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        Venue<span>Flow</span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/events">
          Events
        </Link>

        <Link to="/venues">
          Venues
        </Link>

        {user && role === "Customer" && (
          <>
            <Link to="/bookings">
              My Bookings
            </Link>

            <Link to="/booking-history">
              Booking History
            </Link>

            <Link to="/profile">
              Profile
            </Link>
          </>
        )}

        {user && role === "Manager" && (
          <Link to="/manager-dashboard">
            Manager Dashboard
          </Link>
        )}

        {user && role === "Admin" && (
          <Link to="/admin-dashboard">
            Admin Dashboard
          </Link>
        )}

      </div>

      <div className="nav-user">

        {user ? (
          <>
            <span className="user-name">
              {user.email}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="logout-btn">
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;