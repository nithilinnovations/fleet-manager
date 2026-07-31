const express = require("express");
const router = express.Router();

const {
  addFuel,
  getFuelHistory,
  getAllFuel,
  deleteFuel
} = require("../controllers/fuelController");

router.post("/", addFuel);
router.get("/", getAllFuel);
router.get("/:vehicleId", getFuelHistory);
router.delete("/:id", deleteFuel);

module.exports = router;