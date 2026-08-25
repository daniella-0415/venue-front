import {
  GoogleMap as GoogleMapComponent,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import "./GoogleMap.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -26.2041,
  lng: 28.0473,
};

function GoogleMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="map-error">
        <h3>Google Maps could not load</h3>
        <p>Please check your Google Maps API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        Loading Google Maps...
      </div>
    );
  }

  return (
    <div className="google-map-wrapper">
      <GoogleMapComponent
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
      >
        <Marker position={defaultCenter} />
      </GoogleMapComponent>
    </div>
  );
}

export default GoogleMap;