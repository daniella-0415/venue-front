import { Link } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">

      <div className="dashboard-header">

        <div>
          <p className="section-label">
            VENUE MANAGER
          </p>

          <h1>
            Welcome, {user?.name}
          </h1>

          <p>
            Manage your venues, events
            and bookings.
          </p>
        </div>

      </div>

      <div className="dashboard-grid">

        <Link
          to="/manager/venues"
          className="dashboard-card"
        >
          <span></span>

          <h2>
            Manage Venues
          </h2>

          <p>
            Create and manage your venues.
          </p>
        </Link>

        <Link
          to="/manager/events"
          className="dashboard-card"
        >
          <span></span>

          <h2>
            Manage Events
          </h2>

          <p>
            Create and manage events.
          </p>
        </Link>

        <Link
          to="/manager/bookings"
          className="dashboard-card"
        >
          <span></span>

          <h2>
            View Bookings
          </h2>

          <p>
            Monitor event bookings.
          </p>
        </Link>

      </div>

    </div>
  );
}

export default ManagerDashboard;