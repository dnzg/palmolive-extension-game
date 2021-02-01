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
const ref = "users/{userId}";
exports.leaderUpdate = functions.database.ref(ref)
    .onWrite(async (change, context) => {
      const users = (await db.ref("users").once("value")).val();
      const rating = Object.keys(users).map((key) => [key, users[key]]);
      rating.sort(function(a, b) {
        if (a[1] > b[1]) {
          return -1;
        }
        if (a[1] < b[1]) {
          return 1;
        }
        return 0;
      });
      const rate = rating.slice(0, 10);
      db.ref("leaderboard").set(rate);
    },
    );
