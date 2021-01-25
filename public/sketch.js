
const MAX_ENEMY = 18;
const MAX_LIFE = 3;

let spaceShip;
let enemies = [];
let bullets = [];
let explosions = [];
let explosionAnim = [];
let spaceShipImg;
let bulletImg;
let enemyImg1;
let enemyImg1b;
let state = 0;



const W = window.innerWidth;
const H = window.innerHeight;
var isMenu = 1;
var score = 0;
var LastScore;
var pipe1;
var pipe2;
var pipe3;
var bird;
let img1;
let img2;
let back;
let flap;
let met1;
let met2;
let blastimg;
let gameover;
var button;

var x1 = 0;
var x2;
var scrollSpeed = 0.65;

function preload() {
    img1 = loadImage('assets/frame-1.png');
    img2 = loadImage('assets/frame-2.png');
    back = loadImage('assets/bg.jpg');
    flap = loadSound('sounds/flap.mp3');
    gameover = loadSound('sounds/gameover.wav');

    met1 = loadImage('assets/m1.png');
    met2 = loadImage('assets/m2.png');
    blastimg = loadImage('assets/blast.png');

    spaceShipImg = loadImage('assets/spaceShip.png');
	bulletImg = loadImage('assets/bullet.png');
	enemyImg1 = loadImage('assets/enemy1.png');
	enemyImg1b = loadImage('assets/m1b.png');
	myFont = loadFont('assets/8-bit-pusab.ttf');
	for (let i = 1; i<7; i++) {
		explosionAnim.push(loadImage('assets/expl'+i+'.png'));
	}
}

function startWindow(state) {
    if(state) {
        $('#startScreen').show();
        $('#defaultCanvas0').hide();
        $('#blast').hide();
    } else {
        $('#blast').show();
        $('#startScreen').hide();
        $('#defaultCanvas0').show();
        $('#gameoverscreen').hide();
    }
}

function gameoverscreen() {
    ResetGameover();
    console.log('бывает');
    // bird.filter(BLUR, 100);
    // ba
    // saveCanvas(canvas, "scr", "png");
    // canvas.filter(BLUR, 10);
    // canvasimg = loadImage(canvas);
    $('#gameoverscreen').show();
    console.log(canvas);
    filter(BLUR, 5);
    enemies = [];
}

function Reset() {
    startWindow(false);
    canvas = createCanvas(W, H);
    bird = new Bird();
    frameRate(120);
    score = 0;
    if (isMenu == 1) {
        isMenu = 0;
    } else if (isMenu == 0) {
        isMenu = 1;
    }
    for (let i=0; i<MAX_ENEMY; i++) {
		enemies[i] = new Enemy();
	}
}

function ResetGameover() {
    // startWindow(false);
    // createCanvas(W, H);
    // bird = new Bird();
    // frameRate(60);
    // score = 0;
    if (isMenu == 1) {
        isMenu = 0;
    } else if (isMenu == 0) {
        isMenu = 1;
    }
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
        // pipe1.update();
        // pipe2.update();
        // blast.update();
        bird.show();
        bird.update();

      
        edges(bird.pos.y, canvas.height);
        // Score(bird.pos.x, pipe1.x);
        // Score(bird.pos.x, pipe2.x);
        if (score % 1 == 0) {
            textSize(32);
            text(s(LastScore), W / 2, H / 2 - 200);
        }
        if (x1 < -10*H){
            x1 = 10*H;
        }
        if (x2 < -10*H){
            x2 = 10*H;
        }



        // spaceShip.show();
		// spaceShip.move();
		// if (spaceShip.life <= 0) {
		// 	state = 99;
		// }
		
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
                // background(255,0,0);
                // Reset();
                gameoverscreen();
				// spaceShip.life -=1;
				// enemies[i].reborn();
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
    if(bird.pos.y > 0) {
        bird.vel.y = -10;
    } else {
        bird.vel.y = +10;
    }
    // blast.vel.y = -10;
    // blast.vel.x = +1;
    // flap.play();
}

function countTouches(event) {
    mousePressed();
}

function collison(x1, y1, x2, y2, w1, h1, r) {
    if (x1 + r / 4 >= x2 && x1 - r / 4 <= x2 + w1 && y1 + r / 4 >= y2 && y1 - r / 4 <= y2 + h1) {
        Reset();
        gameoverscreen();
    }
}


function collison_blast(x1, y1, x2, y2, w1, h1, r) {
    if (x1 + r / 4 >= x2 && x1 - r / 4 <= x2 + w1 && y1 + r / 4 >= y2 && y1 - r / 4 <= y2 + h1) {
        // Reset();
        // gameover.play();
        // textSize(32);
        // text("GAME OVER!", W / 2 - 100, H / 2);
        // console.log('+1');
    }
}

function edges(y1, y2) {
    // if (y1 > y2 || y1 < 0) {
    if (y1 > y2) {
        gameoverscreen();
    }
}

function Score(x1, x2) {
    if (x1 > x2 && x1 > x2 + 5) {
        score++;
        LastScore = score;
    }
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
        if (bird.vel.y >= 0) {
            image(img1, this.pos.x - 28, this.pos.y - 26, this.r + 10, this.r + 10);
        } else if (bird.vel.y < 0) {
            image(img2, this.pos.x - 28, this.pos.y - 26, this.r + 10, this.r + 10);
        }
    }
    update() {
        this.vel.add(this.gravity);
        this.pos.add(this.vel);
        this.show();
        this.move();
    }
    
    move() {
        for (let i = 0; i < 3000; i++) {
            this.x -= this.speed + i;
        }
    }

}


function keyPressed() {

		if (key === ' ') {
            bullets.push(new Bullet(bird.pos.x, bird.pos.y));
            // console.log(bird);
		}
}

$('#blast').on('click', function(){
    bullets.push(new Bullet(bird.pos.x, bird.pos.y));
});

function bulletMove() {
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].move();
		bullets[i].show();
		for (let j = 0; j < enemies.length; j++) {
			if (intersectWith(bullets[i], enemies[j])) {
				bullets[i].y = - 10;
				enemies[j].life -=1;
				if (enemies[j].life == 0) {
					explosions.push(createVector(enemies[j].x,enemies[j].y, frameCount));
					enemies[j].reborn();
					// spaceShip.score += enemies[j].point;
				}
				
			}
		}
	}
	// Remove bullet when it's out of screen
	for (i = 0; i < bullets.length; i++) {
		if (bullets[i].y < 0) {
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
	if (distance < object1.radius + object2.radius) {
		return true;
	} else {
		return false;
	}
}


function explosion(x,y, startFrame) {
	image(explosionAnim[(frameCount - startFrame) % 6], x, y);
}
class Bullet {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 12;
		this.radius = 0;
	}

	show() {
		image(blastimg, this.x-3, this.y-3);
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
		this.y = random(0, H);
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
			this.point = 2;
			this.radius = H/8;
			this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} else if (enemyLottery >= 2 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(4,8);
            this.image = met2;
            this.image.width = H/10;
            this.image.height = H/10;
			this.life = 2;
			this.point = 2;
			this.radius = H/10;
			this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} 
	}

	move() {
		if (this.type == 1 && this.life == 1) {
			this.image = enemyImg1b;
            this.image.width = H/10;
            this.image.height = H/10;
			this.y +=this.speed;
			this.x += this.speed * this.dirPostHit;
		} else {
			this.x -=this.speed;
		}
	}

	show() {
        image(this.image, this.x-15, this.y-15);
        // filter(BLUR, 10);
	}
}
