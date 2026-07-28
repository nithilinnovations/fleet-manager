const db = require("../config/firebase");

// Add Fuel Entry
const addFuel = async (req, res) => {
  try {
    const fuelData = {
      ...req.body,
      createdAt: new Date(),
    };

    const docRef = await db.collection("fuel").add(fuelData);

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Fuel entry added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Fuel History
const getFuelHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const snapshot = await db
      .collection("fuel")
      .where("vehicleId", "==", vehicleId)
      .get();

    const data = [];

    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Fuel Entry
const deleteFuel = async (req, res) => {
  try {

    const { id } = req.params;

    await db.collection("fuel").doc(id).delete();

    res.json({
      success: true,
      message: "Fuel entry deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addFuel,
  getFuelHistory,
  deleteFuel,
};