const db = require("../config/firebase");

// Add Maintenance
const addMaintenance = async (req, res) => {
  try {

    const data = {
      ...req.body,
      createdAt: new Date()
    };

    const doc = await db.collection("maintenance").add(data);

    res.status(201).json({
      success: true,
      id: doc.id,
      message: "Maintenance record saved"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// Get All Maintenance
const getMaintenance = async (req, res) => {

  try {

    const snapshot = await db
      .collection("maintenance")
      .orderBy("createdAt", "desc")
      .get();

    const data = [];

    snapshot.forEach(doc => {
  data.push({
    ...doc.data(),
    id: doc.id
  });
});

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};
// Update Maintenance
const updateMaintenance = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Document ID:", id);
    console.log("Body:", req.body);

    const docRef = db.collection("maintenance").doc(id);

    await docRef.update({
      approvalStatus: "Completed"
    });

    res.json({
      success: true,
      message: "Maintenance updated"
    });

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  addMaintenance,
  getMaintenance,
  updateMaintenance
};