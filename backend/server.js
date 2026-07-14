const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/firebase");
const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);

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