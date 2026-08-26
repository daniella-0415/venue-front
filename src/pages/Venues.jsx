import React, { useState, useEffect } from "react";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    rows: "",
    seatsPerRow: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/venues");
      if (!res.ok) throw new Error("Failed to fetch venues");
      const data = await res.json();
      setVenues(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `http://localhost:3000/api/venues/${editingId}` : "http://localhost:3000/api/venues";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save venue");

      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        rows: "",
        seatsPerRow: "",
      });
      fetchVenues();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (venue) => {
    setEditingId(venue._id);
    setFormData({
      name: venue.name || "",
      description: venue.description || "",
      address: venue.address || "",
      city: venue.city || "",
      rows: venue.rows || "",
      seatsPerRow: venue.seatsPerRow || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/venues/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete venue");

      fetchVenues();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{editingId ? "Edit Venue" : "Create Venue"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Venue Name" value={formData.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input name="rows" type="number" placeholder="Rows (1-26)" value={formData.rows} onChange={handleChange} min="1" max="26" required />
        <input name="seatsPerRow" type="number" placeholder="Seats per row" value={formData.seatsPerRow} onChange={handleChange} min="1" required />
        <button type="submit">{editingId ? "Update" : "Save"}</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <h2>Venues List</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue._id}>
            <strong>{venue.name}</strong> - {venue.address}, {venue.city} ({venue.capacity} seats)
            <button onClick={() => handleEdit(venue)}>Edit</button>
            <button onClick={() => handleDelete(venue._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Venues;