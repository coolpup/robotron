// ======
// Brain
// ======

// Brains launch seeking cruise missiles
// Brains turn family members into Progs

function Brain(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.Brain[6];
}

Brain.prototype = Object.create(Enemy.prototype);

Brain.prototype = Object.create(Enemy.prototype);
Brain.prototype.timeSinceHit = Infinity;
Brain.prototype.killFamily = true;
Brain.prototype.startPos = {cx: this.cx, cy: this.cy};
Brain.prototype.missileFireChance = 0.005; // 0.5% chance of firing a CM per update
// TODO: Find a good firing interval for the missiles.

Brain.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    if(Math.random() < this.missileFireChance) {
        entityManager.fireCruiseMissile(this.cx,this.cy);
    }

    // Move, unless the Hulk has been shot in the last 1 second.
    this.timeSinceHit += du;
    if (this.timeSinceHit > SECS_TO_NOMINALS * 1) {
        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();
    }

    spatialManager.register(this);
};


Brain.prototype.seekTarget = function () {

    this.findTarget();
    if (this.target === null || this.target === undefined) {
        return; // Escaping empty-field conditions that can occur in testing
    }

    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = 0.5;
    } else if (xOffset < 0) {
        this.velX = -1;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = 1;
    } else if (yOffset < 0) {
        this.velY = -0.5;
    }

    // Clamp vel to 1 pixel moving radius
    if (xOffset !== 0 && yOffset !== 0) {
        this.velX *= Math.cos(Math.PI / 4);
        this.velY *= Math.sin(Math.PI / 4);
    }
};

Brain.prototype.findTarget = function () {
    // Brains prefer family members.
    this.target = entityManager.findClosestFamilyMember(this.cx,this.cy);
    if (this.target === null || this.target === undefined) {
        this.target = entityManager.findProtagonist();
    }
};

Brain.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(Player.scoreValues.Brain * Player.getMultiplier());
};

Brain.prototype.render = function (ctx) {
    var distSq = util.distSq(
                             this.cx, 
                             this.cy, 
                             this.startPos.cx, 
                             this.startPos.cy);
    var PI = Math.PI;
    if(distSq === 0){
        var angle = 0;
    }else{
        var angle = util.wrapRange(
                                   util.angleTo(
                                                this.startPos.cx, 
                                                this.startPos.cy, 
                                                this.cx, 
                                                this.cy),
                                   0,
                                   2*PI);
    }
    var facing = 3; // right
    if(angle > PI*1/4) facing = 6; //down
    if(angle > PI*3/4) facing = 0; //left
    if(angle > PI*5/4) facing = 9; //up
    if(angle > PI*7/4) facing = 3; //right

    switch(true) {
        case distSq<3*3:
            g_sprites.Brain[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<6*6:
            g_sprites.Brain[facing+1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<9*9:
            g_sprites.Brain[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<12*12:
            g_sprites.Brain[facing+2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            this.startPos = {cx: this.cx, cy: this.cy};
            g_sprites.Brain[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
    }
};