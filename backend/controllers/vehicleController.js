const db = require("../config/firebase");

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const vehicle = req.body;

   const { id, ...vehicleData } = vehicle;

await db.collection("vehicles").doc(id).set({
  ...vehicleData,
  createdAt: new Date()
});

res.status(201).json({
  success: true,
  id,
  message: "Vehicle Added Successfully"
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Vehicles
const getVehicles = async (req, res) => {
  try {
    const snapshot = await db.collection("vehicles").get();

    const vehicles = [];

    snapshot.forEach(doc => {
      vehicles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = req.body;

    await db.collection("vehicles").doc(id).update({
      ...vehicle,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: "Vehicle Updated Successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Get Single Vehicle
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("vehicles").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("vehicles").doc(id).delete();

    res.json({
      success: true,
      message: "Vehicle Deleted Successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  updateVehicle,
  getVehicleById,
  deleteVehicle
};

 
