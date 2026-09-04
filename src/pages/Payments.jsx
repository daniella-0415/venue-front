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
            <div>
              <span className="payment-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                  <path d="M0 0h16v16H0z" fill="none" />
                  <g fill="#cf5704">
                    <path d="M5.338 1.59a61 61 0 0 0-2.837.856a.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025a1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453a7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625a11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43A63 63 0 0 1 5.072.56" />
                    <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                  </g>
                </svg>

              </span>
              <p>Secure booking</p>
            </div>


            <div>
              <span className="payment-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="#cf5704" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3" />
                </svg>

              </span>
              <p>Your information is protected</p>
            </div>
            <div>
              <span className="payment-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="#cf5704" d="M21 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.062A8 8 0 0 1 12 23v-2a6 6 0 0 0 6-6V9A6 6 0 0 0 6 9v7H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1.062a8.001 8.001 0 0 1 15.876 0zM7.76 15.785l1.06-1.696A5.97 5.97 0 0 0 12 15a5.97 5.97 0 0 0 3.18-.911l1.06 1.696A7.96 7.96 0 0 1 12 17a7.96 7.96 0 0 1-4.24-1.215" />
                </svg>

              </span>
              <p>24 / 7 Support</p>
            </div>
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