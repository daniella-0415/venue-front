import { useEffect, useState } from "react";

import { apiRequest } from "../services/api";
import { useAuth } from "../Components/AuthContext";function Profile() {
  const { login } = useAuth();

  const [user, setUser] =
    useState(null);

  const [name, setName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data =
        await apiRequest(
          "/api/profile"
        );

      setUser(data);
      setName(data.name);
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();

    try {
      const data =
        await apiRequest(
          "/api/profile",
          {
            method: "PUT",

            body: JSON.stringify({
              name,
            }),
          }
        );

      setUser(data.user);

      login(data.user);

      setMessage(
        "Profile updated successfully."
      );

      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  }

  return (
    <div className="page">

      <div className="profile-container">

        <div className="profile-avatar">
          {user?.name
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <h1>
          My Profile
        </h1>

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          className="profile-form"
          onSubmit={updateProfile}
        >

          <label>
            Name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <label>
            Email
          </label>

          <input
            value={user?.email || ""}
            disabled
          />

          <label>
            Role
          </label>

          <input
            value={user?.role || ""}
            disabled
          />

          <button className="primary-button">
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;