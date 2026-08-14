import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../services/api";

function AdminDashboard() {
  const [stats, setStats] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data =
        await apiRequest(
          "/api/admin/stats"
        );

      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">

      <div className="dashboard-header">

        <div>
          <p className="section-label">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard
          </h1>
        </div>

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {stats && (
        <div className="stats-grid">

          <div className="stat-card">
            <span>👥</span>
            <h2>{stats.users}</h2>
            <p>Users</p>
          </div>

          <div className="stat-card">
            <span>🏢</span>
            <h2>{stats.venues}</h2>
            <p>Venues</p>
          </div>

          <div className="stat-card">
            <span>🎭</span>
            <h2>{stats.events}</h2>
            <p>Events</p>
          </div>

          <div className="stat-card">
            <span>🎟️</span>
            <h2>{stats.bookings}</h2>
            <p>Bookings</p>
          </div>

          <div className="stat-card">
            <span>💰</span>
            <h2>
              R{stats.totalRevenue}
            </h2>
            <p>Revenue</p>
          </div>

        </div>
      )}

      <div className="dashboard-grid">

        <Link
          to="/admin/users"
          className="dashboard-card"
        >
          <span>👥</span>

          <h2>
            User Management
          </h2>

          <p>
            Manage platform users.
          </p>
        </Link>

        <Link
          to="/events"
          className="dashboard-card"
        >
          <span>🎭</span>

          <h2>
            Events
          </h2>

          <p>
            View all events.
          </p>
        </Link>

        <Link
          to="/venues"
          className="dashboard-card"
        >
          <span>🏢</span>

          <h2>
            Venues
          </h2>

          <p>
            View all venues.
          </p>
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;