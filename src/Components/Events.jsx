import React, { useState, useEffect } from "react";


export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    venueId: "",
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    ticketSalesClosingDate: "",
    image: "",
    ticketPrice: "",
    availableSeats: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [eventsRes, venuesRes] = await Promise.all([
        fetch("http://localhost:3000/api/events"),
        fetch("http://localhost:3000/api/venues"),
      ]);

      if (!eventsRes.ok || !venuesRes.ok) {
        throw new Error("Failed to fetch events or venues");
      }

      const eventsData = await eventsRes.json();
      const venuesData = await venuesRes.json();

      setEvents(eventsData);
      setVenues(venuesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${"http://localhost:3000/api/events"}/${editingId}` : "http://localhost:3000/api/events";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save event");

      setEditingId(null);
      setFormData({
        venueId: "",
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        ticketSalesClosingDate: "",
        image: "",
        ticketPrice: "",
        availableSeats: "",
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      venueId: event.venueId?._id || event.venueId || "",
      title: event.title || "",
      description: event.description || "",
      date: event.date ? event.date.split("T")[0] : "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      ticketSalesClosingDate: event.ticketSalesClosingDate
        ? event.ticketSalesClosingDate.split("T")[0]
        : "",
      image: event.image || "",
      ticketPrice: event.ticketPrice || "",
      availableSeats: event.availableSeats || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${"http://localhost:3000/api/events"}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{editingId ? "Edit Event" : "Create Event"}</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="venueId"
          value={formData.venueId}
          onChange={handleChange}
          required
        >
          <option value="">Select Venue</option>
          {venues.map((v) => (
            <option key={v._id} value={v._id}>
              {v.venueName}
            </option>
          ))}
        </select>
        <input
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={handleChange}
        />
        <input
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={handleChange}
        />
        <input
          name="ticketSalesClosingDate"
          type="date"
          value={formData.ticketSalesClosingDate}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Banner Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <input
          name="ticketPrice"
          type="number"
          placeholder="Price"
          value={formData.ticketPrice}
          onChange={handleChange}
        />
        <input
          name="availableSeats"
          type="number"
          placeholder="Seats"
          value={formData.availableSeats}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Save"}</button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        )}
      </form>

      <h2>Events List</h2>
      <ul>
        {events.map((ev) => (
          <li key={ev._id}>
            <strong>{ev.title}</strong> at{" "}
            {ev.venueId?.venueName || "Unknown Venue"} (
            {ev.date ? new Date(ev.date).toLocaleDateString() : "N/A"})
            <button onClick={() => handleEdit(ev)}>Edit</button>
            <button onClick={() => handleDelete(ev._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}