const FUEL_API = "https://fleet-manager-o3ma.onrender.com/api/fuel";

async function addFuelEntry(data) {
  const res = await fetch(FUEL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}

async function getFuelHistory(vehicleId) {
  const res = await fetch(`${FUEL_API}/${vehicleId}`);
  return await res.json();
}