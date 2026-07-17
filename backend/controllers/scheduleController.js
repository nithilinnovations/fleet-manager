const db = require("../config/firebase");

// Save Schedule
const addSchedule = async (req, res) => {

    try {

        const docId = `${req.body.vehicleId}_${req.body.category}`;

        await db
            .collection("schedule")
            .doc(docId)
            .set(
                {
                    ...req.body,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                { merge: true }
            );

        res.json({
            success: true,
            message: "Schedule saved successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// Get All Schedule
const getSchedule = async (req, res) => {

  try {

    const snapshot = await db
  .collection("schedule")
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
  addSchedule,
  getSchedule
};