import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css"; 

function AddressSearch({ value, onAddressSelect }) {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const handlePlaceSelect = (value) => {
    if (!value) return;

    const props = value.properties;
    const addressName = props.formatted;
    
    const lng = value.geometry.coordinates[0];
    const lat = value.geometry.coordinates[1];
    
    const city = props.city || props.county || props.state || "";

    onAddressSelect({
      address: addressName,
      city: city,
      latitude: lat,
      longitude: lng,
      placeId: props.place_id || "",
      name: props.name || props.street || "",
    });
  };

  return (
    <GeoapifyContext apiKey={apiKey}>
      <GeoapifyGeocoderAutocomplete
        placeholder="Search for venue address..."
        value={value || ""}
        type="amenity"
        filterByCountryCode={["za"]} 
        placeSelect={handlePlaceSelect}
      />
    </GeoapifyContext>
  );
}

export default AddressSearch;