import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Payments.css";
import "../index.css"

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setError("No payment reference found.");
      setLoading(false);
      return;
    }
    verifyPayment();
  }, [reference]);

  async function verifyPayment() {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/payments/verify?reference=${reference}`);
      setPaymentData(data);
    } catch (err) {
      setError(err.message || "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="payment-result-card loading-card">
          <div className="loading-spinner"></div>
          <div className="loading">Verifying payment status...</div>
        </div>
      </div>
    );
  }

  if (error || paymentData?.payment?.status === "Failed") {
    return (
      <div className="page">
        <div className="payment-result-card error-result">
          <div className="result-icon-container error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="#cf5704" d="M11.001 10h2v5h-2zM11 16h2v2h-2z" />
              <path fill="#cf5704" d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.99 1.99 0 0 0 .054 1.968A1.98 1.98 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.99 1.99 0 0 0 .054-1.968zM4.661 19L12 5.137L19.344 19z" />
            </svg>

          </div>
          <h1>Payment Failed</h1>
          <p>{error || "Your transaction could not be completed. Don't worry, your funds are safe."}</p>
          <button onClick={() => navigate("/events")} className="primary-button">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const payment = paymentData?.payment;
  const booking = paymentData?.booking;

  return (
    <div className="page">
      <div className="payment-result-card success-result">
        <div className="result-icon-container success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36">
            <path d="M0 0h36v36H0z" fill="none" />
            <path fill="#cf5704" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m0 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14" class="clr-i-outline clr-i-outline-path-1" />
            <path fill="#cf5704" d="M28 12.1a1 1 0 0 0-1.41 0l-11.1 11.05l-6-6A1 1 0 0 0 8 18.53L15.49 26L28 13.52a1 1 0 0 0 0-1.42" class="clr-i-outline clr-i-outline-path-2" />
            <path fill="none" d="M0 0h36v36H0z" />
          </svg>

        </div>
        
        <h1>Payment Successful</h1>
        <p className="result-subtitle">Your venue booking has been confirmed and payment was successful.</p>

        <div className="result-details-box">
          <div className="result-detail-row">
            <span>Date & Time</span>
            <strong>{booking?.eventId?.date ? new Date(booking.eventId.date).toLocaleString() : "Sat, 24 May 2026 19:00"}</strong>
          </div>
          <div className="result-detail-row">
            <span>Venue</span>
            <strong>{booking?.venueId?.name || "Active Church"}</strong>
          </div>
          <div className="result-detail-row">
            <span>Guests</span>
            <strong>{booking?.seats?.length || 1} person</strong>
          </div>
          <div className="result-detail-row">
            <span>Tickets</span>
            <strong>General Admission</strong>
          </div>
          <div className="result-detail-row">
            <span>Payment Method</span>
            <strong>Card</strong>
          </div>
          <div className="result-detail-row total-row">
            <span>Amount Paid</span>
            <strong className="amount-highlight">R{payment?.amount || 300}</strong>
          </div>
        </div>

        

        <button onClick={() => navigate("/bookings")} className="primary-button">
          View My Bookings
        </button>
      </div>
    </div>
  );
}

export default PaymentResult;