import React, { useState, useEffect } from "react";
import "./Venues.css";

import AddressSearch from "../Components/AddressSearch";
import GoogleMap from "../Components/ GoogleMap";

const API_URL = "http://localhost:3000/api/venues";

/*
 * Get the currently logged-in VenueFlow user
 * and prepare the headers required by the backend.
 */
function getAuthHeaders() {
  const savedUser = localStorage.getItem("venueflowUser");

  if (!savedUser) {
    return {};
  }

  try {
    const user = JSON.parse(savedUser);

    return {
      "x-user-id": user.id || user._id,
      "x-user-role": user.role,
    };
  } catch (error) {
    console.error(
      "Could not read venueflowUser:",
      error
    );

    return {};
  }
}

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

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingVenues, setLoadingVenues] =
    useState(true);


  /*
   * ==========================================
   * FETCH VENUES
   * ==========================================
   */

  const fetchVenues = async () => {
    try {
      setError("");
      setLoadingVenues(true);

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(
          "Failed to fetch venues"
        );
      }

      const data = await res.json();

      setVenues(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to load venues."
      );

    } finally {
      setLoadingVenues(false);
    }
  };


  /*
   * Load venues when page opens
   */

  useEffect(() => {
    fetchVenues();
  }, []);


  /*
   * ==========================================
   * FORM CHANGE
   * ==========================================
   */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /*
   * ==========================================
   * ADDRESS SELECT
   * ==========================================
   */

  const handleAddressSelect = (
    locationData
  ) => {

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


  /*
   * ==========================================
   * CREATE / UPDATE VENUE
   * ==========================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);


      /*
       * Make sure the address was selected
       * using AddressSearch.
       */

      if (
        !formData.latitude ||
        !formData.longitude
      ) {
        setError(
          "Please search for and select the venue address."
        );

        return;
      }


      /*
       * Validate city
       */

      if (!formData.city) {
        setError(
          "Please enter the venue city."
        );

        return;
      }


      /*
       * Validate rows
       */

      if (
        !formData.numberOfRows ||
        Number(formData.numberOfRows) <= 0
      ) {
        setError(
          "Please enter a valid number of rows."
        );

        return;
      }


      /*
       * Validate seats
       */

      if (
        !formData.seatsPerRow ||
        Number(formData.seatsPerRow) <= 0
      ) {
        setError(
          "Please enter a valid number of seats per row."
        );

        return;
      }


      /*
       * Determine whether this is
       * CREATE or UPDATE.
       */

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PUT"
        : "POST";


      /*
       * IMPORTANT:
       *
       * The backend expects:
       *
       * name
       * address
       * city
       * rows
       * seatsPerRow
       *
       * NOT:
       *
       * venueName
       * numberOfRows
       */

      const body = {
        name:
          formData.venueName,

        description:
          formData.description,

        address:
          formData.address,

        city:
          formData.city,

        rows:
          Number(
            formData.numberOfRows
          ),

        seatsPerRow:
          Number(
            formData.seatsPerRow
          ),
      };


      /*
       * Send authenticated request.
       *
       * This is the important fix.
       */

      const res = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            ...getAuthHeaders(),
          },

          body:
            JSON.stringify(body),
        }
      );


      /*
       * Try to read the response.
       */

      const data =
        await res.json();


      /*
       * Backend returned an error.
       */

      if (!res.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Failed to save venue."
        );
      }


      /*
       * Success message.
       */

      setMessage(
        editingId
          ? "Venue updated successfully."
          : "Venue created successfully."
      );


      /*
       * Clear the form.
       */

      resetForm();


      /*
       * Refresh venue list.
       */

      await fetchVenues();

    } catch (err) {

      console.error(
        "Venue save error:",
        err
      );

      setError(
        err.message ||
        "Failed to save venue."
      );

    } finally {

      setLoading(false);
    }
  };


  /*
   * ==========================================
   * EDIT VENUE
   * ==========================================
   */

  const handleEdit = (venue) => {

    setEditingId(
      venue._id
    );


    /*
     * Support both possible formats
     * for coordinates.
     */

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


    /*
     * Scroll back to the form.
     */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /*
   * ==========================================
   * DELETE VENUE
   * ==========================================
   */

  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this venue?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setMessage("");
      setLoading(true);


      const res =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",

            headers: {
              ...getAuthHeaders(),
            },
          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Failed to delete venue."
        );
      }


      setMessage(
        "Venue deleted successfully."
      );


      await fetchVenues();


    } catch (err) {

      console.error(
        "Venue delete error:",
        err
      );

      setError(
        err.message ||
        "Failed to delete venue."
      );

    } finally {

      setLoading(false);
    }
  };


  /*
   * ==========================================
   * RESET FORM
   * ==========================================
   */

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

    setError("");
  };


  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (

    <div className="venues-page">

      <h2>
        {editingId
          ? "Edit Venue"
          : "Create New Venue"}
      </h2>


      {/* ERROR */}

      {error && (
        <div className="venue-error">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {message && (
        <div className="venue-success">
          {message}
        </div>
      )}


      {/* ======================================
          VENUE FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="venue-form"
      >

        {/* VENUE NAME */}

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
            placeholder="Enter venue name"
            required
            disabled={loading}
          />

        </div>


        {/* DESCRIPTION */}

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
            placeholder="Describe the venue"
            disabled={loading}
          />

        </div>


        {/* ADDRESS */}

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


        {/* CITY + CAPACITY */}

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
              placeholder="Enter city"
              disabled={loading}
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
              placeholder="Calculated from rows × seats"
              disabled
            />

          </div>

        </div>


        {/* ROWS + SEATS */}

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
              min="1"
              placeholder="e.g. 20"
              disabled={loading}
              required
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
              min="1"
              placeholder="e.g. 15"
              disabled={loading}
              required
            />

          </div>

        </div>


        {/* CAPACITY PREVIEW */}

        {formData.numberOfRows &&
          formData.seatsPerRow && (

          <div
            style={{
              marginBottom: "20px",
              padding: "12px 15px",
              borderRadius: "8px",
              background: "#2b1c11",
              color: "#ff7900",
              fontWeight: "700",
            }}
          >

            Total capacity:{" "}

            {Number(
              formData.numberOfRows
            ) *
              Number(
                formData.seatsPerRow
              )}

            {" "}seats

          </div>

        )}


        {/* FORM BUTTONS */}

        <div className="form-actions">

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : editingId
                ? "Update Venue"
                : "Save Venue"}

          </button>


          {editingId && (

            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
              disabled={loading}
            >

              Cancel

            </button>

          )}

        </div>

      </form>


      {/* ======================================
          MAP
      ====================================== */}

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


      {/* ======================================
          REGISTERED VENUES
      ====================================== */}

      <div
        className="venues-list-container"
        style={{
          marginTop: "40px",
        }}
      >

        <h3>
          Registered Venues
        </h3>


        {loadingVenues ? (

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            Loading venues...
          </div>

        ) : venues.length === 0 ? (

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            No venues registered yet.
          </div>

        ) : (

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table className="venues-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Address
                  </th>

                  <th>
                    City
                  </th>

                  <th>
                    Capacity
                  </th>

                  <th>
                    Actions
                  </th>

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
                        {venue.capacity ??
                          (
                            Number(
                              venue.rows || 0
                            ) *
                            Number(
                              venue.seatsPerRow ||
                              0
                            )
                          )}
                      </td>

                      <td>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              venue
                            )
                          }
                          className="btn-edit"
                          disabled={loading}
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              venue._id
                            )
                          }
                          className="btn-delete"
                          disabled={loading}
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

        )}

      </div>

    </div>
  );
}

export default Venues;