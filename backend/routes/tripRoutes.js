const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// GET Trips
router.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Trips API Working"
  });
});

// POST Trip
router.post("/", async (req, res) => {
  try {

    const trip = {
      ...req.body,
      createdAt: new Date()
    };

    const docRef = await db.collection("trips").add(trip);

    res.json({
      success: true,
      id: docRef.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

module.exports = router;