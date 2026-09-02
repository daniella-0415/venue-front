import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GoogleMap from "../Components/ GoogleMap"; 
import { apiRequest } from "../services/api";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/api/events/${id}`);

      if (!data) {
        throw new Error("Event could not be found.");
      }

      setEvent(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getEventType() {
    return event?.type || event?.category || "Music";
  }

  function getEventImage() {
    if (event?.image) {
      return event.image;
    }

    const type = getEventType().toLowerCase();

    if (type.includes("sport") || type.includes("football") || type.includes("soccer")) {
      return "https://unsplash.com";
    }

    if (type.includes("theatre") || type.includes("theater") || type.includes("show")) {
      return "https://unsplash.com";
    }

    return "https://unsplash.com";
  }

  function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="loading">Loading event...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-page">
        <div className="details-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={loadEvent} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const venueName = event.venueId?.venueName || event.venueId?.name || event.venue || "VenueFlow Arena";
  const venueAddress = event.venueId?.address || event.address || "123 Main Street";
  const venueCity = event.venueId?.city || event.city || "Johannesburg";

  const latitude = event.venueId?.latitude || event.latitude || "";
  const longitude = event.venueId?.longitude || event.longitude || "";

  return (
    <div className="event-details-page">
      <Link to="/events" className="back-link">
        Back to Events
      </Link>

      <div className="event-details-card">
        <div className="details-image">
          <img src={getEventImage()} alt={event.title} />
          <div className="details-type">{getEventType()}</div>
        </div>

        <div className="details-content">
          <p className="details-label">EVENT</p>
          <h1>{event.title}</h1>
          <p className="details-description">{event.description}</p>

          <div className="details-info">
            <div className="info-box">
              <span className="info-icon"></span>
              <div>
                <small>DATE</small>
                <strong>{formatDate(event.date)}</strong>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon"></span>
              <div>
                <small>TIME</small>
                <strong>{event.startTime || event.time || "19:00"}</strong>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon"></span>
              <div>
                <small>VENUE</small>
                <strong>{venueName}</strong>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon"></span>
              <div>
                <small>TICKET PRICE</small>
                <strong className="ticket-price">R{event.ticketPrice || 0}</strong>
              </div>
            </div>
          </div>

          <div className="location-box">
            <span className="location-icon"></span>
            <div>
              <strong>{venueName}</strong>
              <p>
                {venueAddress}
                <br />
                {venueCity}
              </p>
            </div>
          </div>

          <div className="event-map-section">
            <div className="map-heading">
              <p>LOCATION</p>
              <h2>Find the Venue</h2>
            </div>

            <GoogleMap
              latitude={latitude}
              longitude={longitude}
              venueName={venueName}
            />
          </div>

          <div className="details-actions">
            <Link
              to={`/events/${event._id}/seats`}
              className="select-seats-button"
            >
              Select Seats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;