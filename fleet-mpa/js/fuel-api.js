const API_URL = "https://fleet-manager-o3ma.onrender.com/api/vehicles";

// Get all vehicles
async function getVehicles() {
  const res = await fetch(API_URL);
  return await res.json();
}

// Get single vehicle
async function getVehicle(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}