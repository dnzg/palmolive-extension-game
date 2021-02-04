let W = $("#bodyGlobal").width();
let H = $("#bodyGlobal").height();

let MAX_ENEMY = 6;
const MAX_LIFE = 3;
const TimeoutBeforeGame = 3;
let MOBILE_TYPE = false;
let BIRD_VEL;
let COOLDOWNGUN, QUAN_BLASTS, lockEnemies, enemies = [], bullets = [], bonus = [], explosions = [], explosionAnim = [], bulletImg, enemyImg1b, enemyImg2b, state = 0, img1, img2, img3, img4, back, flap, met1, met2, GunDamage, blastimg, laserimg, laserGreenimg, laserGreenExpimg, laserGreenCirimg, laserVioletExpimg, laserVioletCirimg, laserVioletimg, gameover, blast_sound, laser_sound, freeze_sound, boom_sound, GlobalBulletVar, bonusImg, bonus1, bonus2, bonus3, bonus4, redBlasts=0, redBlastBlock=false, guntype, shakingScreen=false, bigboom = [], boom = [], bigboomGlobal=false, bi = 0, ints = [], scoreGlobal = 0, GRAVITY_N=0.475, BLASTS_COUNT, birdAsset, GunDamageRed, redBlastImb=false, TIMEOUT_BLUE=1000, TIMEOUT_FREEZE=3000, nothingSounds=true, birdImg, birdActive, blastss;
var pipe1, pipe2, pipe3, bird, button, isMenu = 1, score = 0, LastScore, x1 = 0, x2, scrollSpeed = 0.65;
let HEADER_LIMIT;
let url = window.location.search.slice(1).split('&');
let url_object = {};
for (let u = 0; u < url.length; u++) {
    url_object[url[u].split('=')[0]] = url[u].split('=')[1];
}
if(url_object.platform=='mobile'){
    MOBILE_TYPE=true;
}

const callbackAudio = function(state) {
    if(state) {
        nothingSounds = true;
    } else {
        nothingSounds = false;
    }
}

if (MOBILE_TYPE) {
    $('#bodyGlobal').addClass('mobile_bodyGlobal');
    
    $('#upIco').attr('src','assets/tap.gif');
    $('#shootIco').attr('src','assets/sword.gif');
    $('#blast').show();
    $('#hide').hide();
} else {
    $('#hide').show();
    $('#blast').hide();
    $('#upIco').attr('src','assets/spacebar.gif');
    $('#shootIco').attr('src','assets/mouse.gif');
    $('#bodyGlobal').resizable({
        handles: "sw",
        minHeight: 0.55*$(window).height(),
        minWidth: 0.40*$(window).width(),
        resize: function( event, ui ) {
            ui.position.left = 0;
        }
    });
}

$(window).on('load resize', function() {
    W = $("#bodyGlobal").width();
    H = $("#bodyGlobal").height();
    // if($(window).width()<400){
    //     // $('#gameoverInside').height(0.95*H).width(0.95*W);
    //     $('header').height(W/6);
    // } else {
    //     $('header').height(W/20);
    //     // if(!MOBILE_TYPE) { $('#gameoverInside').height(0.89*H).width(W/2); }
    //     // else { $('#gameoverInside').height(0.95*H).width(0.95*W); }
    // }
    HEADER_LIMIT = H/4;

    BIRD_VEL = parseInt((H/70).toFixed());
    if(MOBILE_TYPE) {
        // BIRD_VEL=8; 
        BIRD_VEL = parseInt((H/60).toFixed());
        MAX_ENEMY=4;
        // HEADER_LIMIT=W/2;
    };

    // console.log(HEADER_LIMIT);
});

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
        bigboom.push(loadImage('assets/boom'+i+'.png'));
    }

    for (let i = 1; i < 2; i++) {
        ints.push(loadImage('assets/int'+i+'.png'));
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
	enemyImg1b = loadImage('assets/m1b.png');
    enemyImg2b = loadImage('assets/m2b.png');
    
	enemyImg1i = loadImage('assets/m1i.png');
    enemyImg2i = loadImage('assets/m2i.png');
    
	myFont = loadFont('assets/mario.ttf');
	for (let i = 1; i<7; i++) {
        explosionAnim.push(loadImage('assets/expl'+i+'.png'));
	}
}

function startWindow(state) {
    if(state) {
        $('#startScreen').show();
        $('header').hide();
        $('#scoreLeft').hide();
        $('#defaultCanvas0').hide();
        $('#blast').hide();
        $('#gameoverscreen').hide();
    } else {
        if(MOBILE_TYPE){$('#blast').show();}
        $('#startScreen').hide();
        $('#defaultCanvas0').show();
        $('header').css('display', 'flex');
        $('#scoreLeft').show();
        $('#gameoverscreen').hide();
    }
}

function gameoverscreen() {
    enemies.length=0;
    bonus.length=0;
    bullets.length=0;
    if(guntype==3) {
        redBlastBlock=false;
        redBlasts=0;
    }

    if(!isMuted && nothingSounds) {
        playAudio('gameover');
    }
    $('#blocker').show();
    setTimeout(() => {
        $('#blocker').hide();
    }, 1000);
    ResetGameover();
    enemies = [];
    $('#gameoverInside h3').text(s(score));
    ratingWrite(s(score));
    $('#gameoverscreen').show();
}

function timeoutscreen() {
    let i = TimeoutBeforeGame;
    $('#timeout span').text(i);
    $('#timeoutscreen').show();
    
    if(!isMuted && nothingSounds) {
        playAudio('timer2');
    }
    i--;
    var refreshIntervalId = setInterval(() => {
        if (i > 0) {
            $('#timeout span').text(i);
            if(!isMuted && nothingSounds) {
                playAudio('timer2');
            }
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
        frameRate(60);
        score = 0;
        if (isMenu == 1) {
            isMenu = 0;
        } else if (isMenu == 0) {
            isMenu = 1;
        }
        for (let i=0; i<MAX_ENEMY; i++) {
            if(!lockEnemies)
                enemies[i] = new Enemy();
        }

        startWindow(false);
    }, TimeoutBeforeGame*1000);
}


function leaderboard(state) {
    if(state) {
        $('#leaderboard').show();
        firebase.analytics().logEvent('leaderboard_visit');
    }
    else { $('#leaderboard').hide(); }
}

function Reset(num) {
    GlobalBulletVar = num;
    if (num==0) { //orange ship
        birdImg = img1;
        birdActive = img1_a;

        blastss=boom_sound;
        BLASTS_COUNT=3;
        bonusImg=bonus1;
        guntype = 0;
    } else if(num==1) { //arctic
        birdImg = img2;
        birdActive = img2_a;

        blastss=freeze_sound;
        BLASTS_COUNT=3;
        bonusImg=bonus2;
        guntype = 1;
    } else if(num==2) { //red
        birdImg = img3;
        birdActive = img3_a;

        blastss=laser_sound;
        BLASTS_COUNT=10;
        bonusImg=bonus3;
        guntype = 3;
        GunDamageRed = 1;
    } else if(num==3) { //sport
        birdImg = img4;
        birdActive = img4_a;

        blastss=blast_sound;
        BLASTS_COUNT=1;
        bonusImg=bonus4;
        
        guntype = 4;
    }
    birdAsset = birdImg;
    timeoutscreen();
}
function boomMove() {
    for (let b = 0; b < boom.length; b++) {
        boom[b].move();
        boom[b].show();
    }
}
function GlobalBullet(x, y) {
    if(GlobalBulletVar==0) {
        var bul = new Bullet(x, y);
        QUAN_BLASTS=1;
        enemyImg1b = enemyImg1b;
        enemyImg2b = enemyImg2b;
        COOLDOWNGUN=15;
        GunDamage=2;
        var d = 0;
        bigboomGlobal=true;

        BLASTS_COUNT -= 1;

        var b = 0;
        var boominterval = setInterval(() => {
            if(b == 7) { boom.length=0; clearInterval(boominterval); }
            else {
                bullets.length=0;
                boom.length=0;
                boom.push(new Paraboom(b, b*W/5));
            }
            b++;
        }, 450);

        bi = 0;
        var destroyEverything = setInterval(() => {
            shakingScreen=true;
            for (let o = 0; o < enemies.length; o++) {
                explosions.push(createVector(enemies[o].x,enemies[o].y, frameCount));   
                enemies[o].reborn();
                if(!isMuted && nothingSounds) {
                    playAudio(blastss);
                }
            }
            d++;
            if(d == 3) {
                lockEnemies=true;
                clearInterval(destroyEverything)
            };
        }, 1000);
        setTimeout(() => {
            bigboomGlobal=false;
            shakingScreen=false;
            lockEnemies=false;
        }, 3500);

    } else if(GlobalBulletVar==1) {
        var bul = new Bullet3(x, y);
        COOLDOWNGUN=4;
        GunDamage=1;
        QUAN_BLASTS=1;
        enemyImg1b = enemyImg1i;
        enemyImg2b = enemyImg2i;
    } else if(GlobalBulletVar==2) {
        if(redBlasts===10 && !redBlastImb) {
            redBlastBlock=true;
            redBlasts=0;
        } 
        var bul = new Bullet2(x, y);
        QUAN_BLASTS=1;
        enemyImg1b = enemyImg1b;
        enemyImg2b = enemyImg2b;
        COOLDOWNGUN=0.25;
        GunDamage=GunDamageRed;
        redBlasts++;
    } else if(GlobalBulletVar==3) {
        BLASTS_COUNT -= 1;
        var bul = new Bullet1(x, y);
        QUAN_BLASTS=1;
        enemyImg1b = enemyImg1b;
        enemyImg2b = enemyImg2b;
        COOLDOWNGUN=3;
        GunDamage=2;
    }
    return bul;
}

function ResetGameover() {
    if (isMenu == 1) {
        isMenu = 0;
    } else if (isMenu == 0) {
        isMenu = 1;
    }
}

function scoreHead(val) {
    if(parseInt($('#scoreHead').text()) < val) {
        $('#scoreHead').text(val);
    }
    $('#scoreLeft h2').text(val);
}

function setup() {
    startWindow(true);

    x2 = 10*H;
    bird = new Bird();
}
function draw() {
    if (!isMenu) {
        if(shakingScreen) translate(random(-5,5),random(-5,5));

        LastScore = score;
        background('#000');
        image(back, x1, 0, 10*H, H);
        image(back, x2, 0, 10*H, H);
        x1 -= scrollSpeed;
        x2 -= scrollSpeed;
        bird.show();
        bird.update();
      
        edges(bird.pos.y, canvas.height);
        Score(bird.pos.x, bird.pos.y);
        if (score % 1 == 0) {
            textSize(32);
            scoreHead(s(LastScore));
        }
        if (x1 < -10*H){
            x1 = 10*H;
        }
        if (x2 < -10*H){
            x2 = 10*H;
        }
        
		for (enemy of enemies) {
			enemy.move();
			enemy.show();
        }

		for (let i = 0; i < explosions.length; i++) {
			if (explosions[i].z + 6 > frameCount) {
				explosion(explosions[i].x, explosions[i].y, explosions[i].z);
			} else {
				explosions.splice(i,1);
			}
			
		}
        // Enemy out of screen
		for (let i = 0; i < enemies.length; i++) {
			if (intersectWithBird(bird, enemies[i])) {
                gameoverscreen();
            }
            if(enemies[i]!==undefined) {
                if (enemies[i].x < 0) {
                    enemies[i].reborn();
                }
            }
        }

		// Bonus
		if (random(1,300) <= 2 && bonus.length < 1) {
			bonus.push(new Bonus);
		}
		for (i = 0; i < bonus.length; i++) {
			bonus[i].move();
			bonus[i].show();
			if (intersectWithBirdAndBonus(bird, bonus[i])) {
                bonus[i].effect(bird);
				bonus.splice(i, 1);
            }
            if(bonus[i]!==undefined){
                if (bonus[i].x < 0) {
                    bonus.splice(i, 1);
                }
            }
		}

		// Bullet's move
        bulletMove();	

        boomMove();
        // console.log(isMuted);
    }
}

function mousePressed() {
    if(!isMenu && !MOBILE_TYPE) gun();
}

function countTouches(event) {
    birdmove();
}
function birdmove() {
    if(bird.pos.y > HEADER_LIMIT) {
        bird.vel.y = -1*BIRD_VEL;
    } else {
        bird.vel.y = +1*BIRD_VEL/2;
    }
}
function keyPressed() {
    if (key === ' ') {
        birdmove();
    }
}

$('#blast').on('click', function(){
    gun();
});

function edges(y1, y2) {
    if (y1 > y2) {
        gameoverscreen();
    }
}

function Score(x1, x2) {
    score++;
    LastScore = score;
}

function s(score) {
    score = Math.floor(score / 22);
    return score;
}

let lockGun = false;

function gun() {
    if(!lockGun) {
        if(guntype == 3 && redBlastBlock) {
            setTimeout(() => {
                redBlastBlock=false;
            }, 5000);
        } else {
            if(BLASTS_COUNT>0 && guntype==1 || guntype !==1) {
                if(guntype!==3 && guntype!==4) birdAsset = birdActive;
                if(guntype==1) {
                    var i = BLASTS_COUNT;
                    var freezint = setInterval(() => {
                        if(i==0) clearInterval(freezint);
                        BLASTS_COUNT = i;
                        i--;
                    }, 1000);

                    setTimeout(() => {
                        BLASTS_COUNT=3;
                    }, 7000);
                }
                var i = 0;
                var inte = setInterval(() => {
                    bullets.push(GlobalBullet(bird.pos.x, bird.pos.y));
                    if(i == QUAN_BLASTS-1) clearInterval(inte);
                    i++;
                }, 100);
                inte;
                lockGun = true;
                setTimeout(() => {
                    lockGun = false;
                    if(guntype!==3 && guntype!==4) birdAsset = birdImg;
                }, COOLDOWNGUN*1000);
                
                if(!isMuted && nothingSounds && guntype !== 1) {
                    playAudio(blastss);
                } else if(!isMuted && nothingSounds && guntype == 1) {
                    playAudio(blastss);
                };
            }
        }
    }
}

function bulletMove() {
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].move();
		bullets[i].show();
		for (let j = 0; j < enemies.length; j++) {
			if (intersectWith(bullets[i], enemies[j])) {
                if(guntype==1){
                //    enemies[j].type = 1;
                } else if(guntype==4) {

                } else {
                    bullets[i].y = - 10;
                }
                for (let o = 0; o < GunDamage; o++) {
                    if (enemies[j].life == 0) {
                        explosions.push(createVector(enemies[j].x,enemies[j].y, frameCount));
                        enemies[j].reborn();
                    }
                    if(guntype==1 && enemies[j].type==1) {
                        // if(!isMuted) {
                        //     playAudio(blastss);
                        // }
                        enemies[j].image = enemyImg1i;
                        enemies[j].image.width = H/7;
                        enemies[j].image.height = H/7;
                        setTimeout(() => {
                            if(enemies[j]!==undefined){
                                enemies[j].life -=2;
                                explosions.push(createVector(enemies[j].x,enemies[j].y, frameCount));
                                enemies[j].reborn();
                            }
                        }, 400);
                    } else if(guntype==1 && enemies[j].type==2) {
                        // if(!isMuted && nothingSounds) {
                        //     playAudio(blastss);
                        // }
                        enemies[j].image = enemyImg2i;
                        enemies[j].image.width = H/7;
                        enemies[j].image.height = H/7;
                        setTimeout(() => {
                            if(enemies[j]!==undefined) {
                                enemies[j].life -=2;
                                explosions.push(createVector(enemies[j].x,enemies[j].y, frameCount));
                                enemies[j].reborn();
                            }
                        }, 400);
                    } else {
                        enemies[j].life -=1;
                        enemies[j].image = enemyImg2i;
                    }
                }
			}
		}
	}
	// Remove bullet when it's out of screen
	for (i = 0; i < bullets.length; i++) {
		if (bullets[i].x > W || bullets[i].y < 0 || bullets[i].y > H) {
			bullets.splice(i, 1);
		}
	}
}
function intersectWith(object1, object2) {
    if(object1.state === 3 || object1.state === 1) {
        object1.x1 = object1.x,
        object1.x2 = object1.width + object1.x,
        object1.y1 = object1.y,
        object1.y2 = object1.height + object1.y,
        object2.x1 = object2.x,
        object2.x2 = object2.image.width + object2.x,
        object2.y1 = object2.y,
        object2.y2 = object2.image.height + object2.y

        if(object1.x1 < object2.x2
            && object1.x2 > object2.x1
            && object1.y1 < object2.y2
            && object1.y2 > object2.y1) return true;
        else return false;
        
    } else {
        let distance = dist(object1.x, object1.y, object2.x, object2.y);
        if (distance < object1.radius + object2.radius) return true;
        else return false;
    }
}
function intersectWithBirdAndBonus(object1, object2) {
	let distance = dist(object1.pos.x, object1.pos.y, object2.x, object2.y);
	if (distance < object1.radius + object2.radius) {
		return true;
	} else {
		return false;
	}
}
function intersectWithBird(object1, object2) {
	let distance = dist(object1.pos.x, object1.pos.y, object2.x, object2.y);
	if (distance < object1.radius + object2.radius - 20) {
		return true;
	} else {
		return false;
	}
}

function explosion(x,y, startFrame) {
    image(explosionAnim[(frameCount - startFrame) % 6], x, y, H/12, H/12);
}
class Bullet {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 3;
		this.radius = 0;
	}

	show() {
		image(blastimg, this.x-3, this.y-3, H/15, H/15);
	}
	move() {
        this.x += this.speed;
        this.y += this.speed/10;
	}
}

class Bullet1 {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 1;
		this.radius = 50;
        this.width = 32+W/2;
        this.height = 40;
        this.state = 1;
	}

	show() {
        image(laserGreenimg, this.x+42, this.y+3, W/2, 10);
        image(laserGreenCirimg, this.x+36, this.y, 20, 20);
        image(laserGreenExpimg, this.x+10+W/2, this.y-10, 40, 40);

        if(TIMEOUT_BLUE===2000) {
            for (let o = 0; o < 3; o++) {
                explosions.push(createVector(enemies[o].x,enemies[o].y, frameCount));   
                enemies[o].reborn();
                if(!isMuted && nothingSounds) {
                    playAudio(blastss);
                }
            }

            setTimeout(() => {
                bullets.length=0;
                TIMEOUT_BLUE=1000;
            }, TIMEOUT_BLUE);
        } else {
            setTimeout(() => {
                bullets.length=0;
            }, TIMEOUT_BLUE);
        }
	}
	move() {
        this.y = bird.pos.y-10;
        // this.x += this.speed/10;
	}
}

class Bullet2 {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 12;
        this.radius = 0;
	}

	show() {
		image(laserimg, this.x-3, this.y-3);
	}
	move() {
        this.x += this.speed;
	}
}
class Bullet3 {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 1;
        this.radius = 50;
        this.widthh = 31;
        this.width = 32+W/2;
        this.height = 40;
        this.state = 3;
	}

	show() {
        for (let n = 0; n < 8; n++) {
            image(laserVioletimg, this.x+this.x+24+this.widthh*n, this.y-3, this.widthh, 25);
        }

        image(laserVioletCirimg, this.x+36, this.y-15, 2.25*50, 50);
        image(laserVioletExpimg, this.x+this.x+24+this.widthh*8, this.y, 1.26*25, 25);

        if(TIMEOUT_FREEZE===6000) {
            setTimeout(() => {
                bullets.length=0;
                TIMEOUT_FREEZE=3000;
            }, TIMEOUT_FREEZE);
        } else {
            setTimeout(() => {
                bullets.length=0;
            }, TIMEOUT_FREEZE);
        }
	}
	move() {
        this.y = bird.pos.y-10;
        this.widthh += this.speed/10;
	}
}

let EnemiesArray = {
    A: '',
    B: '',
    C: ''
};
function enemyspeed() {
    if(MOBILE_TYPE){
        return random(2.5,3.5);
    } else {
        return random(4,7);
    }
}
class Enemy{
	constructor() {
		this.reborn();
	}

	reborn() {
		this.y = random(HEADER_LIMIT+12, H);
        this.x = random(W+400, W);
        		
		let enemyLottery = random(1,4);
        this.image = {};
		if (enemyLottery >= 1 && enemyLottery < 2 ) {
			this.type = 1;
            // this.speed = random(1,BIRD_VEL);
            this.speed=enemyspeed();
            this.image = met1;
            this.image.width = H/8;
            this.image.height = H/8;
			this.life = 2;
			// this.point = 2;
			this.radius = H/14;
			// this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} else if (enemyLottery >= 2 && enemyLottery < 4 ) {
			this.type = 2;
            // this.speed = random(BIRD_VEL/2,BIRD_VEL/1.5);
            this.speed=enemyspeed();
            this.image = met2;
            this.image.width = H/7;
            this.image.height = H/7;
			this.life = 1;
			// this.point = 2;
			this.radius = H/12;
			// this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} 
	}

	move() {
		if (this.type == 1 && this.life == 1) {
			this.image = enemyImg1b;
            this.image.width = H/8;
            this.image.height = H/8;
			this.x -=this.speed;
		} else if (this.life == 0) {
            explosions.push(createVector(this.x,this.y, frameCount));   
            this.reborn();
        } else {
			this.x -=this.speed;
		}
	}

	show() {
        image(this.image, this.x-15, this.y-15);
	}
}


class Bonus {
	constructor(type = 0) { //random ensuite
		this.x = random(W+400, W);
		this.y = random(HEADER_LIMIT, H-32);
		this.speed = enemyspeed();
		this.type = type;
		this.radius = H/7;
	}

	move(){
		this.x -= this.speed;
	}

	show() {
		image(bonusImg, this.x - this.radius, this.y - this.radius, 0.436*H/7, H/7);
	}

	effect(player) {
        // player.life +=1;
        // scoreGlobal += 1;
        if(guntype==0 && BLASTS_COUNT < 5) {
            BLASTS_COUNT += 1;
        } else if(guntype==1) {
            TIMEOUT_FREEZE = 6000;
            BLASTS_COUNT = 6;
        } else if(guntype==3) {
            GunDamageRed=2;
            birdAsset = birdActive;
            redBlastImb=true;
            setTimeout(() => {
                birdAsset = birdImg;
                GunDamageRed=1;
                redBlastBlock=false;
                redBlastImb=false;
            }, 5000);
            //more power to blast
        } else if(guntype==4) {
            TIMEOUT_BLUE = 2000;
            birdAsset = birdActive;
            
            setTimeout(() => {
                birdAsset = birdImg;
            }, TIMEOUT_BLUE);
        } 
    }
}

class Paraboom {
    constructor(i, s) {
        this.x = bird.pos.x+W/3;
        this.y = (bird.pos.y)-(s/2);
        this.speed = 2;
        this.count = i;
        this.img = bigboom[this.count];
        this.size = s;
    }

    move() {
        this.x -= this.speed;
    }

    show() {
        image(this.img, this.x, this.y, this.size, this.size);
    }
}

class Bird {
    constructor() {
        this.pos = createVector(W / 10, H / 2);
        this.vel = createVector(0, 5); //5
        this.gravity = createVector(0, GRAVITY_N); //0.5
        this.r = H/10;
        this.speed = 10;
        this.radius = 22;

        this.x = this.pos.x;
        this.y = this.pos.y;
        
        this.life=1;
		
    }
    show() {
        if(guntype===0 || guntype===1) {
            fill(109, 255, 85, 75);
            textFont(myFont);
            textSize(12);
            textAlign(CENTER, CENTER);
            text(BLASTS_COUNT, this.pos.x-8, this.pos.y - 58, 34, 34);
        }

        image(birdAsset, this.pos.x - 20, this.pos.y - 26, this.r + 10, this.r + 10);
    }
    update() {
        this.vel.add(this.gravity);
        this.pos.add(this.vel);
        this.show();
        this.move();
    }
    
    move() {
        this.x -= this.speed;
    }

}
$("#showGlobal").on('click', function() { hideBody(false) });
$("#hide").on('click', function() { hideBody(true) });
$("#backLeader").on('click', function() { leaderboard(false) });
$("#newGameButton").on('click', function() { Reset(GlobalBulletVar) });
$("#leaderboardButton").on('click', function() { leaderboard(true) });
$("#ismuted").on('click', function() { sound() });

$("#bacButt").on('click', function() { detaction(0) });
$("#chooButt").on('click', function() { detaction(1) });
$("#startButton").on('click', function() { detaction(2) });

$("#go1").on('click', function() { Reset(GlobalBulletVar) });
$("#go2").on('click', function() { leaderboard(true) });
$("#go3").on('click', function() { startWindow(true) });


$('.cardship').on('click', function() {
    chooseShip(parseInt($(this).data('num')));
});

$('body').bind('touchstart', function(event) {
    countTouches(event);
}).bind('touchend', function(event) {
    countTouches(event);
});

