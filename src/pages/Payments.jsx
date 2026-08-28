import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import './Payments.css'

function Payments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardcardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }
    loadBookingDetails();
  }, [bookingId]);

  async function loadBookingDetails() {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/bookings/${bookingId}`);
      setBooking(data);
    } catch (err) {
      setError(err.message || "Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayClick(e) {
    e.preventDefault();
    setError("");
    setPaying(true);

    try {
      const response = await apiRequest("/api/payments/initialize", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });

      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      } else {
        throw new Error("No authorization URL returned.");
      }
    } catch (err) {
      setError(err.message || "Payment initialization failed.");
      setPaying(false);
    }
  }

  if (loading) {
    return <div className="page"><div className="loading">Loading payment details...</div></div>;
  }

  if (error && !booking) {
    return <div className="page"><div className="error">{error}</div></div>;
  }

  const event = booking?.eventId;
  const venue = booking?.venueId;
  const ticketCount = booking?.seats?.length || 1;
  const ticketPrice = event?.ticketPrice || 0;
  const subtotal = ticketCount * ticketPrice; 
  const total = subtotal;

  return (
    <div className="page">
      {error && <div className="error">{error}</div>}
      <div className="payment-container">
        <div className="payment-left-card">
          <div className="event-summary-box">
            {event?.image && <img src={event.image} alt={event.title} />}
            <div className="event-summary-info">
              <h2>{event?.title}</h2>
              <p> Date: {event?.date ? new Date(event.date).toLocaleDateString() : ""} {event?.startTime}</p>
              <p>Location: {venue?.name}, {venue?.city}</p>
              <span>Total</span>
              <strong>R{total}</strong>
            </div>
          </div>

          <div className="ticket-breakdown-box">
            <h3>Ticket Breakdown</h3>
            <p>{ticketCount} General Admission <span>R{subtotal}</span></p>
            <p><strong>Total</strong> <span><strong>R{total}</strong></span></p>
          </div>

          <div className="payment-features">
            <div><span>photo icon here</span><p>Secure booking</p></div>
            <div><span>shield icon here</span><p>Your information is protected</p></div>
            <div><span>headphones-with-mic icon here</span><p>24 / 7 Support</p></div>
          </div>
        </div>

        <div className="payment-right-card">
          <h3>Payment Method</h3>
          <div className="payment-tabs">
            <button type="button" className="active-tab">Card</button>
          </div>

          <form onSubmit={handlePayClick}>
            <label>Cardholder Name</label>
            <input 
              type="text" 
              placeholder="John Gay" 
              value={cardholderName} 
              onChange={(e) => setCardholderName(e.target.value)}
              required 
            />

            <label>Card number</label>
            <input 
              type="text" 
              placeholder="1234 5678 91234" 
              value={cardNumber} 
              onChange={(e) => setCardcardNumber(e.target.value)}
              required 
            />

            <div className="card-row">
              <div>
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label>CVC</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  value={cvc} 
                  onChange={(e) => setCvc(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="primary-button" disabled={paying}>
              {paying ? "Processing..." : `PAY R${total}`}
            </button>
            <p className="secure-text">Your payment is encrypted and secure.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payments;