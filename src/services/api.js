
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = "http://localhost:3000";
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

  const targetUserId = savedUser?._id || savedUser?.id || "6a7dc3cf148c1fc759ea3c3f"; 
  const targetUserRole = savedUser?.role || "Customer";

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
