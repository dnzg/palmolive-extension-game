
let mouseyglobal = 0;
let direction = '',
    oldY = 0;

$(document).bind('touchmove', function(e) {
    var ml = e.originalEvent.touches[0].clientY;
    const zeroY = H / 2;
    const zeroSpace = H / 2;
    if (!isMenu) {
        if (ml > 0) {
            mouseyglobal = ml;
            if (ml < oldY && ml < zeroY + zeroSpace && ml > zeroY - zeroSpace) {
                direction = 'top';
            } else if (ml > oldY && ml < zeroY + zeroSpace && ml > zeroY - zeroSpace) {
                direction = 'bottom';
            }
            oldY = ml;
        }
    }
});

onmousemove = function(e) {
    var ml = e.clientY - $('#bodyGlobal').offset().top;
    const zeroY = H / 2;
    const zeroSpace = H / 2;
    if (!isMenu) {
        if (ml > 0 && ml <= e.clientY) {
            mouseyglobal = ml;
            if (e.clientY < oldY && ml < zeroY + zeroSpace && ml > zeroY - zeroSpace) {
                direction = 'top';
            } else if (e.clientY > oldY && ml < zeroY + zeroSpace && ml > zeroY - zeroSpace) {
                direction = 'bottom';
            }
            // console.log(direction);
            oldY = e.clientY;
        }
    }
}


let newYbird = 0;

setInterval(() => {
    birdspeed(mouseyglobal);
    newYbird = H - mouseyglobal;
}, speedInterval());

function speedBird() {
    if (MOBILE_TYPE) {
        return 6;
    } else {
        return 4;
    }
}

function speedInterval() {
    if (MOBILE_TYPE) {
        return 10;
    } else {
        return 20;
    }
}

function birdspeed(mousey) {
    if (bird !== undefined) {
        if (bird.pos.y == mousey) return;

        if (bird.pos.y < H - 20 && direction == 'top' && bird.pos.y < newYbird) {
            bird.pos.y = bird.pos.y + speedBird();
        } else if (bird.pos.y > HEADER_LIMIT && direction == 'bottom' && bird.pos.y > newYbird) {
            bird.pos.y = bird.pos.y - speedBird();
        }
    }
}

let tremorRight = false;
let tremorTop = false;
let tcoord = 20;
setInterval(() => {
    if (bird !== undefined) {
        if (!tremorRight) {
            bird.tremorX--;
        } else if (tremorRight) {
            bird.tremorX++;
        }
        if (bird.tremorX == tcoord - 5) {
            tremorRight = true;
        } else if (bird.tremorX == tcoord) {
            let ver = Math.floor(Math.random() * Math.floor(2));
            if (ver == 1) {
                tremorRight = false;
            } else {
                tremorRight = true;
            }
        } else if (bird.tremorX == tcoord + 5) {
            tremorRight = false;
        }

        if (!tremorTop) {
            bird.tremorY--;
        } else if (tremorTop) {
            bird.tremorY++;
        }
        if (bird.tremorY == tcoord - 5) {
            tremorTop = true;
        } else if (bird.tremorY == tcoord) {
            let ver = Math.floor(Math.random() * Math.floor(2));
            if (ver == 1) {
                tremorTop = false;
            } else {
                tremorTop = true;
            }
        } else if (bird.tremorY == tcoord + 5) {
            tremorTop = false;
        }
    }
}, frameRateDigit * 2);

class Bird {
    constructor() {
        this.pos = createVector(W / 10, H / 2);
        this.vel = createVector(0, 5); //5
        this.gravity = createVector(0, GRAVITY_N); //0.5
        this.r = H / 10;
        this.speed = 10;
        this.radius = 22;

        this.x = this.pos.x;
        this.y = this.pos.y;

        this.life = 1;

        this.tremorX = tcoord;
        this.tremorY = tcoord;
    }
    show() {
        if (BulletNum === 0 || BulletNum === 1) {
            if(TEXT_ABOVE_BIRD==0) fill(255, 86, 86, 75);
            else fill(109, 255, 85, 75);
            textFont(myFont);
            textSize(12);
            textAlign(CENTER, CENTER);
            text(TEXT_ABOVE_BIRD, this.pos.x + 12 - this.tremorX, this.pos.y - this.tremorY - 32, 34, 34);
        }

        image(birdAsset, this.pos.x - this.tremorX, this.pos.y - this.tremorY, this.r + 10, this.r + 10);
    }
    update() {
        // this.vel.add(this.gravity);
        // this.pos.add(this.vel);
        this.show();
        this.move();
    }

    move() {
        this.x -= this.speed;
    }

}