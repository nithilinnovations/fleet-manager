const express = require("express");
const router = express.Router();

const {
  addFuel,
  getFuelHistory
} = require("../controllers/fuelController");

router.post("/", addFuel);
router.get("/:vehicleId", getFuelHistory);

module.exports = router;