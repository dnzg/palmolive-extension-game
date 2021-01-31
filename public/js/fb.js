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
firebase.database();

function dbWrite(username, score) {
  firebase.database().ref('users/'+username).set(parseInt(score));
}

dbWrite(makeid(10,0), makeid(10,1));

function makeid(length, type) {
  if(type==1){
    var characters = "0123456789";
  } else {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }
	var result = "";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  if(type==1) {
    return parseInt(result);
  } else {
    return result;
  }
}
