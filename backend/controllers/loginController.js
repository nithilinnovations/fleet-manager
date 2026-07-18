const db = require("../config/firebase");

const login = async (req, res) => {
  try {
    const { password } = req.body;

    const doc = await db.collection("Login").doc("admin").get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Login data not found"
      });
    }

    const data = doc.data();

    if (password === data.password) {
      return res.json({
        success: true,
        message: "Login Successful"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Password"
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  login
};