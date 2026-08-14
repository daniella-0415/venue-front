import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      role: "Customer",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const firebaseUID =
        `demo-${Date.now()}`;

      const user =
        await apiRequest(
          "/api/users/register",
          {
            method: "POST",

            body: JSON.stringify({
              ...form,
              firebaseUID,
            }),
          }
        );

      login(user);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <div className="auth-logo">
          Venue<span>Flow</span>
        </div>

        <h1>
          Create Account
        </h1>

        <p>
          Join VenueFlow and start
          discovering amazing events.
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <label>
          Full Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />

        <label>
          Email
        </label>

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <label>
          Account Type
        </label>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="Customer">
            Customer
          </option>

          <option value="Venue Manager">
            Venue Manager
          </option>
        </select>

        <button
          className="primary-button full"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

      </form>

    </div>
  );
}

export default Register;