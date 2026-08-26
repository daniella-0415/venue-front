import { Link, useLocation, Navigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();

  const booking = location.state?.booking;

  // If someone opens /booking-confirmation directly
  // without completing a booking first
  if (!booking) {
    return <Navigate to="/events" replace />;
  }

  const event = booking.eventId;
  const venue = booking.venueId;

  const bookingDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const total = Number(booking.totalPrice || 0);

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">

        {/* SUCCESS ICON */}
        <div className="confirmation-icon">
          ✓
        </div>

        <p className="confirmation-label">
          BOOKING CONFIRMED
        </p>

        <h1>
          Your booking is confirmed!
        </h1>

        <p className="confirmation-message">
          Your tickets have been successfully booked.
        </p>

        {/* BOOKING REFERENCE */}
        <div className="booking-reference">
          <span>BOOKING REFERENCE</span>

          <strong>
            {booking.bookingReference ||
              booking._id}
          </strong>
        </div>

        {/* EVENT */}
        <div className="confirmation-section">

          <h2>
            {event?.title || "Event"}
          </h2>

          {event?.description && (
            <p className="event-description">
              {event.description}
            </p>
          )}

        </div>

        {/* DETAILS */}
        <div className="confirmation-details">

          <div className="detail-item">
            <span>DATE</span>

            <strong>
              {bookingDate}
            </strong>
          </div>

          <div className="detail-item">
            <span>TIME</span>

            <strong>
              {event?.startTime || "N/A"}
            </strong>
          </div>

          <div className="detail-item">
            <span>VENUE</span>

            <strong>
              {venue?.name || "N/A"}
            </strong>
          </div>

          <div className="detail-item">
            <span>LOCATION</span>

            <strong>
              {venue?.city || "N/A"}
            </strong>
          </div>

        </div>

        {/* SEATS */}
        <div className="seats-section">

          <span>YOUR SEATS</span>

          <div className="confirmed-seats">
            {booking.seats?.map((seat) => (
              <span key={seat}>
                {seat}
              </span>
            ))}
          </div>

        </div>

        {/* TOTAL */}
        <div className="total-section">

          <span>Total Paid</span>

          <strong>
            R{total.toFixed(2)}
          </strong>

        </div>

        {/* STATUS */}
        <div className="status">

          <span className="status-dot"></span>

          {booking.status || "Confirmed"}

        </div>

        {/* ACTIONS */}
        <div className="confirmation-actions">

          <Link
            to="/bookings"
            className="primary-button"
          >
            View My Bookings
          </Link>

          <Link
            to="/events"
            className="secondary-button"
          >
            Browse More Events
          </Link>

        </div>

      </div>
    </div>
  );
}

export default BookingConfirmation;