console.log("maintenance-api loaded");

const MAINTENANCE_API_URL = "https://fleet-manager-o3ma.onrender.com/api/maintenance";

async function addMaintenance(data) {
    const res = await fetch(MAINTENANCE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

async function getMaintenance() {
    const res = await fetch(MAINTENANCE_API_URL);
    return await res.json();
}

window.addMaintenance = addMaintenance;
window.getMaintenance = getMaintenance;

async function updateMaintenance(id, data) {

    const res = await fetch(`${MAINTENANCE_API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    });

    return await res.json();
}

window.updateMaintenance = updateMaintenance;