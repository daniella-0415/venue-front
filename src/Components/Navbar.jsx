import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase-front";
import "./Navbar.css";

const auth = getAuth(app);

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("venueflowUser");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to read stored user:", error);
  }

  const role = user?.role || "Customer";

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }

    localStorage.removeItem("venueflowToken");
    localStorage.removeItem("venueflowUser");

    closeMenu();
    navigate("/login");
  }

  function getDashboardPath() {
    if (
      role === "Administrator" ||
      role === "Admin"
    ) {
      return "/admin";
    }

    if (
      role === "Venue Manager" ||
      role === "Manager"
    ) {
      return "/manager";
    }

    return "/events";
  }

  function getRoleLabel() {
    if (
      role === "Administrator" ||
      role === "Admin"
    ) {
      return "Administrator";
    }

    if (
      role === "Venue Manager" ||
      role === "Manager"
    ) {
      return "Venue Manager";
    }

    return "Customer";
  }

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to={getDashboardPath()}
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="navbar-logo-mark">
            V
          </span>

          <span className="navbar-logo-text">
            VenueFlow
          </span>
        </Link>


        {/* DESKTOP NAVIGATION */}

        <div className="navbar-links">

          {role === "Customer" && (
            <>
              <NavLink
                to="/events"
                className="navbar-link"
              >
                Events
              </NavLink>

              <NavLink
                to="/bookings"
                className="navbar-link"
              >
                My Bookings
              </NavLink>
            </>
          )}


          {(role === "Venue Manager" ||
            role === "Manager") && (
            <>
              <NavLink
                to="/manager"
                className="navbar-link"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/manager/venues"
                className="navbar-link"
              >
                Venues
              </NavLink>

              <NavLink
                to="/manager/events"
                className="navbar-link"
              >
                Events
              </NavLink>

              <NavLink
                to="/manager/bookings"
                className="navbar-link"
              >
                Bookings
              </NavLink>
            </>
          )}


          {(role === "Administrator" ||
            role === "Admin") && (
            <>
              <NavLink
                to="/admin"
                className="navbar-link"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/venues"
                className="navbar-link"
              >
                Venues
              </NavLink>
            </>
          )}

        </div>


        {/* USER AREA */}

        <div className="navbar-user-area">

          <div className="navbar-user">

            <div className="navbar-avatar">
              {(user?.name ||
                user?.email ||
                "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="navbar-user-info">

              <strong>
                {user?.name ||
                  user?.displayName ||
                  "User"}
              </strong>

              <span>
                {getRoleLabel()}
              </span>

            </div>

          </div>

          <button
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* MOBILE MENU BUTTON */}

        <button
          className={`navbar-menu-button ${
            menuOpen ? "open" : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>


      {/* MOBILE NAVIGATION */}

      {menuOpen && (
        <div className="navbar-mobile-menu">

          {role === "Customer" && (
            <>
              <NavLink
                to="/events"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Events
              </NavLink>

              <NavLink
                to="/bookings"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                My Bookings
              </NavLink>
            </>
          )}


          {(role === "Venue Manager" ||
            role === "Manager") && (
            <>
              <NavLink
                to="/manager"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/manager/venues"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Venues
              </NavLink>

              <NavLink
                to="/manager/events"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Events
              </NavLink>

              <NavLink
                to="/manager/bookings"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Bookings
              </NavLink>
            </>
          )}


          {(role === "Administrator" ||
            role === "Admin") && (
            <>
              <NavLink
                to="/admin"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/venues"
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                Venues
              </NavLink>
            </>
          )}


          <div className="navbar-mobile-user">

            <div className="navbar-user">

              <div className="navbar-avatar">
                {(user?.name ||
                  user?.email ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="navbar-user-info">

                <strong>
                  {user?.name ||
                    user?.displayName ||
                    "User"}
                </strong>

                <span>
                  {getRoleLabel()}
                </span>

              </div>

            </div>

            <button
              className="navbar-logout mobile-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;