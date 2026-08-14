import React, { useState, useEffect } from "react";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    venueName: "",
    description: "",
    address: "",
    capacity: "",
    numberOfRows: "",
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
      const url = editingId ? `${"http://localhost:3000/api/venues"}/${editingId}` : "http://localhost:3000/api/venues";
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
        venueName: "",
        description: "",
        address: "",
        capacity: "",
        numberOfRows: "",
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
      venueName: venue.venueName || "",
      description: venue.description || "",
      address: venue.address || "",
      capacity: venue.capacity || "",
      numberOfRows: venue.numberOfRows || "",
      seatsPerRow: venue.seatsPerRow || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${"http://localhost:3000/api/venues"}/${id}`, {
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
        <input name="venueName" placeholder="Venue Name" value={formData.venueName} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input name="capacity" type="number" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required />
        <input name="numberOfRows" type="number" placeholder="Rows" value={formData.numberOfRows} onChange={handleChange} required />
        <input name="seatsPerRow" type="number" placeholder="Seats per row" value={formData.seatsPerRow} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update" : "Save"}</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <h2>Venues List</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue._id}>
            <strong>{venue.venueName}</strong> - {venue.address} ({venue.capacity} seats)
            <button onClick={() => handleEdit(venue)}>Edit</button>
            <button onClick={() => handleDelete(venue._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Venues;