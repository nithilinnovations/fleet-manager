const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let app;

if (getApps().length === 0) {
  if (process.env.FIREBASE_PROJECT_ID) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    const serviceAccount = require("../firebase-key.json");

    app = initializeApp({
      credential: cert(serviceAccount),
    });
  }
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

module.exports = db;