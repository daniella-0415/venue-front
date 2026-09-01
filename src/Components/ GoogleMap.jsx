import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GoogleMap.css";

// Fix Leaflet marker icons when using Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function GoogleMap({
  latitude,
  longitude,
  venueName,
}) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  const hasCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  if (!hasCoordinates) {
    return (
      <div className="google-map-wrapper">
        <div className="map-unavailable">
          <span className="map-unavailable-icon">
            📍
          </span>

          <h3>
            Location unavailable
          </h3>

          <p>
            The venue location has not been
            provided yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="google-map-wrapper">

      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="venue-map"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>

          <Popup>
            <strong>
              {venueName || "VenueFlow Venue"}
            </strong>

            <br />

            Venue location
          </Popup>

        </Marker>

      </MapContainer>

    </div>
  );
}

export default GoogleMap;