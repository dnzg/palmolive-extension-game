const helper = window.Twitch.ext;
const IS_DEV = window.location.hostname === "localhost";
const DB_URL = IS_DEV
  ? "http://localhost:9000/?ns=palmolive-ext"
  : "wss://palmolive-ext-default-rtdb.firebaseio.com";
const FUNCTIONS_API_URL = IS_DEV
  ? "http://localhost:5001/palmolive-ext/us-central1"
  : "https://us-central1-palmolive-ext.cloudfunctions.net";

const firebaseConfig = {
    apiKey: "AIzaSyADWnmLrgXaR09wBKBCNHoKM02eFP6uIzQ",
    authDomain: "palmolive-ext.firebaseapp.com",
    databaseURL: DB_URL,
    projectId: "palmolive-ext",
    storageBucket: "palmolive-ext.appspot.com",
    messagingSenderId: "312221805483",
    appId: "1:312221805483:web:77a1c556ef2adeb21000ee",
    measurementId: "G-RW7CK32F2L"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.database();
const auth = firebase.auth();
let twitchAuth = "";
let twitchMuted = "";
let isAuthed = false;
let twitchUsername = "";

const signIn = async (authToken) => {
  try {
    await auth.signInWithCustomToken(authToken);
    if (!auth.currentUser) {
      throw new Error();
    }
    isAuthed = true;
    console.log("SIGNED IN");
    twitch.onAuthorized();
  } catch (err) {
    isAuthed = false;
    console.error(err);
    console.log("SIGNIN FAILED");
    signOut();
  }
};
function logError(_, error, status) {
  helper.rig.log("EBS request returned " + status + " (" + error + ")");
}

helper.onAuthorized(async function (auth) {
  twitchAuth = auth;
  twitchUsername = auth.userId;
  console.log(auth);
  $.ajax({
    type: "POST",
    url: `${FUNCTIONS_API_URL}/authTwitch`,
    headers: {
      "x-extension-jwt": `Bearer ${auth.token}`,
      "userid": auth.userId.slice(1),
      "clientid": auth.clientId,
    },
    success: signIn,
    error: logError,
  });
});

helper.onContext(async function (context) {
  twitchMuted = context.isMuted;
});

var token = "";
var tuid = "";
let isUserInteracted = false;
let twitch = {
  onAuthorized,
};

$(function () {
  $("#cycle-img").click(async function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthed) return helper.rig.log("Not authorized");
    await db
      .ref(`users/${twitchAuth.userId}/clickCount`)
      .transaction(function (clickCount) {
        return clickCount + 1;
      });
  });
});

function onAuthorized() {
    db.ref("users/"+twitchUsername).on("value", (snapshot) => {
        console.log(snapshot.val());
        recordScore = snapshot.val();
        $('#scoreHead').text(recordScore);
    });
    
    db.ref("leaderboard").on("value", (snapshot) => {
        console.log(snapshot.val());
        var leaders = snapshot.val();
                var linesarr=[];
                if(leaders!==undefined && leaders!==null) {
                  for (let l = 0; l < leaders.length; l++) {
                      place=l+1;
                      if(place==1){
                          var line = '<div class="line">\
                          <div class="prize"><img src="assets/fprize.png"></div>\
                          <div class="playerName">'+leaders[l][0]+'</div>\
                          <div class="pointScore">'+leaders[l][1]+'</div></div>';
                      } else if (place==2){
                          var line = '<div class="line">\
                          <div class="prize"><img src="assets/sprize.png"></div>\
                          <div class="playerName">'+leaders[l][0]+'</div>\
                          <div class="pointScore">'+leaders[l][1]+'</div></div>';
                      } else if (place==3){
                          var line = '<div class="line">\
                          <div class="prize"><img src="assets/tprize.png"></div>\
                          <div class="playerName">'+leaders[l][0]+'</div>\
                          <div class="pointScore">'+leaders[l][1]+'</div></div>';
                      } else {
                          var line = '<div class="line">\
                          <div class="prize place">'+place+'.</div>\
                          <div class="playerName">'+leaders[l][0]+'</div>\
                          <div class="pointScore">'+leaders[l][1]+'</div></div>';
                      }
                      linesarr.push(line);
                  }
                  $('#leadersRow').html(linesarr.join(''));
                }
    });

    if(twitchUsername=='') {
      $('#startScreen').hide();
      $('#loginScreen').show();
  } else {
      $('#startScreen').show();
      $('#loginScreen').hide();
  }
}

function dbWrite(username, score) {
  if(username!==null && username!==undefined && username!== "")
    firebase.database().ref('users/'+username).set(parseInt(score));
}
