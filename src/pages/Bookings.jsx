import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../Components/AuthContext";

function Bookings() {
  const { user, role } = useAuth() || {};

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

      const data = await apiRequest("/api/bookings/my");
      setBookings(data.bookings || data || []);
    } catch (err) {
      console.error("Booking history error:", err);
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="page" style={{ padding: "24px" }}>
      <div className="page-header">
        <div>
          <p className="section-label">MY ACCOUNT</p>
          <h1>Booking History</h1>
          <p>View all the events you have booked.</p>
        </div>
        <Link to="/events" className="primary-button">Browse Events</Link>
      </div>

      {error && <div className="error" style={{ color: "red", margin: "15px 0" }}>{error}</div>}

      {bookings.length === 0 && (
        <div className="empty" style={{ textAlign: "center", marginTop: "40px" }}>
          <h2>No bookings yet</h2>
          <p>You haven't booked any events yet.</p>
          <Link to="/events" className="primary-button">Browse Events</Link>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="booking-list" style={{ marginTop: "20px" }}>
          {bookings.map((booking) => {
            const event = booking.eventId;
            const venue = booking.venueId;

            return (
              <div 
                className="booking-card" 
                key={booking._id} 
                style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "15px", background: "#fff" }}
              >
                <div className="booking-info">
                  <p className="section-label">BOOKING REFERENCE: #{booking._id}</p>
                  <h2>{event?.title || "Upcoming Event"}</h2>
                  {event?.description && <p>{event.description}</p>}

                  <div className="booking-details" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginTop: "15px" }}>
                    <div>
                      <strong>Date:</strong>
                      <div>{event?.date ? new Date(event.date).toLocaleDateString() : "N/A"}</div>
                    </div>
                    <div>
                      <strong>Venue:</strong>
                      <div>{venue?.name || "Main Arena"}</div>
                    </div>
                    <div>
                      <strong>Seats Selected:</strong>
                      <div>{booking.seats?.join(", ") || "N/A"}</div>
                    </div>
                    <div>
                      <strong>Total:</strong>
                      <div>R{booking.totalAmount ?? booking.total ?? "0.00"}</div>
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <div style={{ color: "green", fontWeight: "bold" }}>{booking.status || "Confirmed"}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bookings;
