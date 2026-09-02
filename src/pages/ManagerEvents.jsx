import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Manager.css";

function ManagerEvents() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venueId: "",
    date: "",
    startTime: "",
    salesClosingDate: "",
    ticketPrice: "",
    image: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const profileData = await apiRequest("/api/profile");
      setProfile(profileData);

      const venuesData = await apiRequest("/api/venues");

      const allVenues = Array.isArray(venuesData)
        ? venuesData
        : [];

      const managerVenues = allVenues.filter((venue) => {
        const managerId =
          typeof venue.managerId === "object"
            ? venue.managerId?._id
            : venue.managerId;

        return (
          managerId?.toString() ===
          profileData?._id?.toString()
        );
      });

      setVenues(managerVenues);

      if (managerVenues.length > 0) {
        setFormData((previous) => ({
          ...previous,
          venueId:
            previous.venueId ||
            managerVenues[0]._id,
        }));
      }

      // Get events
      const eventsData = await apiRequest("/api/events");

      const allEvents = Array.isArray(eventsData)
        ? eventsData
        : [];

      const managerVenueIds = managerVenues.map(
        (venue) => venue._id?.toString()
      );

      const managerEvents = allEvents.filter((event) => {
        const venueId =
          typeof event.venueId === "object"
            ? event.venueId?._id
            : event.venueId;

        return managerVenueIds.includes(
          venueId?.toString()
        );
      });

      setEvents(managerEvents);
    } catch (err) {
      console.error(
        "Manager events error:",
        err
      );

      setError(
        err.message ||
        "Failed to load manager events."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      venueId:
        venues.length > 0
          ? venues[0]._id
          : "",
      date: "",
      startTime: "",
      salesClosingDate: "",
      ticketPrice: "",
      image: "",
    });

    setError("");
    setMessage("");
  }

  async function handleCreateEvent(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!formData.venueId) {
      setError("Please select a venue.");
      return;
    }

    if (!formData.date) {
      setError("Please select an event date.");
      return;
    }

    if (!formData.startTime) {
      setError("Please select a start time.");
      return;
    }

    if (!formData.salesClosingDate) {
      setError(
        "Please select a ticket sales closing date."
      );
      return;
    }

    if (formData.ticketPrice === "") {
      setError("Please enter a ticket price.");
      return;
    }

    if (
      new Date(formData.salesClosingDate) >=
      new Date(formData.date)
    ) {
      setError(
        "Ticket sales closing date must be before the event date."
      );
      return;
    }

    if (Number(formData.ticketPrice) < 0) {
      setError(
        "Ticket price cannot be negative."
      );
      return;
    }

    try {
      setCreating(true);

      const newEvent = await apiRequest(
        "/api/events",
        {
          method: "POST",

          body: JSON.stringify({
            title: formData.title.trim(),

            description:
              formData.description.trim(),

            venueId: formData.venueId,

            date: formData.date,

            startTime:
              formData.startTime,

            salesClosingDate:
              formData.salesClosingDate,

            ticketPrice:
              Number(formData.ticketPrice),

            image:
              formData.image.trim(),
          }),
        }
      );

      console.log(
        "Event created:",
        newEvent
      );

      setMessage(
        "Event created successfully!"
      );

      resetForm();

      setShowForm(false);

      await loadEvents();
    } catch (err) {
      console.error(
        "Create event error:",
        err
      );

      setError(
        err.message ||
        "Failed to create event."
      );
    } finally {
      setCreating(false);
    }
  }

  function getVenueName(event) {
    if (event.venueId?.venueName) {
      return event.venueId.venueName;
    }

    if (event.venueId?.name) {
      return event.venueId.name;
    }

    const venue = venues.find(
      (item) =>
        item._id?.toString() ===
        event.venueId?.toString()
    );

    return (
      venue?.venueName ||
      venue?.name ||
      event.venue ||
      "Unknown venue"
    );
  }

  if (loading) {
    return (
      <div className="manager-page">
        <div className="manager-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading your events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-page">


      <div className="manager-header">

        <div>

          <p className="manager-label">
            VENUE MANAGEMENT
          </p>

          <h1>
            My Events
          </h1>

          <p className="manager-subtitle">
            Welcome
            {profile?.name
              ? `, ${profile.name}`
              : ""}.
            Manage events taking place
            at your venues.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >

          <button
            className="manager-refresh-button"
            onClick={loadEvents}
            disabled={creating}
          >Refre
             Refresh
          </button>

          <button
            className="manager-refresh-button"
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setMessage("");
            }}
          >
            {showForm
              ? "✕ Close"
              : "+ Create Event"}
          </button>

        </div>

      </div>



      {error && (
        <div
          className="venue-error"
          style={{
            marginBottom: "25px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          className="venue-success"
          style={{
            marginBottom: "25px",
          }}
        >
          {message}
        </div>
      )}


      {showForm && (

        <section className="manager-section">

          <div className="manager-section-heading">

            <div>

              <p className="manager-label">
                NEW EVENT
              </p>

              <h2>
                Create New Event
              </h2>

            </div>

          </div>


          {venues.length === 0 ? (

            <div className="manager-empty">

             

              <h3>
                No venues available
              </h3>

              <p>
                You need to have a venue
                assigned to you before
                you can create an event.
              </p>

              <Link
                to="/manager/venues"
                className="manager-view-all"
              >
                Manage My Venues 
              </Link>

            </div>

          ) : (

            <form
              onSubmit={handleCreateEvent}
              className="manager-summary-card"
            >


              <div className="form-group">

                <label>
                  Event Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                />

              </div>



              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event"
                  rows="5"
                />

              </div>



              <div className="form-group">

                <label>
                  Venue
                </label>

                <select
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select a venue
                  </option>

                  {venues.map((venue) => (

                    <option
                      key={venue._id}
                      value={venue._id}
                    >
                      {venue.venueName ||
                        venue.name}
                    </option>

                  ))}

                </select>

              </div>

              <div
                className="form-row"
              >

                <div className="form-group">

                  <label>
                    Event Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div
                className="form-row"
              >

                <div className="form-group">

                  <label>
                    Ticket Sales Closing Date
                  </label>

                  <input
                    type="date"
                    name="salesClosingDate"
                    value={
                      formData.salesClosingDate
                    }
                    onChange={handleChange}
                    required
                  />

                  <small
                    style={{
                      color: "#888",
                      display: "block",
                      marginTop: "6px",
                    }}
                  >
                    Must be before the event date.
                  </small>

                </div>


                <div className="form-group">

                  <label>
                    Ticket Price (R)
                  </label>

                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    placeholder="250"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Event Image URL
                  <span
                    style={{
                      color: "#888",
                      fontWeight: "normal",
                    }}
                  >
                    {" "}
                    (optional)
                  </span>
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/event.jpg"
                />

              </div>



              <div
                className="form-actions"
                style={{
                  marginTop: "25px",
                }}
              >

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creating}
                >
                  {creating
                    ? "Creating Event..."
                    : "Create Event"}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}

        </section>

      )}



      <div className="manager-stats-grid">

        <div className="manager-stat-card">


          <div>

            <span>
              My Venues
            </span>

            <strong>
              {venues.length}
            </strong>

          </div>

        </div>


        <div className="manager-stat-card">

          

          <div>

            <span>
              My Events
            </span>

            <strong>
              {events.length}
            </strong>

          </div>

        </div>

      </div>



      <section className="manager-section">

        <div className="manager-section-heading">

          <div>

            <p className="manager-label">
              EVENTS
            </p>

            <h2>
              Events at My Venues
            </h2>

          </div>

          <Link
            to="/manager"
            className="manager-view-all"
          >
            Dashboard
          </Link>

        </div>


        {events.length === 0 ? (

          <div className="manager-empty">

        

            <h3>
              No events found
            </h3>

            <p>
              Create your first event
              using the button above.
            </p>

          </div>

        ) : (

          <div className="manager-events-table-wrapper">

            <table className="manager-events-table">

              <thead>

                <tr>
                  <th>EVENT</th>
                  <th>VENUE</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>PRICE</th>
                </tr>

              </thead>

              <tbody>

                {events.map((event) => (

                  <tr key={event._id}>

                    <td>
                      <strong>
                        {event.title ||
                          event.name ||
                          "Untitled Event"}
                      </strong>
                    </td>

                    <td>
                      {getVenueName(event)}
                    </td>

                    <td>
                      {event.date
                        ? new Date(
                            event.date
                          ).toLocaleDateString(
                            "en-ZA"
                          )
                        : "N/A"}
                    </td>

                    <td>
                      {event.startTime ||
                        "N/A"}
                    </td>

                    <td className="manager-price">
                      R
                      {Number(
                        event.ticketPrice ||
                        event.price ||
                        0
                      ).toFixed(2)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default ManagerEvents;