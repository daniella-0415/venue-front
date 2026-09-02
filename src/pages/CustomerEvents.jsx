import { useEffect, useState } from "react";
import "./CustomerEvents.css";

const API_URL = "http://localhost:3000";

const CustomerEvents = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/events`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load events"
        );
      }

      setEvents(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-ZA",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="customer-events-page">
        <div className="events-loading">
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-events-page">
        <div className="events-error">
          <h2>Unable to load events</h2>
          <p>{error}</p>

          <button onClick={fetchEvents}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-events-page">



      <header className="customer-header">

        <div className="customer-logo">
          Venue<span>FlowThingy</span>
        </div>

        <nav>
          <button className="active-nav">
            Events
          </button>

          <button
            onClick={() =>
              onNavigate("booking-history")
            }
          >
            My Bookings
          </button>

          <button
            onClick={() =>
              onNavigate("login")
            }
          >
            Logout
          </button>
        </nav>

      </header>

      <main className="events-content">

        <div className="events-heading">
          <p className="small-heading">
            DISCOVER
          </p>

          <h1>Upcoming Events</h1>

          <p>
            Find an event and choose your seats.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="no-events">
            <h2>No events available</h2>

            <p>
              There are currently no events
              available for booking.
            </p>
          </div>
        ) : (

          <div className="events-grid">

            {events.map((event) => (

              <div
                className="event-card"
                key={event._id}
              >


                <div className="event-image">

                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                    />
                  ) : (
                    <div className="event-image-placeholder">
                      VenueFlow
                    </div>
                  )}

                </div>


                <div className="event-info">

                  <h2>
                    {event.title}
                  </h2>

                  <p className="event-description">
                    {event.description ||
                      "Experience this amazing event."}
                  </p>

                  <div className="event-details">

                    <div>
                      <strong>Date</strong>
                      <span>
                        {formatDate(event.date)}
                      </span>
                    </div>

                    <div>
                      <strong>Time</strong>
                      <span>
                        {event.startTime}
                      </span>
                    </div>

                    <div>
                      <strong>Venue</strong>
                      <span>
                        {event.venueId?.name ||
                          "Venue"}
                      </span>
                    </div>

                    <div>
                      <strong>Ticket</strong>
                      <span>
                        R
                        {Number(
                          event.ticketPrice
                        ).toFixed(2)}
                      </span>
                    </div>

                  </div>

                  <button
                    className="view-event-button"
                    onClick={() =>
                      onNavigate(
                        "event-details",
                        event._id
                      )
                    }
                  >
                    View Event
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default CustomerEvents;