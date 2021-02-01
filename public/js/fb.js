const IS_DEV = window.location.hostname === "localhost";
const databaseURL = IS_DEV
  ? "http://localhost:9000/?ns=palmolive-ext"
  : "https://palmolive-ext-default-rtdb.firebaseio.com";

const firebaseConfig = {
    apiKey: "AIzaSyADWnmLrgXaR09wBKBCNHoKM02eFP6uIzQ",
    authDomain: "palmolive-ext.firebaseapp.com",
    databaseURL: databaseURL,
    projectId: "palmolive-ext",
    storageBucket: "palmolive-ext.appspot.com",
    messagingSenderId: "312221805483",
    appId: "1:312221805483:web:77a1c556ef2adeb21000ee",
    measurementId: "G-RW7CK32F2L"
  };
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.database();

function dbWrite(username, score) {
  firebase.database().ref('users/'+username).set(parseInt(score));
}
