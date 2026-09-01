import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./Components/AuthContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import SeatSelection from "./pages/SeatSelector.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import Payments from "./pages/Payments.jsx";
import PaymentResult from "./pages/PaymentsResult.jsx";

import Manager from "./pages/Manager.jsx";
import ManagerEvents from "./pages/ManagerEvents.jsx";
import ManagerBookings from "./pages/ManagerBookings.jsx";
import Venues from "./pages/Venues.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";


function AppContent() {
  const location = useLocation();

  // Pages where Navbar and Footer should NOT appear
  const publicPages = [
    "/login",
    "/signup",
  ];

  const showLayout =
    !publicPages.includes(location.pathname);

  return (
    <div className="app">

      {/* GLOBAL NAVBAR */}
      {showLayout && <Navbar />}


      {/* =====================================================
          APPLICATION ROUTES
      ====================================================== */}

      <main className="app-main">

        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ====================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* =====================================================
              CUSTOMER ROUTES
          ====================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Customer",
                ]}
              />
            }
          >

            {/* Home */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/events"
                  replace
                />
              }
            />

            {/* Events */}

            <Route
              path="/events"
              element={<Events />}
            />

            {/* Event Details */}

            <Route
              path="/events/:id"
              element={<EventDetails />}
            />

            {/* Seat Selection */}

            <Route
              path="/events/:id/seats"
              element={<SeatSelection />}
            />

            {/* Booking History */}

            <Route
              path="/bookings"
              element={<BookingHistory />}
            />

            {/* Booking Confirmation */}

            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />

            {/* Payments */}

            <Route
              path="/payments"
              element={<Payments />}
            />

            {/* Payment Result */}

            <Route
              path="/payment-result"
              element={<PaymentResult />}
            />

          </Route>


          {/* =====================================================
              VENUE MANAGER ROUTES
          ====================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Venue Manager",
                  "Manager",
                ]}
              />
            }
          >

            {/* Manager Dashboard */}

            <Route
              path="/manager"
              element={<Manager />}
            />

            {/* Manager Venues */}

            <Route
              path="/manager/venues"
              element={<Venues />}
            />

            {/* Manager Events */}

            <Route
              path="/manager/events"
              element={<ManagerEvents />}
            />

            {/* Manager Bookings */}

            <Route
              path="/manager/bookings"
              element={<ManagerBookings />}
            />

          </Route>


          {/* =====================================================
              ADMINISTRATOR ROUTES
          ====================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Administrator",
                  "Admin",
                ]}
              />
            }
          >

            {/* Admin Dashboard */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* Admin Venues */}

            <Route
              path="/admin/venues"
              element={<Venues />}
            />

          </Route>


          {/* =====================================================
              FALLBACK
          ====================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/events"
                replace
              />
            }
          />

        </Routes>

      </main>


      {/* GLOBAL FOOTER */}
      {showLayout && <Footer />}

    </div>
  );
}


function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <AppContent />

      </BrowserRouter>

    </AuthProvider>
  );
}


export default App;