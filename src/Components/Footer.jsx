import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">


        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            <span className="footer-logo-mark">
              V
            </span>

            <span className="footer-logo-text">
              VenueFlow
            </span>
          </Link>

          <p>
            Your platform for discovering events,
            managing venues, and making bookings Tickets
            simple
          </p>

        </div>



        <div className="footer-column">

          <h3>
            Explore
          </h3>

          <Link to="/events">
            Events
          </Link>

          <Link to="/bookings">
            My Bookings
          </Link>

        </div>



        <div className="footer-column">

          <h3>
            Management
          </h3>

          <Link to="/manager">
            Manager Dashboard
          </Link>

          <Link to="/manager/venues">
            Manage Venues
          </Link>

          <Link to="/manager/events">
            Manage Events
          </Link>

          <Link to="/manager/bookings">
            View Bookings
          </Link>

        </div>



        <div className="footer-column">

          <h3>
            VenueFlow
          </h3>

          <Link to="/events">
            Browse Events
          </Link>

          <Link to="/login">
            Sign In
          </Link>

          <Link to="/signup">
            Create Account
          </Link>

        </div>

      </div>



      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
             {new Date().getFullYear()} VenueFlowThingy
            All rights reserved.
          </p>

          <p>
            Event booking made simple
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;