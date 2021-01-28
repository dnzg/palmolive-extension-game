let W = $(window).width();
let H = $(window).height();
const MAX_ENEMY = 18;
const MAX_LIFE = 3;
let COOLDOWNGUN;
let QUAN_BLASTS;
const TimeoutBeforeGame = 0;

$(window).on('load resize', function() {
    // if ($(window).width() <= '1280') {}
    $('header').height($(window).width()/15);
    $('#gameoverInside').height(0.89*$(window).width()/2).width($(window).width()/2);
    // $('#timeout').height(0.89*$(window).width()/2).width($(window).width()/2);
    
    W = $(window).width();
    H = $(window).height();
    setup();
});

let enemies = [];
let bullets = [];
let explosions = [];
let explosionAnim = [];
let bulletImg;
let enemyImg1b;
let enemyImg2b;

var isMenu = 1;
let state = 0;
var score = 0;
var LastScore;

var pipe1;
var pipe2;
var pipe3;
var bird;
let img1;
let img2;
let img3;
let img4;
let back;
let flap;
let met1;
let met2;

let GunDamage;

let blastimg;
let laserimg;

let laserGreenimg;
let laserGreenExpimg;
let laserGreenCirimg;

let laserVioletExpimg;
let laserVioletCirimg;
let laserVioletimg;

let gameover;
var button;

let blast_sound;
let laser_sound;
let freeze_sound;
let boom_sound;

let GlobalBulletVar;

var x1 = 0;
var x2;
var scrollSpeed = 0.65;

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
    
    laserVioletExpimg = loadImage('assets/laser_violet.png');
    laserVioletCirimg = loadImage('assets/laser_violet_circle.png');
    laserVioletimg = loadImage('assets/laser_violet_exp.png');

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
        $('#blast').show();
        $('#startScreen').hide();
        $('#defaultCanvas0').show();
        $('header').css('display', 'flex');
        $('#scoreLeft').show();
        $('#gameoverscreen').hide();
    }
}

function gameoverscreen() {
    gameover.play();
    $('#blocker').show();
    setTimeout(() => {
        $('#blocker').hide();
    }, 1000);
    ResetGameover();
    enemies = [];
    $('#gameoverInside h3').text(s(score));
    $('#gameoverscreen').show();
}

function timeoutscreen() {
    $('#timeoutscreen').show();

    for (let i = 1; i <= TimeoutBeforeGame+1; i++) {
        if(i==TimeoutBeforeGame+1){
            $('#timeout span').text(0);
        } else {
            setTimeout(() => {
                timeoutsound.play();
                $('#timeout span').text(i);
            }, i*1000);
        }
    }
    
    setTimeout(() => {
        $('#timeoutscreen').hide();
        canvas = createCanvas(W, H);
        bird = new Bird();
        frameRate(60);
        score = 0;
        if (isMenu == 1) {
            isMenu = 0;
        } else if (isMenu == 0) {
            isMenu = 1;
        }
        for (let i=0; i<MAX_ENEMY/2; i++) {
            enemies[i] = new Enemy();
        }

        startWindow(false);
    }, (TimeoutBeforeGame+1)*1000);
}

function leaderboard(state) {
    if(state) $('#leaderboard').show();
    else $('#leaderboard').hide();
}

function Reset(num) {
    GlobalBulletVar = num;
    if (num==0) {
        birdImg = img1;

        blastsound=boom_sound;
    } else if(num==1) {
        birdImg = img2;

        blastsound=freeze_sound;
    } else if(num==2) {
        birdImg = img3;

        blastsound=laser_sound;
    } else if(num==3) {
        birdImg = img4;

        blastsound=blast_sound;
    }
    timeoutscreen();
}

function GlobalBullet(x, y) {
    if(GlobalBulletVar==0) {
        var bul = new Bullet(x, y);
        QUAN_BLASTS=3;
        COOLDOWNGUN=3;
        GunDamage=1;
    } else if(GlobalBulletVar==1) {
        var bul = new Bullet3(x, y);
        QUAN_BLASTS=1;
        COOLDOWNGUN=5;
        GunDamage=2;
    } else if(GlobalBulletVar==2) {
        var bul = new Bullet2(x, y);
        QUAN_BLASTS=2;
        COOLDOWNGUN=1.5;
        GunDamage=2;
    } else if(GlobalBulletVar==3) {
        var bul = new Bullet1(x, y);
        QUAN_BLASTS=1;
        COOLDOWNGUN=5;
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
    $('#scoreHead').text(val);
    $('#scoreLeft h2').text(val);
}

function setup() {
    startWindow(true);

    x2 = 10*H;

	// spaceShip = new SpaceShip(MAX_LIFE);
    bird = new Bird();
}

function draw() {
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
		// Bullet's move
		bulletMove();	
    }
}

function mousePressed() {
    if(bird.pos.y > W/15) {
        bird.vel.y = -8;
    } else {
        bird.vel.y = +8;
    }
}

function countTouches(event) {
    mousePressed();
}

function collison(x1, y1, x2, y2, w1, h1, r) {
    if (x1 + r / 4 >= x2 && x1 - r / 4 <= x2 + w1
        && y1 + r / 4 >= y2 && y1 - r / 4 <= y2 + h1) {
        Reset();
        gameoverscreen();
    }
}


function collison_blast(x1, y1, x2, y2, w1, h1, r) {
    if (x1 + r / 4 >= x2 && x1 - r / 4 <= x2 + w1
        && y1 + r / 4 >= y2 && y1 - r / 4 <= y2 + h1) {
        // gameover.play();
    }
}

function edges(y1, y2) {
    // if (y1 > y2 || y1 < 0) {
    if (y1 > y2) {
        gameoverscreen();
    }
}

function Score(x1, x2) {
    // if (x1 > x2 && x1 > x2 + 5) {
        score++;
        LastScore = score;
    // }
}

function s(score) {
    score = Math.floor(score / 22);
    return score;
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

let lockGun = false;

function keyPressed() {
    if (key === ' ') gun();
}

$('#blast').on('click', function(){
    gun();
});

function gun() {
    if(!lockGun) {
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
        blastsound.play();
    }
}

function bulletMove() {
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].move();
		bullets[i].show();
		for (let j = 0; j < enemies.length; j++) {
			if (intersectWith(bullets[i], enemies[j])) {
                bullets[i].y = - 10;
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
		if (bullets[i].x > W) {
			bullets.splice(i, 1);
		}
	}
}
function intersectWith(object1, object2) {
	let distance = dist(object1.x, object1.y, object2.x, object2.y);
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
		this.speed = 12;
		this.radius = 0;
	}

	show() {
		image(blastimg, this.x-3, this.y-3, H/25, H/25);
	}
	move() {
        this.x += this.speed;
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
		this.speed = 20;
		this.radius = 0;
	}

	show() {
        image(laserVioletimg, this.x-3, this.y-3, W/2, 10);
        image(laserVioletCirimg, this.x-3, this.y-8, 20, 20);
        image(laserVioletExpimg, this.x-18+W/2, this.y-18, 40, 40);
	}
	move() {
        this.x += this.speed;
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
			this.speed = random(4,8);
            this.image = met1;
            this.image.width = H/8;
            this.image.height = H/8;
			this.life = 2;
			// this.point = 2;
			this.radius = H/14;
			// this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} else if (enemyLottery >= 2 && enemyLottery < 4 ) {
			this.type = 2;
			this.speed = random(4,8);
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
