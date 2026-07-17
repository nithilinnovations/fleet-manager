const SCHEDULE_API_URL = "http://localhost:5000/api/schedule";

// Save Schedule
async function addSchedule(scheduleData) {
    const res = await fetch(SCHEDULE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scheduleData)
    });

    return await res.json();
}

// Get All Schedule
async function getSchedule() {
    const res = await fetch(SCHEDULE_API_URL);
    return await res.json();
}

// Global
window.addSchedule = addSchedule;
window.getSchedule = getSchedule;