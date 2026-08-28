import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./GoogleMap.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


function MapUpdater({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (
      latitude !== "" &&
      longitude !== "" &&
      latitude !== null &&
      longitude !== null &&
      !isNaN(Number(latitude)) &&
      !isNaN(Number(longitude))
    ) {
      map.setView(
        [Number(latitude), Number(longitude)],
        15
      );
    }
  }, [latitude, longitude, map]);

  return null;
}


function GoogleMap({
  latitude,
  longitude,
  venueName,
}) {
  const geoapifyApiKey =
    import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (!geoapifyApiKey) {
    return (
      <div className="map-error">
        <h3>Geoapify API key missing</h3>

        <p>
          Add VITE_GEOAPIFY_API_KEY to your
          frontend .env file.
        </p>
      </div>
    );
  }


  const hasLocation =
    latitude !== "" &&
    longitude !== "" &&
    latitude !== null &&
    longitude !== null &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude));


  const defaultPosition = [
    -26.2041,
    28.0473,
  ];


  const centerPosition = hasLocation
    ? [
        Number(latitude),
        Number(longitude),
      ]
    : defaultPosition;


  const defaultZoom = hasLocation
    ? 15
    : 12;


  return (
    <div className="google-map-wrapper">

      <MapContainer
        center={centerPosition}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="venue-map"
      >

        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${geoapifyApiKey}`}
          attribution="&copy; Geoapify | &copy; OpenStreetMap contributors"
        />

        <MapUpdater
          latitude={latitude}
          longitude={longitude}
        />

        {hasLocation && (
          <Marker position={centerPosition}>

            <Popup>
              <strong>
                {venueName || "Venue"}
              </strong>

              <br />

              VenueFlow location
            </Popup>

          </Marker>
        )}

      </MapContainer>

    </div>
  );
}


export default GoogleMap;