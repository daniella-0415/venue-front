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

      {!error && bookings.length === 0 && (
        <div className="empty-bookings">

          <div className="empty-icon">
            
          </div>

          <h2>
            No bookings yet
          </h2>

          <p>
            You haven't booked any events yet
          </p>

          <Link
            to="/events"
            className="browse-button"
          >
            Explore Events
          </Link>

        </div>
      )}

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
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <g fill="none" stroke="#cf5704" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                          <rect width="20" height="18" x="2" y="4" rx="4" />
                          <path d="M8 2v4m8-4v4M2 10h20" />
                        </g>
                      </svg>

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

                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <g fill="none" stroke="#cf5704" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 16l-2.414-2.414A2 2 0 0 1 12 12.172V6" />
                        </g>
                      </svg>

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
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="#cf5704" d="m22 5l-5-2v4.42c-1.34-.24-2.75-.36-4-.4V5.2L16 4l-5-2v5.02c-1.25.04-2.66.16-4 .4V6.2L10 5L5 3v4.89c-1.73.54-3 1.37-3 2.61v8C2 21.26 8.29 22 12 22s10-.74 10-3.5v-8c0-1.24-1.27-2.07-3-2.61V6.2zM10 19.93V18h4v1.93c-.62.04-1.28.07-2 .07s-1.38-.03-2-.07m6-.21V17c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.72c-2.4-.35-3.76-.96-4-1.29v-5.69c2.16.95 5.61 1.26 8 1.26s5.84-.31 8-1.26v5.69c-.24.33-1.6.94-4 1.29M12 12c-4.75 0-7.4-.99-7.94-1.5C4.6 9.99 7.25 9 12 9s7.4.99 7.94 1.5c-.54.51-3.19 1.5-7.94 1.5" />
                      </svg>

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
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <g fill="none" stroke="#cf5704" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                          <circle cx="12" cy="10" r="3" />
                          <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8" />
                        </g>
                      </svg>
                    </span>

                    <div>
                      <small>Location</small>

                      <strong>
                        {venue?.city || "N/A"}
                      </strong>
                    </div>
                  </div>

                </div>

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
                    <span>Total</span>
                    <strong>
                      R{booking.totalPrice || booking.totalAmount || 0}
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