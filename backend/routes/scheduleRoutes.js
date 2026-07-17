const express = require("express");

const router = express.Router();

const {
  addSchedule,
  getSchedule
} = require("../controllers/scheduleController");

// Save Schedule
router.post("/", addSchedule);

// Get All Schedule
router.get("/", getSchedule);

module.exports = router;