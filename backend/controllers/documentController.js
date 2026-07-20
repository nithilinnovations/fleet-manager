const db = require("../config/firebase");

// Save Document
const saveDocument = async (req, res) => {
  try {
    const data = req.body;

    const docRef = await db.collection("documents").add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Document Saved Successfully"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get by Vehicle ID
const getDocumentByVehicle = async (req, res) => {

  try {

    const { vehicleId } = req.params;

    const snapshot = await db
      .collection("documents")
      .where("vehicleId", "==", vehicleId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        data: null
      });
    }

    const doc = snapshot.docs[0];

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// Update Document
const updateDocument = async (req, res) => {

  try {

    const { id } = req.params;

    await db.collection("documents").doc(id).update({
      ...req.body,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: "Updated Successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = {
  saveDocument,
  getDocumentByVehicle,
  updateDocument
};