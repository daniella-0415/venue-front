import { Link, useLocation, Navigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

 
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

        {/* Header */}
        <p className="confirmation-label">BOOKING CREATED</p>

        <h1>Your booking has been created!</h1>

        <p className="confirmation-message">
          Your seats have been successfully reserved,
          Please proceed to payment to complete your booking.
        </p>

        <div className="booking-reference">
          <span>BOOKING REFERENCE</span>

          <strong>
            {booking.bookingReference || booking._id}
          </strong>
        </div>

        <div className="confirmation-section">
          <h2>{event?.title || "Event"}</h2>

          {event?.description && (
            <p className="event-description">
              {event.description}
            </p>
          )}
        </div>

        <div className="confirmation-details">

          <div className="detail-item">
            <span>DATE</span>
            <strong>{bookingDate}</strong>
          </div>

          <div className="detail-item">
            <span>TIME</span>
            <strong>{event?.startTime || "N/A"}</strong>
          </div>

          <div className="detail-item">
            <span>VENUE</span>
            <strong>{venue?.name || "N/A"}</strong>
          </div>

          <div className="detail-item">
            <span>LOCATION</span>
            <strong>{venue?.city || "N/A"}</strong>
          </div>

        </div>

        {/* Seats */}<div className="seats-section">
          <span>YOUR SEATS</span>

          <div className="confirmed-seats">
            {booking.seats?.length > 0 ? (
              booking.seats.map((seat) => (
                <span key={seat}>{seat}</span>
              ))
            ) : (
              <span>No seats found</span>
            )}
          </div>
        </div>

       
        <div className="total-section">
          <span>Total</span>

          <strong>
            R{total.toFixed(2)}
          </strong>
        </div>

       
        <div className="status">
          <span className="status-dot"></span>

          {booking.paymentStatus || "Payment Pending"}
        </div>

        {/* Actions */}
        <div className="confirmation-actions">

          {/* THIS IS THE IMPORTANT NEW BUTTON */}
          <Link
            to={`/payments?bookingId=${booking._id}`}
            className="primary-button"
          >
            Proceed to Payment
          </Link>

          <Link
            to="/bookings"
            className="secondary-button"
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