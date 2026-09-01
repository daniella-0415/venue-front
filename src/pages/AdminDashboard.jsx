import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [statsData, usersData, bookingsData] =
        await Promise.all([
          apiRequest("/api/admin/stats"),
          apiRequest("/api/admin/users"),
          apiRequest("/api/bookings"),
        ]);

      setStats(statsData);

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : usersData.users || []
      );

      setBookings(
        Array.isArray(bookingsData)
          ? bookingsData
          : bookingsData.bookings || []
      );
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.message ||
          "Failed to load administrator dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditing(user) {
    setEditingUser(user);
    setSelectedRole(
      user.role || "Customer"
    );
  }

  function cancelEditing() {
    if (saving) {
      return;
    }

    setEditingUser(null);
    setSelectedRole("");
  }

  async function saveRole() {
    if (!editingUser) {
      return;
    }

    if (
      editingUser.role ===
      "Administrator"
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await apiRequest(
        `/api/admin/users/${editingUser._id}/role`,
        {
          method: "PUT",
          body: JSON.stringify({
            role: selectedRole,
          }),
        }
      );

      const updatedUser =
        response?.user;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === editingUser._id
            ? {
                ...user,
                role:
                  updatedUser?.role ||
                  selectedRole,
              }
            : user
        )
      );

      setEditingUser(null);
      setSelectedRole("");
    } catch (err) {
      console.error(
        "Failed to update role:",
        err
      );

      setError(
        err.message ||
          "Failed to update user role."
      );
    } finally {
      setSaving(false);
    }
  }

  function getCustomerName(booking) {
    return (
      booking.customerId?.name ||
      booking.customer?.name ||
      booking.user?.name ||
      "Customer"
    );
  }

  function getEventName(booking) {
    return (
      booking.eventId?.title ||
      booking.eventId?.name ||
      "Unknown event"
    );
  }

  function getVenueName(booking) {
    return (
      booking.venueId?.name ||
      "Unknown venue"
    );
  }

  function getBookingAmount(booking) {
    return Number(
      booking.totalPrice ||
        booking.totalAmount ||
        booking.amount ||
        booking.total ||
        0
    );
  }

  function getBookingDate(booking) {
    if (!booking.createdAt) {
      return "N/A";
    }

    return new Date(
      booking.createdAt
    ).toLocaleDateString("en-ZA");
  }

  function getSeatCount(booking) {
    return Array.isArray(booking.seats)
      ? booking.seats.length
      : 0;
  }

  function formatCurrency(amount) {
    return Number(amount || 0).toLocaleString(
      "en-ZA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner"></div>

          <h2>
            Loading administrator dashboard...
          </h2>

          <p>
            Please wait while we load
            VenueFlow platform data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">


      <header className="admin-header">

        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="admin-subtitle">
            Monitor VenueFlow and manage
            platform users.
          </p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={loadDashboard}
        >
          Refresh
        </button>

      </header>



      {error && (
        <div className="admin-error">
          <strong>
            Error
          </strong>

          <span>
            {error}
          </span>
        </div>
      )}



      <section className="admin-stats-grid">

        <div className="admin-stat-card">
         
          <div>
            <span>
              Total Users
            </span>

            <strong>
              {stats?.users ?? users.length}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          

          <div>
            <span>
              Venues
            </span>

            <strong>
              {stats?.venues ?? 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
         

          <div>
            <span>
              Events
            </span>

            <strong>
              {stats?.events ?? 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          

          <div>
            <span>
              Active Bookings
            </span>

            <strong>
              {stats?.bookings ?? 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
         

          <div>
            <span>
              Successful Payments
            </span>

            <strong>
              {stats?.successfulPayments ?? 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card revenue-card">
        

          <div>
            <span>
              Total Revenue
            </span>

            <strong>
              R
              {formatCurrency(
                stats?.totalRevenue
              )}
            </strong>
          </div>
        </div>

      </section>



      <section className="admin-section">

        <div className="admin-section-heading">

          <div>
            <p className="admin-label">
              USER MANAGEMENT
            </p>

            <h2>
              Users
            </h2>
          </div>

        </div>


        <div className="admin-user-summary">

          <div>
            <span>
              Customers
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role ===
                    "Customer"
                ).length
              }
            </strong>
          </div>


          <div>
            <span>
              Venue Managers
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role ===
                    "Venue Manager"
                ).length
              }
            </strong>
          </div>


          <div>
            <span>
              Administrators
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role ===
                    "Administrator"
                ).length
              }
            </strong>
          </div>

        </div>


        {users.length === 0 ? (

          <div className="admin-empty">

            

            <h3>
              No users found
            </h3>

            <p>
              There are currently no
              users registered on
              VenueFlow.
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-users-table">

              <thead>
                <tr>

                  <th>
                    USER
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>
              </thead>

              <tbody>

                {users.map(
                  (user) => (

                    <tr
                      key={user._id}
                    >

                      <td>
                        <strong>
                          {user.name ||
                            "Unnamed User"}
                        </strong>
                      </td>

                      <td>
                        {user.email ||
                          "No email"}
                      </td>

                      <td>

                        <span
                          className={`admin-role-badge ${
                            user.role ===
                            "Administrator"
                              ? "admin-role"
                              : user.role ===
                                "Venue Manager"
                              ? "manager-role"
                              : "customer-role"
                          }`}
                        >
                          {user.role ||
                            "Customer"}
                        </span>

                      </td>

                      <td>

                        {user.role ===
                        "Administrator" ? (

                          <span className="admin-protected">
                            Protected
                          </span>

                        ) : (

                          <button
                            className="admin-edit-button"
                            onClick={() =>
                              startEditing(
                                user
                              )
                            }
                          >
                            Change Role
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>



      <section className="admin-section">

        <div className="admin-section-heading">

          <div>
            <p className="admin-label">
              PLATFORM ACTIVITY
            </p>

            <h2>
              Recent Bookings
            </h2>
          </div>

        </div>


        {bookings.length === 0 ? (

          <div className="admin-empty">

           

            <h3>
              No bookings found
            </h3>

            <p>
              There are currently no
              bookings on VenueFlow.
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-bookings-table">

              <thead>

                <tr>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    EVENT
                  </th>

                  <th>
                    VENUE
                  </th>

                  <th>
                    SEATS
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    STATUS
                  </th>

                </tr>

              </thead>

              <tbody>

                {bookings
                  .slice(0, 10)
                  .map(
                    (booking) => (

                      <tr
                        key={
                          booking._id
                        }
                      >

                        <td>
                          <strong>
                            {getCustomerName(
                              booking
                            )}
                          </strong>
                        </td>

                        <td>
                          {getEventName(
                            booking
                          )}
                        </td>

                        <td>
                          {getVenueName(
                            booking
                          )}
                        </td>

                        <td>
                          {getSeatCount(
                            booking
                          )}
                        </td>

                        <td className="admin-price">
                          R
                          {formatCurrency(
                            getBookingAmount(
                              booking
                            )
                          )}
                        </td>

                        <td>
                          {getBookingDate(
                            booking
                          )}
                        </td>

                        <td>

                          <span
                            className={`admin-status-badge ${
                              booking.status ===
                              "Cancelled"
                                ? "cancelled-status"
                                : booking.status ===
                                  "Confirmed"
                                ? "confirmed-status"
                                : "pending-status"
                            }`}
                          >
                            {booking.status ||
                              "Confirmed"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}

      </section>



      {editingUser && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <button
              className="admin-modal-close"
              onClick={cancelEditing}
              disabled={saving}
            >
              ×
            </button>

            <p className="admin-label">
              USER MANAGEMENT
            </p>

            <h2>
              Change User Role
            </h2>

            <p className="admin-modal-user">
              {editingUser.name}
            </p>

            <p className="admin-modal-email">
              {editingUser.email}
            </p>


            <label>
              Account Role
            </label>

            <select
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value
                )
              }
              disabled={saving}
            >

              <option value="Customer">
                Customer
              </option>

              <option value="Venue Manager">
                Venue Manager
              </option>

            </select>


            <div className="admin-modal-actions">

              <button
                className="admin-cancel-button"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="admin-save-button"
                onClick={saveRole}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;