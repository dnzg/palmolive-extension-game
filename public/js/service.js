const helper = window.Twitch.ext;
const IS_DEV = window.location.hostname === "localhost";
const DB_URL = IS_DEV ?
    "http://localhost:9000/?ns=palmolive-ext" :
    "wss://palmolive-ext-default-rtdb.firebaseio.com";
const FUNCTIONS_API_URL = IS_DEV ?
    "http://localhost:5001/palmolive-ext/us-central1" :
    "https://us-central1-palmolive-ext.cloudfunctions.net";

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
const db = firebase.database();
const auth = firebase.auth();
// const analytics = firebase.analytics();
let twitchAuth = "";
let twitchMuted = "";
let isAuthed = false;
let twitchUsername = "";
let clientId;
var token = "";
var tuid = "";
let isUserInteracted = false;
let twitch = {
    onAuthorized,
};
let recordScore = 0;
let isMuted = true;

const signIn = async (authToken) => {
    try {
        await auth.signInWithCustomToken(authToken);
        if (!auth.currentUser) {
            throw new Error();
        }
        isAuthed = true;
        // console.log("SIGNED IN");
        $('#bodyGlobal').show();
        $('#loginScreen').hide();
        $('#startScreen').show();
        twitch.onAuthorized();
    } catch (err) {
        isAuthed = false;
        // console.error(err);
        $('#bodyGlobal').show();
        // console.log("SIGNIN FAILED");
        signOut();
    }
};

function logError(_, error, status) {
    helper.rig.log("EBS request returned " + status + " (" + error + ")");
}

helper.onAuthorized(async function(auth) {
    twitchUsername = parseJwt(auth.token).user_id;
    if (twitchUsername == undefined || twitchUsername == null || twitchUsername == '') {
        window.Twitch.ext.actions.requestIdShare((e) => {
            console.log(e);
        });
        return false;
    }
    twitchAuth = auth;
    clientId = auth.clientId;

    const username = await axios.get("https://api.twitch.tv/kraken/users/" + twitchUsername, {
        headers: {
            "Accept": "application/vnd.twitchtv.v5+json",
            "Client-ID": clientId,
        },
    }).then(function(response) {
        return response.data.name;
    }).catch(error => console.log(error));
    $('#playerName').text(username);

    $.ajax({
        type: "POST",
        url: `${FUNCTIONS_API_URL}/authTwitch`,
        headers: {
            "x-extension-jwt": `Bearer ${auth.token}`
        },
        success: signIn,
        error: logError,
    });
});

helper.onContext(function(context) {
    twitchMuted = context.isMuted;
});

function countDigits(n) {
    for (var i = 0; n > 1; i++) {
        n /= 10;
    }
    return i;
}

function turnNum(num) {
    var length = countDigits(num);
    if (length >= 4 && length < 7) {
        var newNum = num / 1000;
        return newNum.toFixed() + 'K';
    } else if (length >= 7) {
        var newNum = num / 1000000;
        return newNum.toFixed() + 'M';
    } else {
        return num;
    }
}

function onAuthorized() {
    db.ref("users/" + twitchUsername).on("value", (snapshot) => {
        recordScore1 = snapshot.val();
        if (recordScore1 !== undefined && recordScore1 !== null && recordScore1 !== '') {
            recordScore = recordScore1.score;
            $('#scoreHead').text(recordScore1.score);
        }
    });

    db.ref("leaderboard").on("value", (snapshot) => {
        var leaders = snapshot.val();
        var linesarr = [];
        if (leaders !== undefined && leaders !== null) {
            for (let l = 0; l < leaders.length; l++) {
                place = l + 1;
                var pointScore = turnNum(leaders[l][1]);
                if (place == 1) {
                    var line = '<div class="line">\
                          <div class="prize"><img src="assets/fprize.png"></div>\
                          <div class="playerName">' + leaders[l][0] + '</div>\
                          <div class="pointScore">' + pointScore + '</div></div>';
                } else if (place == 2) {
                    var line = '<div class="line">\
                          <div class="prize"><img src="assets/sprize.png"></div>\
                          <div class="playerName">' + leaders[l][0] + '</div>\
                          <div class="pointScore">' + pointScore + '</div></div>';
                } else if (place == 3) {
                    var line = '<div class="line">\
                          <div class="prize"><img src="assets/tprize.png"></div>\
                          <div class="playerName">' + leaders[l][0] + '</div>\
                          <div class="pointScore">' + pointScore + '</div></div>';
                } else {
                    var line = '<div class="line">\
                          <div class="prize place">' + place + '.</div>\
                          <div class="playerName">' + leaders[l][0] + '</div>\
                          <div class="pointScore">' + pointScore + '</div></div>';
                }
                linesarr.push(line);
            }
            $('#leadersRow').html(linesarr.join(''));
        }
    });
}

async function dbWrite(userid, score) {
    if (isAuthed) {
        const username = await axios.get("https://api.twitch.tv/kraken/users/" + userid, {
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": clientId,
            },
        }).then(function(response) {
            return response.data.name;
        }).catch(error => console.log(error));
        if (userid !== null && userid !== undefined && userid !== "") {
            if (parseInt(score) > parseInt(recordScore)) {
                await db.ref('users/' + userid + '/score').set(parseInt(score));
                await db.ref('users/' + userid + '/username').set(username);
            }
            await db.ref('users/' + userid + '/gamesCount')
                .transaction(function(gamesCount) {
                    return gamesCount + 1;
                });
            await db.ref('users/' + userid + '/scoreTotal')
                .transaction(function(scoreTotal) {
                    return scoreTotal + parseInt(score);
                });
        }
    }
}


function preload() {
    img1 = loadImage('assets/ship1f.png');
    img2 = loadImage('assets/ship2f.png');
    img3 = loadImage('assets/ship3f.png');
    img4 = loadImage('assets/ship4f.png');

    img1_a = loadImage('assets/ship1a.png');
    img2_a = loadImage('assets/ship2a.png');
    img3_a = loadImage('assets/ship3a.png');
    img4_a = loadImage('assets/ship4a.png');

    back = loadImage('assets/bg.jpg');
    blast_sound = 'blast';
    laser_sound = 'laser';
    freeze_sound = 'freez';
    boom_sound = 'boom';
    met1 = loadImage('assets/m1.png');
    met2 = loadImage('assets/m2.png');
    blastimg = loadImage('assets/blast.png');

    for (let i = 1; i < 8; i++) {
        bigboom.push(loadImage('assets/boom' + i + '.png'));
    }

    for (let i = 1; i < 2; i++) {
        ints.push(loadImage('assets/int' + i + '.png'));
    }

    laserimg = loadImage('assets/laser.png');
    laserVioletimg = loadImage('assets/laser_green.png');
    laserVioletExpimg = loadImage('assets/laser_green_exp.png');
    laserVioletCirimg = loadImage('assets/laser_green_circle.png');

    laserGreenExpimg = loadImage('assets/laser_violet_exp.png');
    laserGreenCirimg = loadImage('assets/laser_violet_circle.png');
    laserGreenimg = loadImage('assets/laser_violet.png');
    bonus1 = loadImage('assets/bonus1.png');
    bonus2 = loadImage('assets/bonus2.png');
    bonus3 = loadImage('assets/bonus3.png');
    bonus4 = loadImage('assets/bonus4.png');
    bulletImg = loadImage('assets/bullet.png');
    enemyImg1 = loadImage('assets/enemy1.png');
    enemyImg1b_b = loadImage('assets/m1b.png');
    enemyImg2b_b = loadImage('assets/m2b.png');

    enemyImg1i = loadImage('assets/m1i.png');
    enemyImg2i = loadImage('assets/m2i.png');

    myFont = loadFont('assets/mario.ttf');
    for (let i = 1; i < 7; i++) {
        explosionAnim.push(loadImage('assets/expl' + i + '.png'));
    }
}

function mousePressed() {
    if (!isMenu && !MOBILE_TYPE) gun();
}
$('#blast').on('click', function() {
    gun();
});
let lockGun = false;
$("#showGlobal").on('click', function() {
    hideBody(false)
});
$("#hide").on('click', function() {
    hideBody(true)
});
$("#backLeader").on('click', function() {
    leaderboard(false)
});
$("#newGameButton").on('click', function() {
    gameoverscreen();
    startWindow(true);
});
$("#leaderboardButton").on('click', function() {
    leaderboard(true);
    ga('send', 'event', 'leaderboard', 'visit', 'from-topMenu', { cookieFlags: "SameSite=None; Secure" });
});
$("#ismuted").on('click', function() {
    sound()
});

$("#bacButt").on('click', function() {
    detaction(0)
});
$("#chooButt").on('click', function() {
    detaction(1)
});
$("#startButton").on('click', function() {
    detaction(2)
});

$("#go1").on('click', function() {
    Reset(BulletNum)
});
$("#go2").on('click', function() {
    leaderboard(true);
    ga('send', 'event', 'leaderboard', 'visit', 'from-gameOver', { cookieFlags: "SameSite=None; Secure" });
});
$("#go3").on('click', function() {
    startWindow(true)
});


$('.cardship').on('click', function() {
    chooseShip(parseInt($(this).data('num')));
});

let W = $("#bodyGlobal").width();
let H = $("#bodyGlobal").height();

let MAX_ENEMY = 6;
const MAX_LIFE = 3;
const TimeoutBeforeGame = 3;
const frameRateDigit = 60;
let MOBILE_TYPE = false;
let BIRD_VEL;
let COOLDOWNGUN, ARCTIC_IMB = false, lockEnemies, enemies = [],
    bullets = [],
    bonus = [],
    explosions = [],
    explosionAnim = [],
    bulletImg, enemyImg1b, enemyImg1b_b, enemyImg2b_b, enemyImg2b, state = 0,
    img1, img2, img3, img4, back, flap, met1, met2, GunDamage, blastimg, laserimg, laserGreenimg, laserGreenExpimg, laserGreenCirimg, laserVioletExpimg, laserVioletCirimg, laserVioletimg, gameover, blast_sound, laser_sound, freeze_sound, boom_sound, BulletNum, bonusImg, bonus1, bonus2, bonus3, bonus4, redBlasts = 0,
    redBlastBlock = false,
    guntype, shakingScreen = false,
    bigboom = [],
    boom = [],
    bigboomGlobal = false,
    bi = 0,
    ints = [],
    scoreGlobal = 0,
    GRAVITY_N = 0.475,
    BLASTS_COUNT, birdAsset, GunDamageRed, redBlastImb = false,
    TIMEOUT_BLUE = 1000,
    TIMEOUT_FREEZE,
    SPORT_LASER_HEIGHT = 10,
    birdImg, birdActive, blastsound;
var pipe1, pipe2, pipe3, bird, button, isMenu = 1,
    score = 0,
    LastScore, x1 = 0,
    x2, scrollSpeed = 0.65;
let HEADER_LIMIT;
let url = window.location.search.slice(1).split('&');
let url_object = {};
for (let u = 0; u < url.length; u++) {
    url_object[url[u].split('=')[0]] = url[u].split('=')[1];
}
if (url_object.platform == 'mobile') {
    MOBILE_TYPE = true;
}
const timeoutBeforeHard = 30000;


if (MOBILE_TYPE) {
    $('#bodyGlobal').addClass('mobile_bodyGlobal');
    $('#upIco').attr('src', 'assets/updowntouch.gif');
    $('#shootIco').attr('src', 'assets/sword.gif');
    $('#blast').show();
    $('#hide').hide();
} else {
    $('#hide').show();
    $('#blast').hide();
    $('#shootIco').attr('src', 'assets/mouse.gif');
    $('#upIco').attr('src', 'assets/updownmouse.gif');
    $('#bodyGlobal').resizable({
        handles: "sw",
        minHeight: 0.55 * $(window).height(),
        minWidth: 0.40 * $(window).width(),
        resize: function(event, ui) {
            ui.position.left = 0;
        }
    });
}

$(window).on('load resize', function() {
    W = $("#bodyGlobal").width();
    H = $("#bodyGlobal").height();
    HEADER_LIMIT = H / 5;

    BIRD_VEL = parseInt((H / 70).toFixed());
    if (MOBILE_TYPE) {
        BIRD_VEL = parseInt((H / 60).toFixed());
        MAX_ENEMY = 4;
    };
});

let levelEnemy = 'easy';

function startWindow(state) {
    if (state) {
        $('#startScreen').show();
        $('header').hide();
        $('#scoreLeft').hide();
        $('#defaultCanvas0').hide();
        $('#blast').hide();
        $('#gameoverscreen').hide();
        $('#warningLine').hide();
    } else {
        setTimeout(() => {
            levelEnemy = 'hard';
        }, timeoutBeforeHard);
        if (MOBILE_TYPE) {
            $('#blast').show();
        } else {
            $('#blast').hide();
        }
        $('#startScreen').hide();
        $('#defaultCanvas0').show();
        $('header').css('display', 'flex');
        $('#scoreLeft').show();
        $('#gameoverscreen').hide();
        setTimeout(() => {
            $('#warningLine').hide();
        }, 8000);
    }
}

function gameoverscreen() {
    lockGun = false;
    levelEnemy = 'easy';
    $('#warningLine').hide();
    enemies.length = 0;
    bonus.length = 0;
    bullets.length = 0;
    if (BulletNum == 2) {
        redBlastBlock = false;
        redBlasts = 0;
    } else if (BulletNum == 1) {
        TEXT_ABOVE_BIRD = 3;
        clearInterval(changeTime);
        clearTimeout(changeTimeout);
    }
    
    
    playAudio('gameover');
    $('#blocker').show();
    setTimeout(() => {
        $('#blocker').hide();
    }, 1000);
    ResetGameover();
    enemies = [];
    $('#gameoverInside h3').text(s(score));
    dbWrite(twitchUsername, s(score));
    $('#gameoverscreen').show();
}

function timeoutscreen() {
    let i = TimeoutBeforeGame;
    $('#timeout span').text(i);
    $('#timeoutscreen').show();
    
    playAudio('timer2');
    i--;
    var refreshIntervalId = setInterval(() => {
        if (i > 0) {
            $('#timeout span').text(i);
            playAudio('timer2');
            
            i--;
        } else {
            clearInterval(refreshIntervalId);
        }
    }, 1000);

    setTimeout(() => {
        $('#timeoutscreen').hide();
        canvas = createCanvas(W, H);
        canvas.parent("bodyGlobal");
        bird = new Bird();
        frameRate(frameRateDigit);
        score = 0;
        if (isMenu == 1) {
            isMenu = 0;
        } else if (isMenu == 0) {
            isMenu = 1;
        }
        for (let i = 0; i < MAX_ENEMY; i++) {
            if (!lockEnemies)
                enemies[i] = new Enemy();
        }

        $('#warningLine').show();
        console.log('test');

        startWindow(false);
    }, TimeoutBeforeGame * 1000);
}


function leaderboard(state) {
    if (state) {
        $('#leaderboard').show();
    } else {
        $('#leaderboard').hide();
    }
}
function scoreHead(val) {
    if (parseInt($('#scoreHead').text()) < val) {
        $('#scoreHead').text(val);
    }
    $('#scoreLeft h2').text(val);
}


function s(score) {
    score = Math.floor(score / 22);
    return score;
}
