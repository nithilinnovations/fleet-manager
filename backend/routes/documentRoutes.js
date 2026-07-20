const express = require("express");

const router = express.Router();

const {
  saveDocument,
  getDocumentByVehicle,
  updateDocument
} = require("../controllers/documentController");
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Documents Route Working"
    });
});

router.post("/", saveDocument);

router.get("/:vehicleId", getDocumentByVehicle);

router.put("/:id", updateDocument);

module.exports = router;