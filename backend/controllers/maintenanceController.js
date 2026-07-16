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
        id: doc.id,
        ...doc.data()
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

module.exports = {
  addMaintenance,
  getMaintenance
};