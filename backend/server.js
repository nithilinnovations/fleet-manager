const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/firebase");
const vehicleRoutes = require("./routes/vehicleRoutes");

const fuelRoutes = require("./routes/fuelRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const loginRoutes = require("./routes/loginRoutes");
const documentRoutes = require("./routes/documentRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/trips", tripRoutes);
app.get("/api/test123", (req, res) => {
  res.send("TEST OK");
});
// Firestore test

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fleet Manager Backend Running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await db.collection("vehicles").limit(1).get();
    console.log("✅ Firebase Firestore Connected Successfully");
  } catch (err) {
    console.error("❌ Firebase Connection Failed");
    console.error(err.message);
  }
});