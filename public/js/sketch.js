let W = $("#bodyGlobal").width();
let H = $("#bodyGlobal").height();

let MAX_ENEMY = 5;
const MAX_LIFE = 3;
const TimeoutBeforeGame = 1;
let MOBILE_TYPE = false;
let BIRD_VEL = parseInt((H/70).toFixed());
// let BIRD_VEL = (H/70).toFixed();
$('#bodyGlobal').dblclick(function() {
    // console.log('DOUBLE_CLICKED');
  });
let COOLDOWNGUN, QUAN_BLASTS, lockEnemies, enemies = [], bullets = [], bonus = [], explosions = [], explosionAnim = [], bulletImg, enemyImg1b, enemyImg2b, state = 0, img1, img2, img3, img4, back, flap, met1, met2, GunDamage, blastimg, laserimg, laserGreenimg, laserGreenExpimg, laserGreenCirimg, laserVioletExpimg, laserVioletCirimg, laserVioletimg, gameover, blast_sound, laser_sound, freeze_sound, boom_sound, GlobalBulletVar, bonusImg, bonus1, bonus2, bonus3, bonus4, redBlasts=0, redBlastBlock=false, guntype;
var pipe1, pipe2, pipe3, bird, button, isMenu = 1, score = 0, LastScore, x1 = 0, x2, scrollSpeed = 0.65;

let url = window.location.search.slice(1).split('&');
let url_object = {};
for (let u = 0; u < url.length; u++) {
    url_object[url[u].split('=')[0]] = url[u].split('=')[1];
}
// console.log(url_object.platform);
if(url_object.platform=='mobile'){
    MOBILE_TYPE=true;
}
let HEADER_LIMIT=W/6;
if (MOBILE_TYPE) {
    // $('#bodyGlobal').resizable('disable');
    $('#bodyGlobal').addClass('mobile_bodyGlobal');
    
    $('#upIco').attr('src','assets/tap.gif');
    $('#shootIco').attr('src','assets/sword.gif');
    $('#blast').show();
} else {
    
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
    if($(window).width()<400){
        $('#gameoverInside').height(0.95*H).width(0.95*W);
        $('header').height(W/6);
    } else {
        $('header').height(W/20);
        $('#gameoverInside').height(0.89*W).width(W/2);
    }

    BIRD_VEL = parseInt((H/70).toFixed());
    if(MOBILE_TYPE) {BIRD_VEL=8; MAX_ENEMY=4;HEADER_LIMIT=W/2;};
    // console.log(H,W, BIRD_VEL);
    // setup();
});

function preload() {
    img1 = loadImage('assets/ship1f.png');
    img2 = loadImage('assets/ship2f.png');
    img3 = loadImage('assets/ship3f.png');
    img4 = loadImage('assets/ship4f.png');
    back = loadImage('assets/bg.jpg');
    flap = loadSound('sounds/flap.mp3');
    gameover = loadSound('sounds/gameover.mp3');
    blast_sound = createAudio('sounds/blast.mp3');
    laser_sound = createAudio('sounds/laser.mp3');
    freeze_sound = createAudio('sounds/freeze.mp3');
    boom_sound = createAudio('sounds/boom.mp3');
    timeoutsound = loadSound('sounds/timer2.mp3');
    met1 = loadImage('assets/m1.png');
    met2 = loadImage('assets/m2.png');
    blastimg = loadImage('assets/blast.png');
    laserimg = loadImage('assets/laser.png');
    laserGreenimg = loadImage('assets/laser_green.png');
    laserGreenExpimg = loadImage('assets/laser_green_exp.png');
    laserGreenCirimg = loadImage('assets/laser_green_circle.png');
    laserVioletExpimg = loadImage('assets/laser_violet_exp.png');
    laserVioletCirimg = loadImage('assets/laser_violet_circle.png');
    laserVioletimg = loadImage('assets/laser_violet.png');
    bonus1 = loadImage('assets/bonus1.png');
    bonus2 = loadImage('assets/bonus2.png');
    bonus3 = loadImage('assets/bonus3.png');
    bonus4 = loadImage('assets/bonus4.png');
	bulletImg = loadImage('assets/bullet.png');
	enemyImg1 = loadImage('assets/enemy1.png');
	enemyImg1b = loadImage('assets/m1b.png');
	enemyImg2b = loadImage('assets/m2b.png');
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

    if(!isMuted) gameover.play();
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
    
    if(!isMuted) timeoutsound.play();
    i--;
    var refreshIntervalId = setInterval(() => {
        if (i > 0) {
            $('#timeout span').text(i);
            if(!isMuted) timeoutsound.play();
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
            if(!lockEnemies) enemies[i] = new Enemy();
        }

        startWindow(false);
    }, TimeoutBeforeGame*1000);
}

function leaderboard(state) {
    if(state) $('#leaderboard').show();
    else $('#leaderboard').hide();
}

function Reset(num) {
    GlobalBulletVar = num;
    // console.log(num);
    if (num==0) {
        birdImg = img1;

        blastsound=boom_sound;
        bonusImg=bonus1;
    } else if(num==1) {
        birdImg = img2;

        blastsound=freeze_sound;
        bonusImg=bonus2;
        guntype = 1;
    } else if(num==2) {
        birdImg = img3;

        blastsound=laser_sound;
        bonusImg=bonus3;
        guntype = 3;
    } else if(num==3) {
        birdImg = img4;

        blastsound=blast_sound;
        bonusImg=bonus4;
    }
    timeoutscreen();
}

function GlobalBullet(x, y) {
    if(GlobalBulletVar==0) {
        var bul = new Bullet(x, y);
        QUAN_BLASTS=1;
        COOLDOWNGUN=8;
        GunDamage=2;
        var d = 0;
        
        var destroyEverything = setInterval(() => {
            for (let o = 0; o < enemies.length; o++) {
                explosions.push(createVector(enemies[o].x,enemies[o].y, frameCount));   
                enemies[o].reborn();
                if(!isMuted) blastsound.play();
            }
            d++;
            if(d == 4) {
                lockEnemies=true;
                clearInterval(destroyEverything)
            };
        }, 1000);
        setTimeout(() => {
            lockEnemies=false;
        }, 5000);

    } else if(GlobalBulletVar==1) {
        var bul = new Bullet3(x, y);
        QUAN_BLASTS=1;
        COOLDOWNGUN=6;
        GunDamage=2;
    } else if(GlobalBulletVar==2) {
        if(redBlasts===10) {
            redBlastBlock=true;
            redBlasts=0;
        } 
        var bul = new Bullet2(x, y);
        QUAN_BLASTS=1;
        COOLDOWNGUN=0.25;
        GunDamage=1;
        redBlasts++;
        // console.log(redBlasts, bullets);
    } else if(GlobalBulletVar==3) {
        var bul = new Bullet1(x, y);
        QUAN_BLASTS=1;
        COOLDOWNGUN=1;
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

	// spaceShip = new SpaceShip(MAX_LIFE);
    bird = new Bird();
}

function draw() {
    // if(mouseIsPressed) {
    //     setInterval(() => {
    //         mousePressed();
    //     }, 200);
    // }
    // if (keyIsPressed && key === ' ') gun();
    if (!isMenu) {
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
                if (enemies[i].x < -1*width) {
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
                console.log(bird.life);
            }
            if(bonus[i]!==undefined){
                if (bonus[i].x < 0) {
                    // bonus.splice(1, i);
                    bonus.splice(i, 1);
                }
            }
		}

		// Bullet's move
		bulletMove();	
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
            }, COOLDOWNGUN*1000);
            
            blastsound.volume(0.5);
            if(!isMuted) blastsound.play();
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
                        setTimeout(() => {
                            if(bullets[i]!==undefined) {
                                bullets[i].y = - 10;
                            }
                        }, 2000);
                } else {
                    bullets[i].y = - 10;
                }
                for (let o = 0; o < GunDamage; o++) {
                    enemies[j].life -=1;
                    if (enemies[j].life == 0) {
                        explosions.push(createVector(enemies[j].x,enemies[j].y, frameCount));
                        enemies[j].reborn();
                        // spaceShip.score += enemies[j].point;
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
    if(object1.state === 3) {

        // var objs = [
        object1.x1 = object1.x,
        object1.x2 = object1.width + object1.x,
        object1.y1 = object1.y,
        object1.y2 = object1.height + object1.y,
        object2.x1 = object2.x,
        object2.x2 = object2.image.width + object2.x,
        object2.y1 = object2.y,
        object2.y2 = object2.image.height + object2.y
        // ];

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
    // console.log((frameCount - startFrame) % 6);
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
		this.speed = 20;
		this.radius = 0;
	}

	show() {
        image(laserGreenimg, this.x-3, this.y-3, W/2, 10);
        image(laserGreenCirimg, this.x-3, this.y-8, 20, 20);
        image(laserGreenExpimg, this.x-18+W/2, this.y-18, 40, 40);
	}
	move() {
        this.x += this.speed;
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
        this.width = 60+(W/2);
        this.height = 40;
        this.state = 3;
	}

	show() {
        image(laserVioletimg, this.x+16, this.y, this.width-60, 10);
        image(laserVioletCirimg, this.x+8, this.y-4, 20, 20);
        image(laserVioletExpimg, this.width, this.y-18, 40, 40);

        setTimeout(() => {
            bullets.length=0;
        }, 3000);
	}
	move() {
        this.y = bird.pos.y-10;
        this.width += this.speed;
	}
}

let EnemiesArray = {
    A: '',
    B: '',
    C: ''
};
function enemyspeed() {
    if(MOBILE_TYPE){
        return random(1.5,3);
    } else {
        return random(4,7);
    }
}
class Enemy{
	constructor() {
		this.reborn();
	}

	reborn() {
		this.y = random(12+(W/15), H);
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
            this.image.width = H/10;
            this.image.height = H/10;
			this.x -=this.speed;
		} else if (this.type == 1 && this.life == 1) {
			this.image = enemyImg2b;
            this.image.width = H/10;
            this.image.height = H/10;
			this.radius = H/10;
			this.x -=this.speed;
		} else {
			this.x -=this.speed;
		}
	}

	show() {
        image(this.image, this.x-15, this.y-15);
        // filter(BLUR, 10);
	}
}


class Bonus {
	constructor(type = 0) { //random ensuite
		this.x = random(W+400, W);
		this.y = random(HEADER_LIMIT, H-32);
		this.speed = enemyspeed();
		this.type = type;
		this.radius = H/12;
	}

	move(){
		this.x -= this.speed;
	}

	show() {
		image(bonusImg, this.x - this.radius, this.y - this.radius, 0.436*H/12, H/12);
	}

	effect(player) {
        player.life +=1;
	}
}

class Bird {
    constructor() {
        this.pos = createVector(W / 10, H / 2);
        this.vel = createVector(0, 5);
        this.gravity = createVector(0, 0.5);
        this.r = H/10;
        this.speed = 10;
        this.radius = 22;

        this.x = this.pos.x;
        this.y = this.pos.y;
        
        this.life=1;
		
    }
    show() {
        image(birdImg, this.pos.x - 28, this.pos.y - 26, this.r + 10, this.r + 10);
    }
    update() {
        this.vel.add(this.gravity);
        this.pos.add(this.vel);
        this.show();
        this.move();
    }
    
    move() {
        // for (let i = 0; i < 3000; i++) {
            this.x -= this.speed;
        // }
    }

}