const express = require("express");
const router = express.Router();

const {
  addFuel,
  getFuelHistory,
  deleteFuel
} = require("../controllers/fuelController");

router.post("/", addFuel);
router.get("/:vehicleId", getFuelHistory);
router.delete("/:id", deleteFuel);

module.exports = router;