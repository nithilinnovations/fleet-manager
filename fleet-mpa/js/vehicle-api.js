const API_URL = "https://fleet-manager-o3ma.onrender.com/api/vehicles";

async function getVehicles() {
    const res = await fetch(API_URL);
    return await res.json();
}

async function getVehicle(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return await res.json();
}