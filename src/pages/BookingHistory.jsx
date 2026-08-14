import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./BookingHistory.css";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await apiRequest("/api/bookings/my");

      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-loading">
          <div className="loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">

      <div className="booking-header">

        <div>
          <p className="booking-label">
            MY ACCOUNT
          </p>

          <h1>
            Booking History
          </h1>

          <p className="booking-subtitle">
            View all the events and seats you have booked.
          </p>
        </div>

        <Link
          to="/events"
          className="browse-button"
        >
          Browse Events
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <div className="booking-error">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!error && bookings.length === 0 && (
        <div className="empty-bookings">

          <div className="empty-icon">
            
          </div>

          <h2>
            No bookings yet
          </h2>

          <p>
            You haven't booked any events yet.
          </p>

          <Link
            to="/events"
            className="browse-button"
          >
            Explore Events
          </Link>

        </div>
      )}

      {/* BOOKINGS */}
      <div className="booking-list">

        {bookings.map((booking) => {

          const event = booking.eventId;
          const venue = booking.venueId;

          return (
            <div
              className="booking-card"
              key={booking._id}
            >

              <div className="booking-image">

                {event?.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                  />
                ) : (
                  <div className="booking-image-placeholder">
                    
                  </div>
                )}

                <div className="booking-type">
                  BOOKING
                </div>

              </div>

              <div className="booking-content">

                <div className="booking-top">

                  <div>
                    <p className="booking-event-label">
                      EVENT
                    </p>

                    <h2>
                      {event?.title || "Event"}
                    </h2>
                  </div>

                  <span
                    className={`booking-status ${
                      booking.status?.toLowerCase()
                    }`}
                  >
                    {booking.status || "Confirmed"}
                  </span>

                </div>

                <p className="booking-description">
                  {event?.description ||
                    "Your booking for this event."}
                </p>

                <div className="booking-details">

                  <div className="detail-item">
                    <span className="detail-icon">
                      
                    </span>

                    <div>
                      <small>Date</small>

                      <strong>
                        {event?.date
                          ? new Date(
                              event.date
                            ).toLocaleDateString()
                          : "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">
                      
                    </span>

                    <div>
                      <small>Time</small>

                      <strong>
                        {event?.startTime || "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">
                      
                    </span>

                    <div>
                      <small>Venue</small>

                      <strong>
                        {venue?.name || "Venue"}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">
                      
                    </span>

                    <div>
                      <small>Location</small>

                      <strong>
                        {venue?.city || "N/A"}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* BOTTOM */}
                <div className="booking-bottom">

                  <div className="seat-info">

                    <span>
                      Seats
                    </span>

                    <strong>
                      {Array.isArray(booking.seats)
                        ? booking.seats.join(", ")
                        : booking.seats || "N/A"}
                    </strong>

                  </div>

                  <div className="price-info">

                    <span>
                      Total
                    </span>

                    <strong>
                      R{booking.totalAmount || 0}
                    </strong>

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default BookingHistory;