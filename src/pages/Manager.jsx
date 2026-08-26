import React from "react";
import { Link } from "react-router-dom";
import "./Manager.css";

function Manager() {
  return (
    <div className="manager-page">

      <div className="manager-header">
        <div>
          <span className="page-label">
            VENUE MANAGER
          </span>

          <h1>Manager Dashboard</h1>

          <p>
            Manage your venues, events and bookings.
          </p>
        </div>
      </div>

      <div className="manager-cards">

        <Link to="/manager/venues" className="manager-card">
          <span className="manager-card-icon">📍</span>

          <h2>Venues</h2>

          <p>
            Create and manage your venues,
            seating capacity and locations.
          </p>

          <span className="manager-card-link">
            Manage Venues →
          </span>
        </Link>

        <Link to="/manager/events" className="manager-card">
          <span className="manager-card-icon">🎫</span>

          <h2>Events</h2>

          <p>
            Create and manage events,
            dates, tickets and venues.
          </p>

          <span className="manager-card-link">
            Manage Events →
          </span>
        </Link>

        <Link to="/manager/bookings" className="manager-card">
          <span className="manager-card-icon">📋</span>

          <h2>Bookings</h2>

          <p>
            View and monitor bookings
            for your events.
          </p>

          <span className="manager-card-link">
            View Bookings →
          </span>
        </Link>

      </div>

      <div className="manager-actions">

        <h2>Quick Actions</h2>

        <div className="quick-actions">

          <Link to="/manager/venues" className="quick-action">
            + Create Venue
          </Link>

          <Link to="/manager/events" className="quick-action">
            + Create Event
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Manager;