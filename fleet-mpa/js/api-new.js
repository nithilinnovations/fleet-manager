const API_URL = "https://fleet-manager-o3ma.onrender.com/api/vehicles";

// Add Vehicle
async function addVehicle(vehicle) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(vehicle)
  });

  return await res.json();
}

// Get Vehicles
async function getVehicles() {
  const res = await fetch(API_URL);
  return await res.json();
}
async function updateVehicle(id, vehicle) {

    const res = await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(vehicle)

    });

    return await res.json();

}
async function deleteVehicle(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  return await res.json();
}
async function getVehicle(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

