const VEHICLE_API_URL = "https://fleet-manager-o3ma.onrender.com/api/vehicles";
async function getVehicles() {
    const res = await fetch(VEHICLE_API_URL);
    return await res.json();
}

async function getVehicle(id) {
    const res = await fetch(`${VEHICLE_API_URL}/${id}`);
    return await res.json();
}
async function updateVehicle(id, vehicleData) {

    const res = await fetch(`${VEHICLE_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehicleData)
    });

    return await res.json();
}