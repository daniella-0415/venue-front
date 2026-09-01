import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Manager.css";

function ManagerBookings() {
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // GET CURRENT MANAGER PROFILE
      // -----------------------------------------

      const profileData = await apiRequest("/api/profile");
      setProfile(profileData);

      // -----------------------------------------
      // GET ALL VENUES
      // -----------------------------------------

      const venuesData = await apiRequest("/api/venues");

      const allVenues = Array.isArray(venuesData)
        ? venuesData
        : [];

      // -----------------------------------------
      // ONLY KEEP THIS MANAGER'S VENUES
      // -----------------------------------------

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

      // -----------------------------------------
      // GET ALL EVENTS
      // -----------------------------------------

      const eventsData = await apiRequest("/api/events");

      const allEvents = Array.isArray(eventsData)
        ? eventsData
        : [];

      // -----------------------------------------
      // GET MANAGER VENUE IDS
      // -----------------------------------------

      const managerVenueIds = managerVenues.map(
        (venue) => venue._id?.toString()
      );

      // -----------------------------------------
      // ONLY KEEP EVENTS AT MANAGER VENUES
      // -----------------------------------------

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

      // -----------------------------------------
      // GET BOOKINGS FOR EACH MANAGER EVENT
      // -----------------------------------------

      const bookingResponses = await Promise.all(
        managerEvents.map(async (event) => {
          try {
            const response = await apiRequest(
              `/api/events/${event._id}/bookings`
            );

            return response;
          } catch (eventError) {
            console.error(
              `Failed to load bookings for event ${event._id}:`,
              eventError
            );

            return null;
          }
        })
      );

      // -----------------------------------------
      // COMBINE BOOKINGS FROM ALL EVENTS
      // -----------------------------------------

      const managerBookings = bookingResponses
        .filter(Boolean)
        .flatMap((response) =>
          Array.isArray(response?.bookings)
            ? response.bookings
            : []
        );

      setBookings(managerBookings);

    } catch (err) {
      console.error(
        "Manager bookings error:",
        err
      );

      setError(
        err.message ||
          "Failed to load manager bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // HELPERS
  // -----------------------------------------

  function getEventName(booking) {
    if (booking.eventId?.title) {
      return booking.eventId.title;
    }

    const event = events.find(
      (item) =>
        item._id?.toString() ===
        booking.eventId?.toString()
    );

    return event?.title || "Unknown event";
  }

  function getCustomerName(booking) {
    // Backend populates customerId
    if (booking.customerId?.name) {
      return booking.customerId.name;
    }

    return "Customer";
  }

  function getBookingDate(booking) {
    const date =
      booking.createdAt ||
      booking.bookingDate ||
      booking.date;

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-ZA"
    );
  }

  function getBookingAmount(booking) {
    return Number(
      booking.totalPrice || 0
    );
  }

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="manager-page">
        <div className="manager-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error) {
    return (
      <div className="manager-page">
        <div className="manager-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load bookings
          </h2>

          <p>
            {error}
          </p>

          <button onClick={loadBookings}>
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  const revenue = bookings.reduce(
    (total, booking) =>
      total + getBookingAmount(booking),
    0
  );

  return (
    <div className="manager-page">

      {/* HEADER */}

      <div className="manager-header">

        <div>

          <p className="manager-label">
            VENUE MANAGEMENT
          </p>

          <h1>
            My Bookings
          </h1>

          <p className="manager-subtitle">
            View bookings made for events at your venues
          </p>

        </div>

        <button
          className="manager-refresh-button"
          onClick={loadBookings}
        >
          ↻ Refresh
        </button>

      </div>

      {/* STATS */}

      <div className="manager-stats-grid">

        <div className="manager-stat-card">
          <div>
            <span>
              My Venues
            </span>

            <strong>
              {venues.length}
            </strong>
          </div>
        </div>

        <div className="manager-stat-card">
          <div>
            <span>
              My Events
            </span>

            <strong>
              {events.length}
            </strong>
          </div>
        </div>

        <div className="manager-stat-card">
          <div>
            <span>
              Bookings
            </span>

            <strong>
              {bookings.length}
            </strong>
          </div>
        </div>

        <div className="manager-stat-card revenue-card">

          <div className="manager-stat-icon">
            R
          </div>

          <div>
            <span>
              Revenue
            </span>

            <strong>
              R
              {revenue.toLocaleString(
                "en-ZA",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* BOOKINGS */}

      <section className="manager-section">

        <div className="manager-section-heading">

          <div>

            <p className="manager-label">
              BOOKINGS
            </p>

            <h2>
              Customer Bookings
            </h2>

          </div>

          <Link
            to="/manager"
            className="manager-view-all"
          >
            ← Dashboard
          </Link>

        </div>

        {bookings.length === 0 ? (

          <div className="manager-empty">

            <h3>
              No bookings found
            </h3>

            <p>
              There are currently no bookings
              for your events
            </p>

          </div>

        ) : (

          <div className="manager-events-table-wrapper">

            <table className="manager-events-table">

              <thead>
                <tr>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    EVENT
                  </th>

                  <th>
                    SEATS
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    STATUS
                  </th>

                </tr>
              </thead>

              <tbody>

                {bookings.map((booking) => (

                  <tr
                    key={booking._id}
                  >

                    <td>
                      <strong>
                        {getCustomerName(
                          booking
                        )}
                      </strong>
                    </td>

                    <td>
                      {getEventName(
                        booking
                      )}
                    </td>

                    <td>
                      {booking.seats?.join(", ") ||
                        "N/A"}
                    </td>

                    <td>
                      {getBookingDate(
                        booking
                      )}
                    </td>

                    <td className="manager-price">
                      R
                      {getBookingAmount(
                        booking
                      ).toFixed(2)}
                    </td>

                    <td>
                      {booking.status ||
                        "Confirmed"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default ManagerBookings;