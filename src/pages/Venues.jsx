import { useEffect, useState } from "react";
import AddressSearch from "../Components/AddressSearch";
import { apiRequest } from "../services/api";
import "./Venues.css";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    rows: "",
    seatsPerRow: "",
  });

  useEffect(() => {
    loadVenues();
  }, []);

  async function loadVenues() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/venues");

      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load venues:", err);

      setError(
        err.message || "Failed to load venues."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleAddressSelect(addressData) {
    if (!addressData) {
      return;
    }

    setFormData((previous) => ({
      ...previous,

      address:
        addressData.address ||
        previous.address,

      city:
        addressData.city ||
        previous.city,

      latitude:
        addressData.latitude !== undefined
          ? addressData.latitude
          : previous.latitude,

      longitude:
        addressData.longitude !== undefined
          ? addressData.longitude
          : previous.longitude,
    }));
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      latitude: "",
      longitude: "",
      rows: "",
      seatsPerRow: "",
    });

    setEditingId(null);
    setError("");
    setSuccess("");
  }

  function startEdit(venue) {
    setEditingId(venue._id);

    setFormData({
      name: venue.name || "",
      description: venue.description || "",
      address: venue.address || "",
      city: venue.city || "",
      latitude:
        venue.latitude !== null &&
        venue.latitude !== undefined
          ? venue.latitude
          : "",
      longitude:
        venue.longitude !== null &&
        venue.longitude !== undefined
          ? venue.longitude
          : "",
      rows: venue.rows || "",
      seatsPerRow:
        venue.seatsPerRow || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Venue name is required.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Venue address is required.");
      return;
    }

    if (!formData.city.trim()) {
      setError("City is required.");
      return;
    }

    const rows = Number(formData.rows);
    const seatsPerRow = Number(
      formData.seatsPerRow
    );

    if (
      !Number.isInteger(rows) ||
      rows < 1 ||
      rows > 26
    ) {
      setError(
        "Rows must be a whole number between 1 and 26."
      );
      return;
    }

    if (
      !Number.isInteger(seatsPerRow) ||
      seatsPerRow < 1
    ) {
      setError(
        "Seats per row must be a positive whole number."
      );
      return;
    }

    let latitude = null;
    let longitude = null;

    if (
      formData.latitude !== "" &&
      formData.latitude !== null &&
      formData.latitude !== undefined
    ) {
      latitude = Number(formData.latitude);
    }

    if (
      formData.longitude !== "" &&
      formData.longitude !== null &&
      formData.longitude !== undefined
    ) {
      longitude = Number(formData.longitude);
    }

    if (
      latitude !== null &&
      (!Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90)
    ) {
      setError("Latitude is invalid.");
      return;
    }

    if (
      longitude !== null &&
      (!Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180)
    ) {
      setError("Longitude is invalid.");
      return;
    }

    const payload = {
      name: formData.name.trim(),

      description:
        formData.description.trim(),

      address:
        formData.address.trim(),

      city:
        formData.city.trim(),

      latitude,

      longitude,

      rows,

      seatsPerRow,
    };

    try {
      setSaving(true);

      let result;

      if (editingId) {
        result = await apiRequest(
          `/api/venues/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Venue updated successfully."
        );
      } else {
        result = await apiRequest(
          "/api/venues",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Venue created successfully."
        );
      }

      console.log(
        "VENUE SAVED:",
        result
      );

      resetForm();

   
      setSuccess(
        editingId
          ? "Venue updated successfully."
          : "Venue created successfully."
      );

      await loadVenues();
    } catch (err) {
      console.error(
        "Failed to save venue:",
        err
      );

      setError(
        err.message ||
          "Failed to save venue."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(venueId) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this venue?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiRequest(
        `/api/venues/${venueId}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Venue deleted successfully."
      );

      await loadVenues();
    } catch (err) {
      console.error(
        "Failed to delete venue:",
        err
      );

      setError(
        err.message ||
          "Failed to delete venue."
      );
    }
  }

  if (loading) {
    return (
      <div className="venues-page">
        <div className="venues-loading">
          Loading venues...
        </div>
      </div>
    );
  }

  return (
    <div className="venues-page">

      <div className="venues-header">
        <div>
          <p className="page-label">
            VENUE MANAGEMENT
          </p>

          <h1>
            {editingId
              ? "Edit Venue"
              : "Manage Venues"}
          </h1>

          <p>
            Create and manage your event
            venues and seating information.
          </p>
        </div>
      </div>

      {error && (
        <div className="venue-message venue-error">
          {error}
        </div>
      )}

      {success && (
        <div className="venue-message venue-success">
          {success}
        </div>
      )}

      <div className="venue-form-card">

        <div className="form-card-header">
          <div>
            <h2>
              {editingId
                ? "Edit Venue"
                : "Add New Venue"}
            </h2>

            <p>
              Enter the venue details below.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="venue-form"
        >

          <div className="form-group">
            <label htmlFor="name">
              Venue Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Johannesburg Arena"
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the venue..."
              rows="4"
            />
          </div>


          <div className="form-group">
            <label>
              Venue Address
            </label>

            <AddressSearch
              value={formData.address}
              onAddressSelect={
                handleAddressSelect
              }
            />

            <small className="field-help">
              Select an address from the
              search suggestions so the venue
              coordinates can be saved.
            </small>
          </div>


          <div className="form-group">
            <label htmlFor="city">
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Johannesburg"
              required
            />
          </div>



          <div className="coordinates-section">

            <div className="coordinates-header">
              <h3>
                Location Coordinates
              </h3>

              <p>
                These coordinates are
                automatically filled when you
                select an address.
              </p>
            </div>

            <div className="coordinates-grid">

              <div className="form-group">
                <label htmlFor="latitude">
                  Latitude
                </label>

                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={
                    formData.latitude
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="-26.2041"
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">
                  Longitude
                </label>

                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={
                    formData.longitude
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="28.0473"
                />
              </div>

            </div>

            {formData.latitude !== "" &&
              formData.longitude !== "" && (
                <div className="coordinates-confirmed">
                   Coordinates captured:
                  {" "}
                  {formData.latitude},
                  {" "}
                  {formData.longitude}
                </div>
              )}

          </div>


          <div className="seating-section">

            <div className="seating-header">
              <h3>
                Seating Configuration
              </h3>

              <p>
                Set the number of rows and
                seats in each row.
              </p>
            </div>

            <div className="seating-grid">

              <div className="form-group">
                <label htmlFor="rows">
                  Number of Rows
                </label>

                <input
                  id="rows"
                  name="rows"
                  type="number"
                  min="1"
                  max="26"
                  value={formData.rows}
                  onChange={
                    handleInputChange
                  }
                  placeholder="10"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seatsPerRow">
                  Seats Per Row
                </label>

                <input
                  id="seatsPerRow"
                  name="seatsPerRow"
                  type="number"
                  min="1"
                  value={
                    formData.seatsPerRow
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="20"
                  required
                />
              </div>

            </div>

            {formData.rows &&
              formData.seatsPerRow && (
                <div className="capacity-preview">
                  Total Capacity:
                  {" "}
                  {Number(formData.rows) *
                    Number(
                      formData.seatsPerRow
                    )}
                  {" "}
                  seats
                </div>
              )}

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Venue"
                : "Create Venue"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>



      <div className="venue-list-section">

        <div className="venue-list-header">
          <div>
            <p className="page-label">
              YOUR VENUES
            </p>

            <h2>
              Venues
            </h2>
          </div>

          <div className="venue-count">
            {venues.length}
          </div>
        </div>

        {venues.length === 0 ? (
          <div className="empty-venues">
            <h3>
              No venues yet
            </h3>

            <p>
              Create your first venue using
              the form above.
            </p>
          </div>
        ) : (
          <div className="venues-grid">

            {venues.map((venue) => (
              <div
                className="venue-card"
                key={venue._id}
              >

                <div className="venue-card-top">

                  <div>
                    <p className="venue-card-label">
                      VENUE
                    </p>

                    <h3>
                      {venue.name}
                    </h3>
                  </div>

                  <div className="venue-capacity">
                    {venue.capacity || 0}
                    {" "}
                    seats
                  </div>

                </div>

                <p className="venue-description">
                  {venue.description ||
                    "No description provided."}
                </p>

                <div className="venue-details">

                  <div className="venue-detail">
                   
                    <div>
                      <strong>
                        Address
                      </strong>

                      <p>
                        {venue.address}
                      </p>

                      <p>
                        {venue.city}
                      </p>
                    </div>
                  </div>

                  <div className="venue-detail">
                  

                    <div>
                      <strong>
                        Seating
                      </strong>

                      <p>
                        {venue.rows} rows
                        {" "}
                        {venue.seatsPerRow}
                        {" seats"}
                      </p>
                    </div>
                  </div>

                  <div className="venue-detail">
                   

                    <div>
                      <strong>
                        Map Coordinates
                      </strong>

                      {venue.latitude !==
                        null &&
                      venue.latitude !==
                        undefined &&
                      venue.longitude !==
                        null &&
                      venue.longitude !==
                        undefined ? (
                        <p>
                          {venue.latitude},
                          {" "}
                          {venue.longitude}
                        </p>
                      ) : (
                        <p className="missing-coordinates">
                          Coordinates missing
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                <div className="venue-card-actions">

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      startEdit(venue)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(
                        venue._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Venues;