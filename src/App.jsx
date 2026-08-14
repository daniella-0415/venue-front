import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelector";
import BookingHistory from "./pages/BookingHistory";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
