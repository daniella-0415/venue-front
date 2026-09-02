import React, { useState, useEffect } from "react";
import "./Venues.css";

import AddressSearch from "../Components/AddressSearch";
import GoogleMap from "../Components/GoogleMap";

const API_URL = "http://localhost:3000/api/venues";

function Venues() {
  const [venues, setVenues] = useState([]);

  const [formData, setFormData] = useState({
    venueName: "",
    description: "",
    address: "",
    city: "",
    capacity: "",
    numberOfRows: "",
    seatsPerRow: "",
    latitude: "",
    longitude: "",
    placeId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  const fetchVenues = async () => {
    try {
      setError("");

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("Failed to fetch venues");
      }

      const data = await res.json();

      setVenues(data);

    } catch (err) {

      console.error(err);

      setError(err.message);
    }
  };


  useEffect(() => {
    fetchVenues();
  }, []);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };



  const handleAddressSelect = (locationData) => {

    setFormData((previous) => ({
      ...previous,

      address:
        locationData.address || "",

      city:
        locationData.city || "",

      latitude:
        locationData.latitude || "",

      longitude:
        locationData.longitude || "",

      placeId:
        locationData.placeId || "",
    }));


    if (
      locationData.latitude &&
      locationData.longitude
    ) {

      setError("");

      setMessage(
        "Address found successfully."
      );
    }
  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setError("");

      setMessage("");


      if (
        !formData.latitude ||
        !formData.longitude
      ) {

        setError(
          "Please search for and select the venue address."
        );

        return;
      }


      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;


      const method = editingId
        ? "PUT"
        : "POST";


      const body = {

        venueName:
          formData.venueName,

        description:
          formData.description,

        address:
          formData.address,

        city:
          formData.city,

        capacity:
          Number(formData.capacity),

        numberOfRows:
          Number(formData.numberOfRows),

        seatsPerRow:
          Number(formData.seatsPerRow),

        latitude:
          Number(formData.latitude),

        longitude:
          Number(formData.longitude),

        placeId:
          formData.placeId,
      };


      const res = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(body),
        }
      );


      const data =
        await res.json();


      if (!res.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Failed to save venue"
        );
      }


      setMessage(
        editingId
          ? "Venue updated successfully."
          : "Venue created successfully."
      );


      resetForm();

      fetchVenues();


    } catch (err) {

      console.error(err);

      setError(err.message);
    }
  };


  const handleEdit = (venue) => {

    setEditingId(
      venue._id
    );


    const latitude =
      venue.latitude ??
      venue.location?.latitude ??
      "";

    const longitude =
      venue.longitude ??
      venue.location?.longitude ??
      "";


    setFormData({

      venueName:
        venue.venueName ||
        venue.name ||
        "",

      description:
        venue.description ||
        "",

      address:
        venue.address ||
        "",

      city:
        venue.city ||
        "",

      capacity:
        venue.capacity ||
        "",

      numberOfRows:
        venue.numberOfRows ||
        venue.rows ||
        "",

      seatsPerRow:
        venue.seatsPerRow ||
        "",

      latitude,

      longitude,

      placeId:
        venue.placeId ||
        "",
    });


    setMessage("");

    setError("");


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };



  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this venue?"
      );


    if (!confirmed) return;


    try {

      setError("");

      setMessage("");


      const res =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Failed to delete venue"
        );
      }


      setMessage(
        "Venue deleted successfully."
      );


      fetchVenues();


    } catch (err) {

      console.error(err);

      setError(err.message);
    }
  };



  const resetForm = () => {

    setEditingId(null);

    setFormData({

      venueName: "",

      description: "",

      address: "",

      city: "",

      capacity: "",

      numberOfRows: "",

      seatsPerRow: "",

      latitude: "",

      longitude: "",

      placeId: "",
    });
  };


  return (

    <div className="venues-page">

      <h2>
        {editingId
          ? "Edit Venue"
          : "Create New Venue"}
      </h2>


      {error && (
        <div className="venue-error">
          {error}
        </div>
      )}


      {message && (
        <div className="venue-success">
          {message}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="venue-form"
      >

        <div className="form-group">

          <label>
            Venue Name
          </label>

          <input
            type="text"
            name="venueName"
            value={
              formData.venueName
            }
            onChange={
              handleChange
            }
            required
          />

        </div>


        <div className="form-group">

          <label>
            Description
          </label>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
          />

        </div>



        <div className="form-group">

          <label>
            Search Venue Address
          </label>

          <AddressSearch
            value={
              formData.address
            }
            onAddressSelect={
              handleAddressSelect
            }
          />

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>
              City
            </label>

            <input
              type="text"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label>
              Total Capacity
            </label>

            <input
              type="number"
              name="capacity"
              value={
                formData.capacity
              }
              onChange={
                handleChange
              }
            />

          </div>

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>
              Number of Rows
            </label>

            <input
              type="number"
              name="numberOfRows"
              value={
                formData.numberOfRows
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label>
              Seats Per Row
            </label>

            <input
              type="number"
              name="seatsPerRow"
              value={
                formData.seatsPerRow
              }
              onChange={
                handleChange
              }
            />

          </div>

        </div>


        <div className="form-actions">

          <button
            type="submit"
            className="btn-primary"
          >

            {editingId
              ? "Update Venue"
              : "Save Venue"}

          </button>


          {editingId && (

            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >

              Cancel

            </button>

          )}

        </div>

      </form>


      <div
        className="map-preview-container"
        style={{
          marginTop: "20px",
        }}
      >

        <GoogleMap

          latitude={
            formData.latitude
          }

          longitude={
            formData.longitude
          }

          venueName={
            formData.venueName
          }

        />

      </div>



      <div
        className="venues-list-container"
        style={{
          marginTop: "40px",
        }}
      >

        <h3>
          Registered Venues
        </h3>


        <table className="venues-table">

          <thead>

            <tr>

              <th>Name</th>

              <th>Address</th>

              <th>City</th>

              <th>Capacity</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {venues.map(
              (venue) => (

                <tr
                  key={
                    venue._id
                  }
                >

                  <td>
                    {venue.venueName ||
                      venue.name}
                  </td>

                  <td>
                    {venue.address}
                  </td>

                  <td>
                    {venue.city}
                  </td>

                  <td>
                    {venue.capacity}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        handleEdit(
                          venue
                        )
                      }
                      className="btn-edit"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        handleDelete(
                          venue._id
                        )
                      }
                      className="btn-delete"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Venues;