const functions = require("firebase-functions");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const corsHeader = cors({ origin: true });

const TWITCH_EXTENSION_SECRET = Buffer.from(
  functions.config().production.twitch_extension_secret,
  "base64"
);

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
const auth = admin.auth();

exports.authTwitch = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return corsHeader(req, res, () => {
        res.status(200);
      });
    }
    if (req.method !== "POST") throw new Error("wrong method");
    if (!TWITCH_EXTENSION_SECRET) {
      throw new Error("Twitch extension secret not provided");
    }

    const extAuthHeader = req.headers["x-extension-jwt"];

    if (!extAuthHeader) throw new Error("Authentication token not presented");

    const [authType, accessToken] = extAuthHeader.split(" ");
    if (authType.toLowerCase() !== "bearer") {
      throw new Error("Wrong authentication type");
    }

    const payload = jwt.verify(accessToken, TWITCH_EXTENSION_SECRET);
    if (!payload) throw new Error("Failed to verify accessToken");
    if (!payload.user_id) {
      throw new Error("user_id in auth tokenz must be defined");
    }

    const customAuthToken = await auth.createCustomToken(payload.user_id);
    if (!customAuthToken) {
      throw new Error("Failed to generate firebase custom auth token");
    }

    corsHeader(req, res, () => {
      res.status(200).json(customAuthToken);
    });
  } catch (err) {
    console.error(err);
    corsHeader(req, res, () => {
      res.status(400).json({ error: err.message });
    });
  }
});

const ref = "users/{userId}/score";
exports.leaderUpdate = functions.database
  .ref(ref)
  .onWrite(async (change, context) => {
    // eslint-disable-next-line max-len
    const newVal = change.after.val();

    const lastPlace = (await db.ref("leaderboard").once("value")).val();
    if (lastPlace == undefined) {
      const users = (await db.ref("users").once("value")).val();

      const rating = Object.keys(users).map((key) => [
        users[key].username,
        users[key].score,
      ]);
      rating.sort(function (a, b) {
        if (a[1] > b[1]) {
          return -1;
        }
        if (a[1] < b[1]) {
          return 1;
        }
        return 0;
      });
      const rate = rating.slice(0, 10);
      await db.ref("leaderboard").set(rate);
      return false;
    }

    let newPlace;
    for (let i = 9; i >= 0; i--) {
      if (newVal < lastPlace[i][1]) {
        return false;
      } else if (newVal >= lastPlace[i][1]) {
        if ((i > 0 && newVal < lastPlace[i - 1][1]) || i == 0) {
          // eslint-disable-next-line max-len
          const uname = (
            await db
              .ref("users/" + context.params.userId + "/username")
              .once("value")
          ).val();

          newPlace = i;
          lastPlace.splice(9, 1);
          for (let g = 8; g >= newPlace; g--) {
            lastPlace[g + 1] = lastPlace[g];
          }
          lastPlace[newPlace] = [uname, newVal];

          const names = [];
          const result = [];
          for (let u = 0; u < lastPlace.length; u++) {
            names.push(lastPlace[u][0]);
          }

          for (const str of names) {
            if (!result.includes(str)) {
              result.push(str);
            }
          }

          if (result.length == names.length) {
            await db.ref("leaderboard").set(lastPlace);
          } else {
            const users = (await db.ref("users").once("value")).val();
            const rating = Object.keys(users).map((key) => [
              users[key].username,
              users[key].score,
            ]);
            rating.sort(function (a, b) {
              if (a[1] > b[1]) {
                return -1;
              }
              if (a[1] < b[1]) {
                return 1;
              }
              return 0;
            });
            const rate = rating.slice(0, 10);
            await db.ref("leaderboard").set(rate);
          }
          return false;
        }
      }
    }
  });
