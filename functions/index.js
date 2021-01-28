const functions = require("firebase-functions");
const admin = require("firebase-admin");

const SERVICE_CONFIG = functions.config().production.firebase_service_account;
const certString = Buffer.from(SERVICE_CONFIG, "base64").toString();
const serviceAccount = JSON.parse(certString);
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyADWnmLrgXaR09wBKBCNHoKM02eFP6uIzQ",
  authDomain: "palmolive-ext.firebaseapp.com",
  databaseURL: "https://palmolive-ext-default-rtdb.firebaseio.com",
  projectId: "palmolive-ext",
  storageBucket: "palmolive-ext.appspot.com",
  messagingSenderId: "312221805483",
  appId: "1:312221805483:web:77a1c556ef2adeb21000ee",
  measurementId: "G-RW7CK32F2L",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_CONFIG.databaseURL,
});

const db = admin.database();

exports.leaderUpdate = functions.database.ref("users/{userId}")
    .onWrite(async (change, context) => {
      console.log(change);
      console.log(context);
      const nickname = "dnzg";
      const ref = db.ref("leaderboard/"+nickname);

      ref.set(200);
    },
    );
