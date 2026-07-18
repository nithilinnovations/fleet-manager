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
  getMaintenance,
  updateMaintenance
} = require("../controllers/maintenanceController");

router.post("/", addMaintenance);
router.get("/", getMaintenance);
router.put("/:id", updateMaintenance);
module.exports = router;