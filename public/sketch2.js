
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

function preload() {
	spaceShipImg = loadImage('assets/spaceShip.png');
	bulletImg = loadImage('assets/bullet.png');
	enemyImg1 = loadImage('assets/enemy1.png');
	enemyImg1b = loadImage('assets/enemy1b.png');
	myFont = loadFont('assets/8-bit-pusab.ttf');
	for (let i = 1; i<7; i++) {
		explosionAnim.push(loadImage('assets/expl'+i+'.png'));
	}
}

function setup() {
	frameRate(30);
	createCanvas(800,500);

	spaceShip = new SpaceShip(MAX_LIFE);
	for (let i=0; i<MAX_ENEMY; i++) {
		enemies[i] = new Enemy();
	}
}

function draw() {
	background(5,0,12);
	if (state == 0) {		
		fill(255);
		textFont(myFont);
		textSize(28);
		textStyle(BOLD);
		textAlign(CENTER);
		text("SpaceShooter", width / 2,150);
		textSize(12);
		text("Press 'Return' to start", width / 2,300);
		text("Arrows to move", width / 2,350);
		text("Space bar to fire", width / 2,400);
		text("By LittleBoxes - 2019", width / 2,height - 30);
	} else if (state == 1) {
		spaceShip.show();
		spaceShip.move();
		if (spaceShip.life <= 0) {
			state = 99;
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

		fill(255);
		textFont(myFont);
		textStyle(BOLD);
		text(spaceShip.score, 30,30);
		text("Life : " + spaceShip.life, 300,30);

		// Enemy out of screen
		for (let i = 0; i < enemies.length; i++) {
			if (intersectWith(spaceShip, enemies[i])) {
				background(255,0,0);
				spaceShip.life -=1;
				enemies[i].reborn();
			}
			if (enemies[i].x < -1*width) {
				enemies[i].reborn();
			}
		}
		// Bullet's move
		bulletMove();	
	} else if (state = 99) {
		// Final Screen
		
		for (enemy of enemies) {
			enemy.move();
			enemy.show();
		}
		fill(255);
		textFont(myFont);
		textSize(12);
		text(spaceShip.score, 30,30);
		textSize(32);
		textStyle(BOLD);
		textAlign(CENTER);
		text("GAME OVER", width / 2,150);
		textSize(12);
		text("Press 'Return' to restart", width / 2,300);
	}
}

function keyPressed() {
	if (state == 0) {
		if (keyCode === RETURN) {
			state = 1;
		}
	}else if(state ==1) { 
		if (key === ' ') {
			bullets.push(new Bullet(spaceShip.x, spaceShip.y));
		}
	} else if (state == 99) {
		if (keyCode === RETURN) {
			state = 1;
			enemies = [];
			bullets = [];
			enemyBullets = [];
			setup();
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

function explosion(x,y, startFrame) {
	image(explosionAnim[(frameCount - startFrame) % 6], x, y);
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

class SpaceShip {
	constructor(life) {
		this.x = width / 2;
		this.y = height - 30;
		this.speed = 10;
		this.direction = 0;
		this.upDown = 0;
		this.life = life;
		this.score = 0;
		this.radius = 22;
	}

	show() {
		image(spaceShipImg, this.x-this.radius, this.y-this.radius);
	}

	move() {
	}
}
class Bullet {
	constructor(initX, initY) {
		this.x = initX;
		this.y = initY - 10;
		this.speed = 12;
		this.radius = 4;
	}

	show() {
		image(bulletImg, this.x-3, this.y-3);
	}
	move() {
		this.y -= this.speed;
	}
}

class Enemy{
	constructor() {
		this.reborn();
	}

	reborn() {
		this.y = random(10, width -10);
		this.x = random(700, 1400);
		
		let enemyLottery = random(1,4);
		this.image = {}
		if (enemyLottery >= 1 && enemyLottery < 4 ) {
			this.type = 1;
			this.speed = random(4,8);
			this.image = enemyImg1;
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
