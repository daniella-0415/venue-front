import { useState } from "react";

const Payments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async (bookingId) => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("venueflowToken");

            const response = await fetch("http://localhost:3000/api/payments/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ bookingId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong initializing payment.");
            }

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error("No payment authorization URL returned from server.");
            }

        } catch (err) {
            console.error("Payment error:", err);
            setError(err.message || "Failed to connect to the payment server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Payments">
            {/* Benny it's your time to shiiiinnneeee */}
        </div>
    );
};

export default Payments;