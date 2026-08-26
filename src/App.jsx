import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Manager from "./pages/Manager";
import Venues from "./pages/Venues";
import Events from "./pages/Events";

import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelector";
import BookingHistory from "./pages/BookingHistory";
import BookingConfirmation from "./pages/BookingConfirmation";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================
              AUTH
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* =========================
              MANAGER DASHBOARD
          ========================= */}

          <Route
            path="/manager"
            element={<Manager />}
          />


          {/* =========================
              MANAGER VENUES
          ========================= */}

          <Route
            path="/manager/venues"
            element={<Venues />}
          />


          {/* =========================
              MANAGER EVENTS
          ========================= */}

          <Route
            path="/manager/events"
            element={<Events />}
          />


          {/* =========================
              MANAGER BOOKINGS
          ========================= */}

          <Route
            path="/manager/bookings"
            element={
              <div style={{ padding: "40px" }}>
                <h1>Manager Bookings</h1>
                <p>
                  Booking management will be added next.
                </p>
              </div>
            }
          />
<Route
  path="/booking-confirmation"
  element={<BookingConfirmation />}
/>

          {/* =========================
              CUSTOMER EVENTS
          ========================= */}

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/events/:id/seats"
            element={<SeatSelection />}
          />

          <Route
            path="/bookings"
            element={<BookingHistory />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;