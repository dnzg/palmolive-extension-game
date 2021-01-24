
const MAX_ENEMY = 9;
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
    } else {
        $('#startScreen').hide();
        $('#defaultCanvas0').show();
    }
}

function Reset() {
    startWindow(false);
    createCanvas(W, H);
    // pipe1 = new Pipe(0);
    // pipe2 = new Pipe(100);
    // pipe3 = new Pipe(200);
    bird = new Bird();
    frameRate(60);
    score = 0;
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
    for (let i=0; i<MAX_ENEMY; i++) {
		enemies[i] = new Enemy();
	}
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

        // collison(bird.pos.x, bird.pos.y, pipe1.x, pipe1.y, pipe1.w, canvas.height, bird.r);
        // collison(bird.pos.x, bird.pos.y, pipe1.x, 0, pipe1.w, pipe1.h, bird.r);
        // collison(bird.pos.x, bird.pos.y, pipe2.x, pipe2.y, pipe2.w, canvas.height, bird.r);
        // collison(bird.pos.x, bird.pos.y, pipe2.x, 0, pipe2.w, pipe2.h, bird.r);
        // collison(bird.pos.x, bird.pos.y, pipe3.x, pipe3.y, pipe3.w, canvas.height, bird.r);
        // collison(bird.pos.x, bird.pos.y, pipe3.x, 0, pipe3.w, pipe3.h, bird.r);

        // collison_blast(blast.pos.x, blast.pos.y, pipe1.x, pipe1.y, pipe1.w, canvas.height, blast.r);
        // collison_blast(blast.pos.x, blast.pos.y, pipe1.x, 0, pipe1.w, pipe1.h, blast.r);
        // collison_blast(blast.pos.x, blast.pos.y, pipe2.x, pipe2.y, pipe2.w, canvas.height, blast.r);
        // collison_blast(blast.pos.x, blast.pos.y, pipe2.x, 0, pipe2.w, pipe2.h, blast.r);
        // collison_blast(blast.pos.x, blast.pos.y, pipe3.x, pipe3.y, pipe3.w, canvas.height, blast.r);
        // collison_blast(blast.pos.x, blast.pos.y, pipe3.x, 0, pipe3.w, pipe3.h, blast.r);

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
				background(255,0,0);
				// spaceShip.life -=1;
				enemies[i].reborn();
			}
			if (enemies[i].x < -1*width) {
				enemies[i].reborn();
			}
		}
		// Bullet's move
		bulletMove();	
    }
}

function mousePressed() {
    bird.vel.y = -10;
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
        // gameover.play();
        textSize(32);
        text("GAME OVER!", W / 2 - 100, H / 2);
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
    if (y1 > y2 || y1 < 0) {
        Reset();
        // gameover.play();
        textSize(32);
        text("GAME OVER!", W / 2 - 100, H / 2);
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

// class Pipe {
//     constructor(mesafe) {
//         this.m = mesafe;
//         this.w = random(H/5, H/4);
//         this.x = canvas.width + this.w + this.m;
//         this.speed = 4;
//         this.space = 150;
//         // this.y = random(this.space + 150, canvas.height - (this.space + 50));
//         this.y = random(0, canvas.height);
//         // console.log(this.y);
//         this.h = this.w;

//         this.img = Math.round(random(1,2));
//         // console.log(this.img);
//     }
//     show() {
//         // console.log(this.img);
//         if(this.img == 1) {
//             push();
//             strokeWeight(0);
//             image(met1, this.x, this.y, this.w, this.h);
//             noFill();
//             rect(this.x, this.y, this.w, this.h);
    
//             pop();
//         } else {
//             push();
//             strokeWeight(0);
//             image(met2, this.x, this.y, this.w, this.h);
//             noFill();
//             rect(this.x, this.y, this.w, this.h);
    
//             pop();

//         }
        
//     }

//     move() {
//         this.x -= this.speed;
//     }

//     update() {
//         this.show();
//         this.move();
//         this.edge();
//     }

//     edge() {
//         if (this.x + this.w < 0) {
//             this.x = width;
//             this.y = random(0, canvas.height);

//             this.img = Math.round(random(1,2));
//         }
//     }
// }

function keyPressed() {

		if (key === ' ') {
            bullets.push(new Bullet(bird.pos.x, bird.pos.y));
            console.log(bird);
		}
}

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
					spaceShip.score += enemies[j].point;
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
// class SpaceShip {
// 	constructor(life) {
// 		this.x = width / 2;
// 		this.y = height - 30;
// 		this.speed = 10;
// 		this.direction = 0;
// 		this.upDown = 0;
// 		this.life = life;
// 		this.score = 0;
// 		this.radius = 22;
// 	}

// 	show() {
// 		image(spaceShipImg, this.x-this.radius, this.y-this.radius);
// 	}

// 	move() {
// 	}
// }
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
		this.x = random(700, 1400);
		
		let enemyLottery = random(1,4);
		this.image = {}
		if (enemyLottery >= 1 && enemyLottery < 2 ) {
			this.type = 1;
			this.speed = random(4,8);
			this.image = met1;
			this.life = 2;
			this.point = 2;
			this.radius = 20;
			this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} else if (enemyLottery >= 2 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(4,8);
			this.image = met2;
			this.life = 2;
			this.point = 2;
			this.radius = 20;
			this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
		} 
	}

	move() {
		if (this.type == 1 && this.life == 1) {
			this.image = enemyImg1b;
			this.y +=this.speed;
			this.x += this.speed * this.dirPostHit;
		} else {
			this.x -=this.speed;
		}
	}

	show() {
		image(this.image, this.x-15, this.y-15);
	}
}
