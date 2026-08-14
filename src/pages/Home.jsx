import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            EXPERIENCE MORE
          </p>

          <h1>
            Your next
            <span> unforgettable</span>
            experience starts here.
          </h1>

          <p>
            Discover concerts, movies, shows and
            unforgettable events. Choose your seats
            and book your experience with VenueFlow.
          </p>

          <div className="hero-buttons">

            <Link
              to="/events"
              className="primary-button"
            >
              Explore Events
            </Link>

            <Link
              to="/venues"
              className="secondary-button"
            >
              Explore Venues
            </Link>

          </div>

        </div>

      </section>

      <section className="features">

        <div className="feature">
          <div className="feature-icon">
            
          </div>

          <h3>
            Easy Booking
          </h3>

          <p>
            Find your event and book your
            seats in just a few clicks.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            
          </div>

          <h3>
            Choose Your Seat
          </h3>

          <p>
            Pick exactly where you want
            to sit before confirming.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            
          </div>

          <h3>
            Secure
          </h3>

          <p>
            Your bookings and account
            information stay protected.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Home;