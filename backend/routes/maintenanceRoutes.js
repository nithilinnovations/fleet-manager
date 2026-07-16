const express = require("express");
const router = express.Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Maintenance Route Working"
    });
});

const {
  addMaintenance,
  getMaintenance
} = require("../controllers/maintenanceController");

router.post("/", addMaintenance);
router.get("/", getMaintenance);

module.exports = router;