const DOCUMENT_API_URL = "https://fleet-manager-o3ma.onrender.com/api/documents";
async function getDocument(vehicleId) {
    const res = await fetch(`${DOCUMENT_API_URL}/${vehicleId}`);
    return await res.json();
}

async function saveDocument(data) {
    const res = await fetch(DOCUMENT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

async function updateDocument(id, data) {
    const res = await fetch(`${DOCUMENT_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}