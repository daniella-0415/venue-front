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

  const publicPages = [
    "/login",
    "/signup",
  ];

  const showLayout =
    !publicPages.includes(location.pathname);

  return (
    <div className="app">

      {showLayout && <Navbar />}


    

      <main className="app-main">

        <Routes>

        
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Customer",
                ]}
              />
            }
          >

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

            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />

            <Route
              path="/payments"
              element={<Payments />}
            />

            <Route
              path="/payment-result"
              element={<PaymentResult />}
            />

          </Route>

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

            <Route
              path="/manager"
              element={<Manager />}
            />

            <Route
              path="/manager/venues"
              element={<Venues />}
            />

            <Route
              path="/manager/events"
              element={<ManagerEvents />}
            />

            <Route
              path="/manager/bookings"
              element={<ManagerBookings />}
            />

          </Route>


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

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/venues"
              element={<Venues />}
            />

          </Route>


          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />



          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </main>

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