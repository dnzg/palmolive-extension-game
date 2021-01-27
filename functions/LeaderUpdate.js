const functions = require("firebase-functions");
functions.config({
  databaseURL: "http://localhost:9000/?ns=palmolive-ext",
  projectId: "palmolive-ext",
});

exports.leaderUpdate = functions.database
    .ref("users/{userId}").onWrite(async (change, context) => {
      console.log("test");
    },
    );

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!!!");
},
);
