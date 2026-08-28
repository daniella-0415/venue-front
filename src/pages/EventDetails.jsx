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

      const data = await apiRequest("/api/events");

      const foundEvent = data.find((item) => item._id === id);

      if (!foundEvent) {
        throw new Error("Event could not be found.");
      }

      setEvent(foundEvent);
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

    if (type.includes("sport") || type.includes("football")) {
      return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80";
    }

    if (type.includes("theatre") || type.includes("theater")) {
      return "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80";
    }

    return "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80";
  }

  function formatDate(date) {
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

  const venueName = event.venueId?.name || event.venue || "VenueFlow Arena";

  const venueAddress = event.venueId?.address || "123 Main Street";

  const venueCity = event.venueId?.city || "Johannesburg";

  return (
    <div className="event-details-page">
      

      <Link to="/events" className="back-link">
        Back to Events
      </Link>

      <div className="event-details-card">
        

        <div className="details-image">
          <img src={getEventImage()} alt={event.title} />

          <div className="details-type">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g fill="none" stroke="#5a2203" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v14" />
                <path d="M19 7.674v-.657a4 4 0 0 0-2.901-3.846l-2.824-.807A1 1 0 0 0 12 3.326V7l5.725 1.636A1 1 0 0 0 19 7.674Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3 3 0 1 1-6 0c0-1.657 1.343-2 3-2s3 .343 3 2" />
              </g>
            </svg>
             {getEventType()}
            </div>
        </div>


        <div className="details-content">
          <p className="details-label">EVENT</p>

          <h1>{event.title}</h1>

          <p className="details-description">{event.description}</p>

          <div className="details-info">
            <div className="info-box">
              <span className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="none" stroke="#ff5b01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <rect width="20" height="18" x="2" y="4" rx="4" />
                    <path d="M8 2v4m8-4v4M2 10h20" />
                  </g>
                </svg>

              </span>

              <div>
                <small>DATE</small>

                <strong>{formatDate(event.date)}</strong>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="none" stroke="#ff5b01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 16l-2.414-2.414A2 2 0 0 1 12 12.172V6" />
                  </g>
                </svg>

              </span>

              <div>
                <small>TIME</small>

                <strong>{event.startTime || event.time || "19:00"}</strong>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="none" stroke="#fe6201" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8" />
                  </g>
                </svg>

              </span>

              <div>
                <small>VENUE</small>

                <strong>{venueName}</strong>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path fill="#fe6201" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372" />
                  <path fill="#fe6201" d="M464 336a48 48 0 1 0 96 0a48 48 0 1 0-96 0m72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8" />
                </svg>

              </span>

              <div>
                <small>TICKET PRICE</small>

                <strong className="ticket-price">R{event.ticketPrice}</strong>
              </div>
            </div>
          </div>


          <div className="location-box">
            <span className="location-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="#ff5b01" d="M11 9.86V16l1 2l1-2V9.86c1.72-.45 3-2 3-3.86c0-2.21-1.79-4-4-4S8 3.79 8 6c0 1.86 1.28 3.41 3 3.86" />
                <path fill="#ff5b01" d="M15 14.17v2.01c3.29.41 5 1.41 5 1.82c0 .51-2.75 2-8 2s-8-1.49-8-2c0-.4 1.71-1.41 5-1.82v-2.01c-3.75.42-7 1.66-7 3.83c0 2.75 5.18 4 10 4s10-1.25 10-4c0-2.18-3.25-3.41-7-3.83" />
              </svg>

            </span>

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

            <GoogleMap venueLocation={event.venueId?.location}/>
          </div>

          <Link
            to={`/events/${event._id}/seats`}
            className="select-seats-button"
          >
            Select Seats →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
