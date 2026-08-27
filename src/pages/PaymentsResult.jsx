import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

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
    return <div className="page"><div className="loading">Verifying payment status...</div></div>;
  }

  if (error || paymentData?.payment?.status === "Failed") {
    return (
      <div className="page">
        <div className="result-card error-result">
          <h1>Payment Failed</h1>
          <p>{error || "Your transaction could not be completed because of something on our end.Don't worry, your card details and stuff are safe."}</p>
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
      <div className="result-card success-result">
        <div className="success-icon">Success image here</div>
        <h1>Payment Successful</h1>
        <p>Your venue booking has been confirmed and payment was successful.</p>

        <div className="result-details">
          <p><span>Date & time</span> <strong>{booking?.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString() : "Sat, 24 May 2026 7:00 PM"}</strong></p>
          <p><span>Venue</span> <strong>{booking?.venueId?.name || "Missing venue name"}</strong></p>
          <p><span>Guests</span> <strong>{booking?.seats?.length || 1} person</strong></p>
          <p><span>Tickets</span> <strong>General Admission</strong></p>
          <p><span>Payment method</span> <strong>Card</strong></p>
          <p><span>Amount paid</span> <strong className="amount-highlight">R{payment?.amount || 165}</strong></p>
        </div>

        <div className="confirmation-email-box">
          <p>A confirmation email with your ticket details has been sent to <strong>{paymentData?.email || "your registered email"}</strong></p>
        </div>

        <button onClick={() => navigate("/bookings")} className="primary-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default PaymentResult;