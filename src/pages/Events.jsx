import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await apiRequest("/api/events");

      setEvents(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getEventType(event) {
    return (
      event.type ||
      event.category ||
      "Music"
    );
  }

  function getEventImage(event) {
    const type = getEventType(event).toLowerCase();

    if (event.image) {
      return event.image;
    }

    if (
      type.includes("sport") ||
      type.includes("football")
    ) {
      return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80";
    }

    if (
      type.includes("theatre") ||
      type.includes("theater")
    ) {
      return "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80";
    }

    // Music
    return "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80";
  }

  function getEventIcon(event) {
    const type = getEventType(event).toLowerCase();

    if (
      type.includes("sport") ||
      type.includes("football")
    ) {
      return " Sport";
    }

    if (
      type.includes("theatre") ||
      type.includes("theater")
    ) {
      return " Theatre";
    }

    return " Music";
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString(
      "en-ZA",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function getDay(date) {
    return new Date(date).getDate();
  }

  function getMonth(date) {
    return new Date(date)
      .toLocaleDateString("en-ZA", {
        month: "short",
      })
      .toUpperCase();
  }

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading">
          Loading events...
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">

      {/* HEADER */}
      <div className="events-header">

        <div>
          <p className="section-label">
            WHAT'S ON
          </p>

          <h1>
            Upcoming Events
          </h1>
        </div>

        <span className="event-count">
          {events.length} events available
        </span>

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="event-grid">

        {events.length === 0 ? (
          <div className="empty">
            No events available yet.
          </div>
        ) : (

          events.map((event) => (

            <div
              className="event-card"
              key={event._id}
            >

              {/* IMAGE */}
              <div className="event-image">

                <img
                  src={getEventImage(event)}
                  alt={event.title}
                />

                {/* DATE */}
                <div className="date-badge">

                  <strong>
                    {getDay(event.date)}
                  </strong>

                  <span>
                    {getMonth(event.date)}
                  </span>

                </div>

                {/* TYPE */}
                <div className="event-type">
                  {getEventIcon(event)}
                </div>

              </div>

              {/* INFORMATION */}
              <div className="event-info">

                <p className="event-date">
                  {formatDate(event.date)}
                </p>

                <h2>
                  {event.title}
                </h2>

                <p className="event-description">
                  {event.description}
                </p>

                <div className="event-bottom">

                  <span className="venue">
                    📍{" "}
                    {event.venueId?.name ||
                      event.venue ||
                      "VenueFlow Arena"}
                  </span>

                  <span className="price">
                    R{event.ticketPrice}
                  </span>

                </div>

                <Link
                  to={`/events/${event._id}`}
                  className="view-event-button"
                >
                  View Event
                </Link>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Events;