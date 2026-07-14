const express = require("express");
const router = express.Router();

const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

router.post("/", addVehicle);
router.get("/", getVehicles);
router.put("/:id", updateVehicle);
router.get("/:id", getVehicleById);
router.delete("/:id", deleteVehicle);

module.exports = router;