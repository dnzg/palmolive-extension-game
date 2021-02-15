$('#bodyGlobal').show();
$('#loginScreen').hide();
$('#startScreen').show();

function Reset(num) {
    BulletNum = num;
    if (num == 0) { //orange ship
        ga('send', 'event', 'ship', 'name', 'orange', { cookieFlags: "SameSite=None; Secure" });
        // analytics.logEvent('ship', { name: 'orange'});
        birdImg = img1;
        birdActive = img1_a;

        blastsound = boom_sound;
        BLASTS_COUNT = 3;
        TEXT_ABOVE_BIRD = BLASTS_COUNT;
        bonusImg = bonus1;
        COOLDOWNGUN = 10;
    } else if (num == 1) { //arctic
        ga('send', 'event', 'ship', 'name', 'arctic', { cookieFlags: "SameSite=None; Secure" });
        birdImg = img2;
        birdActive = img2_a;

        blastsound = freeze_sound;
        BLASTS_COUNT = 3;
        TEXT_ABOVE_BIRD = 3;
        TIMEOUT_FREEZE = 3000;
        bonusImg = bonus2;
        COOLDOWNGUN = 0;
    } else if (num == 2) { //red
        ga('send', 'event', 'ship', 'name', 'red', { cookieFlags: "SameSite=None; Secure" });
        birdImg = img3;
        birdActive = img3_a;

        blastsound = laser_sound;
        BLASTS_COUNT = 10;
        bonusImg = bonus3;
        GunDamageRed = 1;
        COOLDOWNGUN = 0.25;
    } else if (num == 3) { //sport
        ga('send', 'event', 'ship', 'name', 'sport', { cookieFlags: "SameSite=None; Secure" });
        birdImg = img4;
        birdActive = img4_a;

        blastsound = blast_sound;
        BLASTS_COUNT = 1;
        bonusImg = bonus4;
        COOLDOWNGUN = 2;
    }
    birdAsset = birdImg;
    timeoutscreen();
}

let changeTime;

let changeTimeout;

function resetArcticTimer() {
    // console.log('TEXT_ABOVE_BIRD:', TEXT_ABOVE_BIRD);
        if(TEXT_ABOVE_BIRD < 7) {
            console.log(TEXT_ABOVE_BIRD, TIMEOUT_FREEZE);
            var prevI = TEXT_ABOVE_BIRD + 1;
            var b = TEXT_ABOVE_BIRD;
            changeTime = setInterval(() => {
                console.log(b);
                    if(b < 1 || b == 1) clearInterval(changeTime);
                    if(b > 0 && b < 7) {
                        b--;
                        console.log('first: ', b);
                        TEXT_ABOVE_BIRD = b;
                    }
            }, 1000);
            changeTime;
        
            changeTimeout = setTimeout(() => {
                var i = TEXT_ABOVE_BIRD;
                changeTime = setInterval(() => {
                    if(i < 3) {
                        i++;
                        // console.log('second: ', i);
                        TEXT_ABOVE_BIRD = i;
                    }
                    if(i > 3 || i == 3) clearInterval(changeTime); 
                }, 1000);
            }, prevI*1000);
            changeTimeout;
        } 
}

let getBackTimeoutFreeze, tfreeze;

function gunFunc(x, y) {
    if (BulletNum == 0) {
        var bul = new Bullet(x, y);
        enemyImg1b = enemyImg1b_b;
        enemyImg2b = enemyImg2b_b;
        GunDamage = 2;
        var d = 0;
        bigboomGlobal = true;

        BLASTS_COUNT -= 1;
        TEXT_ABOVE_BIRD -= 1;

        var b = 0;
        var boominterval = setInterval(() => {
            if (b == 7) {
                boom.length = 0;
                clearInterval(boominterval);
            } else {
                bullets.length = 0;
                boom.length = 0;
                boom.push(new Paraboom(b, b * W / 5));
            }
            b++;
        }, 450);

        bi = 0;
        var destroyEverything = setInterval(() => {
            shakingScreen = true;
            for (let o = 0; o < enemies.length; o++) {
                explosions.push(createVector(enemies[o].x, enemies[o].y, frameCount));
                enemies[o].reborn();
                playAudio(blastsound);
            }
            d++;
            if (d == 3) {
                lockEnemies = true;
                clearInterval(destroyEverything)
            };
        }, 1000);
        setTimeout(() => {
            bigboomGlobal = false;
            shakingScreen = false;
            lockEnemies = false;
        }, 3500);

    } else if (BulletNum == 1) {
        // console.log(lockGun, TIMEOUT_FREEZE, TEXT_ABOVE_BIRD);
        var bul = new Bullet3(x, y);
        GunDamage = 1;
        enemyImg1b = enemyImg1i;
        enemyImg2b = enemyImg2i;
        resetArcticTimer();
        lockGun = true;
        if(TIMEOUT_FREEZE !== 3000) {
            getBackTimeoutFreeze = setTimeout(() => {
                TIMEOUT_FREEZE = 3000;
            }, TIMEOUT_FREEZE);
        }
        tfreeze = setTimeout(() => {
            bullets.length = 0;
            lockGun = false;
        }, TIMEOUT_FREEZE);
    } else if (BulletNum == 2) {
        if (redBlasts === 10 && !redBlastImb) {
            redBlastBlock = true;
            redBlasts = 0;

            setTimeout(() => {
                redBlastBlock = false;
            }, 5000);
        }
        var bul = new Bullet2(x, y);
        enemyImg1b = enemyImg1b_b;
        enemyImg2b = enemyImg2b_b;
        GunDamage = GunDamageRed;
        redBlasts++;
    } else if (BulletNum == 3) {
        setTimeout(() => {
            BLASTS_COUNT = 1;
        }, COOLDOWNGUN*1000);
        var bul = new Bullet1(x, y);
        enemyImg1b = enemyImg1b_b;
        enemyImg2b = enemyImg2b_b;
        GunDamage = 2;
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

function setup() {
    startWindow(true);
    x2 = 10 * H;
    bird = new Bird();
}

function draw() {
    if (!isMenu) {
        if (shakingScreen) translate(random(-5, 5), random(-5, 5));

        LastScore = score;
        background('#000');
        image(back, x1, 0, 10 * H, H);
        image(back, x2, 0, 10 * H, H);
        x1 -= scrollSpeed;
        x2 -= scrollSpeed;
        bird.show();
        bird.update();

        if (bird.pos.y > canvas.height) {
            gameoverscreen();
        }
        
        score++;
        LastScore = score;
        if (score % 1 == 0) {
            textSize(32);
            scoreHead(s(LastScore));
        }
        if (x1 < -10 * H) {
            x1 = 10 * H;
        }
        if (x2 < -10 * H) {
            x2 = 10 * H;
        }

        for (enemy of enemies) {
            enemy.move();
            enemy.show();
        }

        for (let i = 0; i < explosions.length; i++) {
            if (explosions[i].z + 6 > frameCount) {
                explosion(explosions[i].x, explosions[i].y, explosions[i].z);
            } else {
                explosions.splice(i, 1);
            }

        }
        // Enemy out of screen
        for (let i = 0; i < enemies.length; i++) {
            if (intersectWithBird(bird, enemies[i])) {
                gameoverscreen();
            }

            if (enemies[i] !== undefined) {
                if (enemies[i].x < 0) {
                    enemies[i].reborn();
                }
            }
        }

        // Bonus
        if (random(1, 300) <= 2 && bonus.length < 1) {
            bonus.push(new Bonus);
        }
        for (i = 0; i < bonus.length; i++) {
            bonus[i].move();
            bonus[i].show();
            if (intersectWithBirdAndBonus(bird, bonus[i])) {
                bonus[i].effect(bird);
                bonus.splice(i, 1);
            }
            if (bonus[i] !== undefined) {
                if (bonus[i].x < 0) {
                    bonus.splice(i, 1);
                }
            }
        }

        // Bullet's move
        bulletMove();

        for (let b = 0; b < boom.length; b++) {
            boom[b].move();
            boom[b].show();
        }
        // console.log(isMuted);
    }
}

function gun() {
    // console.log(lockGun, BulletNum, BLASTS_COUNT);
    if (redBlasts > 10) redBlasts = 0;
    if (lockGun || BLASTS_COUNT <= 0) return; // if gun is locked or empry — deny
    if (BulletNum == 2 && redBlastBlock) return;
    if (BulletNum == 1 && TEXT_ABOVE_BIRD < 2) return;
    
    if (BulletNum !== 1) lockGun = true; // gun should be locked until cooldown 
    // console.log('yo: ', lockGun, BulletNum);
    if (BulletNum !== 2 && BulletNum !== 3) birdAsset = birdActive; // switch to Active Skin if it's orange or white ship
    setTimeout(() => {
        if (BulletNum !== 1) lockGun = false;
        if (BulletNum !== 2 && BulletNum !== 3) birdAsset = birdImg;
    }, COOLDOWNGUN * 1000); // cooldown & switch skin
    playAudio(blastsound); // play sound
    
    bullets.push(gunFunc(bird.pos.x, bird.pos.y)); // FIRE
}

function bulletMove() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].move();
        bullets[i].show();
        for (let j = 0; j < enemies.length; j++) {
            if (intersectWith(bullets[i], enemies[j])) {
                if (BulletNum == 1) {
                    if (enemies[j].type == 1) {
                        enemies[j].image = enemyImg1i;
                        enemies[j].image.width = H / 7;
                        enemies[j].image.height = H / 7;
                        setTimeout(() => {
                            if (enemies[j] !== undefined) {
                                enemies[j].life -= 2;
                                explosions.push(createVector(enemies[j].x, enemies[j].y, frameCount));
                                enemies[j].reborn();
                            }
                        }, 400);
                    } else if (enemies[j].type == 2) {
                        enemies[j].image = enemyImg2i;
                        enemies[j].image.width = H / 7;
                        enemies[j].image.height = H / 7;
                        setTimeout(() => {
                            if (enemies[j] !== undefined) {
                                enemies[j].life -= 2;
                                explosions.push(createVector(enemies[j].x, enemies[j].y, frameCount));
                                enemies[j].reborn();
                            }
                        }, 400);
                    } 
                    return;
                }
                
                if (BulletNum !== 3) bullets[i].y = -10;
                
                for (let o = 0; o < GunDamage; o++) {
                    if (enemies[j].life == 0) {
                        explosions.push(createVector(enemies[j].x, enemies[j].y, frameCount));
                        enemies[j].reborn();
                    } else {
                        enemies[j].life -= 1;
                        enemies[j].image = enemyImg2b;
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
    if (object1.state === 3 || object1.state === 1) {
        object1.x1 = object1.x,
            object1.x2 = object1.width + object1.x,
            object1.y1 = object1.y,
            object1.y2 = object1.height + object1.y,
            object2.x1 = object2.x,
            object2.x2 = object2.image.width + object2.x,
            object2.y1 = object2.y,
            object2.y2 = object2.image.height + object2.y

        if (object1.x1 < object2.x2 &&
            object1.x2 > object2.x1 &&
            object1.y1 < object2.y2 &&
            object1.y2 > object2.y1) return true;
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

function explosion(x, y, startFrame) {
    image(explosionAnim[(frameCount - startFrame) % 6], x, y, H / 12, H / 12);
}

class Bullet {
    constructor(initX, initY) {
        this.x = initX;
        this.y = initY - 10;
        this.speed = 3;
        this.radius = 0;
    }

    show() {
        image(blastimg, this.x - 3, this.y - 3, H / 15, H / 15);
    }
    move() {
        this.x += this.speed;
        this.y += this.speed / 10;
    }
}

class Bullet1 {
    constructor(initX, initY) {
        this.x = initX;
        this.y = initY - 10;
        this.speed = 1;
        this.radius = 50;
        this.width = 32 + W / 2;
        this.height = 40;
        this.state = 1;
    }

    show() {
        if(SPORT_LASER_HEIGHT === 10) {
            image(laserGreenimg, this.x + 42, this.y + 15, W / 2, SPORT_LASER_HEIGHT);
        } else {
            image(laserGreenimg, this.x + 42, this.y + 10, W / 2, SPORT_LASER_HEIGHT);
        }
        image(laserGreenCirimg, this.x + 36, this.y + 10, 20, 20);
        image(laserGreenExpimg, this.x + 10 + W / 2, this.y, 40, 40);

        // console.log(TIMEOUT_BLUE);
        
            setTimeout(() => {
                bullets.length = 0;
            }, TIMEOUT_BLUE);
    }
    move() {
        this.y = bird.pos.y - 10;
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
        image(laserimg, this.x - 3, this.y - 3);
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

        this.widthh = 40;
        this.heighth = 33;
        
        this.width = 32 + (W / 2);
        this.height = 40;
        this.state = 3;
    }

    show() {
        for (let n = 0; n < 6; n++) {
            image(laserVioletimg, this.x + this.x + 24 + this.widthh * n, this.y + 24 - this.heighth/2, this.widthh, 0.4*this.heighth);
        }

        image(laserVioletCirimg, this.x + 42, this.y + 16 - this.heighth/2, this.widthh*2, this.heighth);
        image(laserVioletExpimg, this.x + this.x + 24 + this.widthh * 6, this.y + 24 - this.heighth/2, this.widthh, 0.5*this.heighth);
    }
    move() {
        this.y = bird.pos.y - 10;
        this.widthh += this.speed / 20;
        this.heighth += this.speed / 20;
    }
}

function enemyspeed() {
    if (MOBILE_TYPE) {
        if (levelEnemy == 'easy') {
            return random(3.5, 5.5);
        } else if (levelEnemy == 'hard') {
            return random(5.5, 6.5);
        }
    } else {
        // console.log(levelEnemy);
        if (levelEnemy == 'easy') {
            return random(3, 6);
        } else if (levelEnemy == 'hard') {
            return random(5, 7);
        }
    }
}
class Enemy {
    constructor() {
        this.reborn();
    }

    reborn() {
        this.y = random(HEADER_LIMIT + 12, H);
        this.x = random(W + 400, W);

        let lifeP = 1;
        if (BulletNum == 2) lifeP = 2;
        let enemyLottery = random(1, 4);

        this.image = {};
        if (enemyLottery >= 1 && enemyLottery < 2) {
            this.type = 1;
            this.speed = enemyspeed();
            this.image = met1;
            this.image.width = H / 8;
            this.image.height = H / 8;
            this.life = 2;
            // this.point = 2;
            this.radius = H / 14;
            // this.dirPostHit = Math.pow(-1, Math.round(random(1,2))) * random(0.2,0.5);
        } else if (enemyLottery >= 2 && enemyLottery < 4) {
            this.type = 2;
            this.speed = enemyspeed();
            this.image = met2;
            this.image.width = H / 7;
            this.image.height = H / 7;
            this.life = lifeP;
            this.radius = H / 12;
        }
    }

    move() {
        if (this.type == 1 && this.life == 1) {
            this.image = enemyImg1b;
            this.image.width = H / 8;
            this.image.height = H / 8;
            this.x -= this.speed;
        } else if (this.type == 2 && this.life == 1 && BulletNum == 2) {
            this.image = enemyImg2b;
            this.image.width = H / 7;
            this.image.height = H / 7;
            this.x -= this.speed;
        } else if (this.life == 0) {
            explosions.push(createVector(this.x, this.y, frameCount));
            this.reborn();
        } else {
            this.x -= this.speed;
        }
    }

    show() {
        image(this.image, this.x - 15, this.y - 15);
    }
}

let redBoostTimeout;
class Bonus {
    constructor(type = 0) { //random ensuite
        this.x = random(W + 400, W);
        this.y = random(HEADER_LIMIT, H - 32);
        this.speed = enemyspeed();
        this.type = type;
        this.radius = H / 7;
    }

    move() {
        this.x -= this.speed;
    }

    show() {
        image(bonusImg, this.x - this.radius, this.y - this.radius, 0.436 * H / 7, H / 7);
    }

    effect() {
        if (BulletNum == 0 && BLASTS_COUNT < 5) {
            BLASTS_COUNT += 1;
            TEXT_ABOVE_BIRD += 1;
        } else if (BulletNum == 1) {
            clearInterval(changeTime);
            clearTimeout(changeTimeout);
            if(TEXT_ABOVE_BIRD + 3 > 6) {
                TEXT_ABOVE_BIRD = 6;    
            } else {
                TEXT_ABOVE_BIRD = TEXT_ABOVE_BIRD + 3;
            }
            TIMEOUT_FREEZE = TEXT_ABOVE_BIRD*1000;
            if(lockGun) {
                bullets.length = 0;
                clearTimeout(getBackTimeoutFreeze);
                clearTimeout(tfreeze);
                bullets.push(gunFunc(bird.pos.x, bird.pos.y)); // FIRE
            }
        } else if (BulletNum == 2) {
            clearTimeout(redBoostTimeout);
            GunDamageRed = 2;
            birdAsset = birdActive;
            redBlastImb = true;
            redBlastBlock = false;
            redBlasts = 0;
            
            redBoostTimeout = setTimeout(() => {
                birdAsset = birdImg;
                GunDamageRed = 1;
                redBlastBlock = false;
                redBlastImb = false;
            }, 10000);
        } else if (BulletNum == 3) {
            SPORT_LASER_HEIGHT = 20;
            // TIMEOUT_BLUE = 3000;
            // COOLDOWNGUN = TIMEOUT_BLUE;
            birdAsset = birdActive;

            setTimeout(() => {
                birdAsset = birdImg;
                SPORT_LASER_HEIGHT = 10;
            }, TIMEOUT_BLUE*3);
        }
    }
}


//BIG BOOM for orange ship
class Paraboom {
    constructor(i, s) {
        this.x = bird.pos.x + W / 3;
        this.y = (bird.pos.y) - (s / 2);
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