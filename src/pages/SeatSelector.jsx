import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../Components/AuthContext";
import "./SeatSelector.css"; 

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, role } = useAuth() || {};

  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSeats();
  }, [id]);

  async function loadSeats() {
    try {
      setLoading(true);
      setError("");

      console.log("Loading seats for event:", id);
      const data = await apiRequest(`/api/events/${id}/seats`);
      console.log("Seat data:", data);

      setSeatData(data);
    } catch (err) {
      console.error("Seat loading error:", err);
      setError(err.message || "Failed toScreenshot from 2026-08-14 10-09-30 load seats.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSeat(seat) {
    if (seat.status === "Booked") {
      return;
    }

    setSelectedSeats((current) => {
      if (current.includes(seat.seatNumber)) {
        return current.filter((number) => number !== seat.seatNumber);
      }
      return [...current, seat.seatNumber];
    });
  }

  async function handleBooking() {
    setError("");


    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }

    try {
      const result = await apiRequest("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          eventId: id,
          seats: selectedSeats
        })
      });

      console.log("Booking created:", result);

      if (result?._id || result?.booking?._id) {
        navigate("/bookings");
      } else {
        setError("Booking was created, but no booking ID was returned.");
      }

    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking.");
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading seats...</div>
      </div>
    );
  }

  if (error && !seatData) {
    return (
      <div className="page">
        <div className="error">{error}</div>
        <button className="primary-button" onClick={loadSeats}>
          Try Again
        </button>
      </div>
    );
  }

  if (!seatData) {
    return (
      <div className="page">
        <div className="empty">Unable to load seating information.</div>
      </div>
    );
  }

  const event = seatData.event;
  const seats = seatData.seats || [];
  const ticketPrice = Number(event?.ticketPrice) || 0;
  const total = selectedSeats.length * ticketPrice;

  return (
    <div className="page">
      <div className="seat-header">
        <div>
          <p className="section-label">SELECT YOUR SEATS</p>
          <h1>{event?.title || "Event"}</h1>
          <p>Choose the seats you want to book.</p>
        </div>

        <div className="seat-summary">
          <span>Selected: <strong>{selectedSeats.length}</strong></span>
          <span>Total: <strong>R{total.toFixed(2)}</strong></span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="screen">SCREEN</div>

      <div className="seat-grid">
        {seats.length === 0 ? (
          <div className="empty">No seats are available for this event.</div>
        ) : (
          seats.map((seat) => {
            const selected = selectedSeats.includes(seat.seatNumber);
            const booked = seat.status === "Booked";

            return (
              <button
                key={seat.seatNumber}
                type="button"
                className={`seat ${booked ? "booked" : ""} ${selected ? "selected" : ""}`}
                disabled={booked}
                onClick={() => toggleSeat(seat)}
              >
                {seat.seatNumber}
              </button>
            );
          })
        )}
      </div>

      <div className="seat-legend">
        <span><i className="available"></i>Available</span>
        <span><i className="selected"></i>Selected</span>
        <span><i className="booked"></i>Booked</span>
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={handleBooking}
        disabled={selectedSeats.length === 0}
      >
        Create Booking
      </button>
    </div>
  );
}

export default SeatSelection;
