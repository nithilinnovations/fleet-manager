const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// GET Trips
router.get("/", async (req, res) => {
  try {

    const snapshot = await db
      .collection("trips")
      .orderBy("createdAt", "desc")
      .get();

    const trips = [];

    snapshot.forEach(doc => {
      trips.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      trips
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
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