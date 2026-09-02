import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">


      <section className="home-hero">

        <div className="home-hero-content">

          <p className="home-label">
            VENUEFLOWTHINGY
          </p>

          <h1>
            Discover.
            <br />
            Book.
            <br />
            Experience.
          </h1>

          <p className="home-description">
            Find amazing events, choose your seats,
            and book unforgettable experiences with
            VenueFlowTHINGY
          </p>

          <div className="home-actions">

            <Link
              to="/events"
              className="home-primary-button"
            >
              Explore Events
            </Link>

            <Link
              to="/signup"
              className="home-secondary-button"
            >
              Create Account
            </Link>

          </div>

        </div>

        <div className="home-hero-visual">

          <div className="hero-card hero-card-one">
            <span>EVENTS</span>
            <strong>Discover what's happening</strong>
          </div>

          <div className="hero-card hero-card-two">
            <span>SEATS</span>
            <strong>Choose your perfect seat</strong>
          </div>

          <div className="hero-card hero-card-three">
            <span>BOOKINGS</span>
            <strong>Everything in one place</strong>
          </div>

        </div>

      </section>


    

      <section className="home-features">

        <div className="home-section-heading">

          <p className="home-label">
            WHY VENUEFLOW
          </p>

          <h2>
            Your complete event experience
          </h2>

        </div>


        <div className="home-feature-grid">

          <div className="home-feature-card">

            <div className="home-feature-number">
              01
            </div>

            <h3>
              Discover Events
            </h3>

            <p>
              Browse upcoming events and find
              something worth experiencing.
            </p>

          </div>


          <div className="home-feature-card">

            <div className="home-feature-number">
              02
            </div>

            <h3>
              Select Your Seats
            </h3>

            <p>
              Choose the seats you want before
              completing your booking.
            </p>

          </div>


          <div className="home-feature-card">

            <div className="home-feature-number">
              03
            </div>

            <h3>
              Book Securely
            </h3>

            <p>
              Manage your bookings and keep
              track of your event experiences.
            </p>

          </div>

        </div>

      </section>



      <section className="home-cta">

        <p className="home-label">
          READY TO GO?
        </p>

        <h2>
          Find your next experience.
        </h2>

        <Link
          to="/events"
          className="home-primary-button"
        >
          Browse Events
        </Link>

      </section>

    </div>
  );
}

export default Home;