const fs = require("fs");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let serviceAccount;

if (fs.existsSync("/etc/secrets/firebase-key.json")) {
  serviceAccount = require("/etc/secrets/firebase-key.json");
} else {
  serviceAccount = require("../firebase-key.json");
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

module.exports = db;