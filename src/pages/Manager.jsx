import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Manager.css";

function Manager() {
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);

  const [stats, setStats] = useState({
    bookings: 0,
    ticketsSold: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadManagerData();
  }, []);

  async function loadManagerData() {
    try {
      setLoading(true);
      setError("");

      const profileData = await apiRequest("/api/profile");

      setProfile(profileData);

      const venuesData = await apiRequest("/api/venues");

      const allVenues = Array.isArray(venuesData)
        ? venuesData
        : [];

      const managerVenues = allVenues.filter((venue) => {
        const managerId =
          typeof venue.managerId === "object"
            ? venue.managerId?._id
            : venue.managerId;

        return (
          managerId?.toString() ===
          profileData?._id?.toString()
        );
      });

      setVenues(managerVenues);

      const eventsData = await apiRequest("/api/events");

      const allEvents = Array.isArray(eventsData)
        ? eventsData
        : [];

      const managerVenueIds = managerVenues.map(
        (venue) => venue._id?.toString()
      );

      const managerEvents = allEvents.filter((event) => {
        const venueId =
          typeof event.venueId === "object"
            ? event.venueId?._id
            : event.venueId;

        return managerVenueIds.includes(
          venueId?.toString()
        );
      });

      setEvents(managerEvents);

      const performanceData = await Promise.all(
        managerVenues.map((venue) =>
          apiRequest(
            `/api/venues/${venue._id}/performance`
          )
        )
      );

      const totals = performanceData.reduce(
        (result, performance) => {
          result.bookings += Number(
            performance?.bookings || 0
          );

          result.ticketsSold += Number(
            performance?.ticketsSold || 0
          );

          result.revenue += Number(
            performance?.totalRevenue || 0
          );

          return result;
        },
        {
          bookings: 0,
          ticketsSold: 0,
          revenue: 0,
        }
      );

      setStats(totals);

    } catch (err) {
      console.error(
        "Manager dashboard error:",
        err
      );

      setError(
        err.message ||
        "Failed to load manager dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="manager-page">
        <div className="manager-loading">
          <div className="loading-spinner"></div>
          <p>Loading manager dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-page">
        <div className="manager-error">
          <div className="error-icon">!</div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>{error}</p>

          <button onClick={loadManagerData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-page">


      <div className="manager-header">
        <div>

          <p className="manager-label">
            VENUE MANAGEMENT
          </p>

          <h1>
            Manager Dashboard
          </h1>

          <p className="manager-subtitle">
            Welcome back
            {profile?.name
              ? `, ${profile.name}`
              : ""}.
            Manage your venues, events and bookings.
          </p>

        </div>

        <button
          className="manager-refresh-button"
          onClick={loadManagerData}
        >
          ↻ Refresh
        </button>
      </div>



      <div className="manager-stats-grid">

        <div className="manager-stat-card">

          

          <div>
            <span>My Venues</span>
            <strong>{venues.length}</strong>
          </div>

        </div>


        <div className="manager-stat-card">

          

          <div>
            <span>My Events</span>
            <strong>{events.length}</strong>
          </div>

        </div>


        <div className="manager-stat-card">

         

          <div>
            <span>Total Bookings</span>
            <strong>{stats.bookings}</strong>
          </div>

        </div>


        <div className="manager-stat-card revenue-card">

          

          <div>
            <span>Revenue</span>

            <strong>
              R{stats.revenue.toLocaleString("en-ZA")}
            </strong>
          </div>

        </div>

      </div>



      <section className="manager-section">

        <div className="manager-section-heading">
          <div>

            <p className="manager-label">
              QUICK ACTIONS
            </p>

            <h2>
              Manage Your Platform
            </h2>

          </div>
        </div>


        <div className="manager-actions-grid">

          <Link
            to="/manager/venues"
            className="manager-action-card"
          >

            

            <div>

              <h3>
                My Venues
              </h3>

              <p>
                View and manage your assigned venues.
              </p>

            </div>

            <span>→</span>

          </Link>


          <Link
            to="/manager/events"
            className="manager-action-card"
          >

           

            <div>

              <h3>
                My Events
              </h3>

              <p>
                Create and manage events at your venues.
              </p>

            </div>

            <span>→</span>

          </Link>


          <Link
            to="/manager/bookings"
            className="manager-action-card"
          >


            <div>

              <h3>
                Bookings
              </h3>

              <p>
                View bookings for your events.
              </p>

            </div>

          </Link>

        </div>

      </section>



      <section className="manager-section">

        <div className="manager-section-heading">

          <div>

            <p className="manager-label">
              VENUES
            </p>

            <h2>
              My Venues
            </h2>

          </div>

          <Link
            to="/manager/venues"
            className="manager-view-all"
          >
            View All 
          </Link>

        </div>


        {venues.length === 0 ? (

          <div className="manager-empty">


            <h3>
              No venues found
            </h3>

            <p>
              You don't have any assigned venues yet.
            </p>

          </div>

        ) : (

          <div className="manager-venue-grid">

            {venues.slice(0, 4).map((venue) => (

              <div
                className="manager-venue-card"
                key={venue._id}
              >

               

                <div className="venue-card-content">

                  <h3>
                    {venue.venueName || venue.name}
                  </h3>

                  <p>
                    {venue.address || "No address"}
                  </p>

                  <div className="venue-card-meta">

                    <span>
                      {venue.city || "Unknown city"}
                    </span>

                    <span>
                      {venue.capacity || 0} seats
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* EVENTS */}

      <section className="manager-section">

        <div className="manager-section-heading">

          <div>

            <p className="manager-label">
              EVENTS
            </p>

            <h2>
              My Events
            </h2>

          </div>

          <Link
            to="/manager/events"
            className="manager-view-all"
          >
            View All 
          </Link>

        </div>


        {events.length === 0 ? (

          <div className="manager-empty">

           

            <h3>
              No events found
            </h3>

            <p>
              Create your first event to get started.
            </p>

          </div>

        ) : (

          <div className="manager-events-table-wrapper">

            <table className="manager-events-table">

              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>VENUE</th>
                  <th>DATE</th>
                  <th>PRICE</th>
                </tr>
              </thead>

              <tbody>

                {events.slice(0, 8).map((event) => (

                  <tr key={event._id}>

                    <td>
                      <strong>
                        {event.title}
                      </strong>
                    </td>

                    <td>
                      {event.venueId?.name ||
                        event.venue ||
                        "N/A"}
                    </td>

                    <td>
                      {event.date
                        ? new Date(
                            event.date
                          ).toLocaleDateString("en-ZA")
                        : "N/A"}
                    </td>

                    <td className="manager-price">
                      R
                      {Number(
                        event.ticketPrice || 0
                      ).toFixed(2)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>



      <section className="manager-bottom-grid">

        <div className="manager-summary-card">

          <div className="manager-summary-header">

            <div>

              <p className="manager-label">
                BOOKINGS
              </p>

              <h3>
                Tickets Sold
              </h3>

            </div>

           

          </div>

          <strong className="manager-summary-number">
            {stats.ticketsSold}
          </strong>

          <p>
            Tickets associated with your events.
          </p>

        </div>


        <div className="manager-summary-card">

          <div className="manager-summary-header">

            <div>

              <p className="manager-label">
                REVENUE
              </p>

              <h3>
                Booking Revenue
              </h3>

            </div>

            <span>
              R
            </span>

          </div>

          <strong className="manager-summary-number">
            R{stats.revenue.toLocaleString("en-ZA")}
          </strong>

          <p>
            Revenue from bookings for your venues.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Manager;