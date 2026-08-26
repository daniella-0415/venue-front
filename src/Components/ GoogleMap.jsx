import { useState, useEffect } from "react";
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

function GoogleMap({ venueLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Error getting user location: ", error.message);
        }
      );
    }
  }, []);

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

  
  const mapCenter = venueLocation || userLocation || defaultCenter;

  return (
    <div className="google-map-wrapper">
      <GoogleMapComponent
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
      >
        {userLocation && (
          <Marker 
            position={userLocation} 
            title="Your Location"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
        )}

        {venueLocation && (
          <Marker 
            position={venueLocation} 
            title="Venue Location"
          />
        )}
      </GoogleMapComponent>
    </div>
  );
}

export default GoogleMap;