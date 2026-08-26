import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx"; 

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import SeatSelection from "./pages/SeatSelector.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected General & Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Customer", "Manager", "Admin"]} />}>
            <Route path="/" element={<Navigate to="/events" replace />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/seats" element={<SeatSelection />} />
            <Route path="/bookings" element={<BookingHistory />} />
          </Route>

          {/* Protected Venue Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Manager", "Admin"]} />}>
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;