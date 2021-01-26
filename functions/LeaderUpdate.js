const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// const databaseURL = "http://localhost:9000/?ns=palmolive-ext";

// const FIREBASE_SERVICE_ACCOUNT = functions.config()
//     .production.firebase_service_account;

// const FIREBASE_CONFIG = {
//   apiKey: "AIzaSyADWnmLrgXaR09wBKBCNHoKM02eFP6uIzQ",
//   authDomain: "palmolive-ext.firebaseapp.com",
//   databaseURL: databaseURL,
//   projectId: "palmolive-ext",
//   storageBucket: "palmolive-ext.appspot.com",
//   messagingSenderId: "312221805483",
//   appId: "1:312221805483:web:77a1c556ef2adeb21000ee",
//   measurementId: "G-RW7CK32F2L",
// };

// const certString =
// Buffer.from(FIREBASE_SERVICE_ACCOUNT, "base64").toString();
// const serviceAccount = JSON.parse(certString);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: FIREBASE_CONFIG.databaseURL,
// });

exports.leaderUpdate = functions.database
    .ref("").onWrite(async (change, context) => {
      console.log(change);
    },
    );
