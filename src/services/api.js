
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const url = `${baseUrl}${endpoint}`;

  const savedUserString = localStorage.getItem("venueflowUser");
  let savedUser = null;
  try {
    if (savedUserString) savedUser = JSON.parse(savedUserString);
  } catch (e) {
    console.error("Failed to parse venueflowUser from storage", e);
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const targetUserId = savedUser?._id || savedUser?.id;
const targetUserRole = savedUser?.role;

if (!targetUserId) {
  console.error("No user found in localStorage! You need to log in again.");
}

  headers["x-user-id"] = targetUserId;
  headers["x-user-role"] = targetUserRole;

  const config = {
    ...options,
    headers,
  };

  console.log(`Sending API Request to ${endpoint} with headers:`, {
    "x-user-id": headers["x-user-id"],
    "x-user-role": headers["x-user-role"]
  });

  const response = await fetch(url, config);
  
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
