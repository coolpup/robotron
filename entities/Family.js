// ======
// FAMILY
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Family(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.Dad[6];
    // Make a noise when I am created
    //this.exampleSound.play();
}

Family.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Family.prototype.deadSound = new Audio(g_audioUrls.familydead);
Family.prototype.savedSound = new Audio(g_audioUrls.familypick);

// Initial, inheritable, default values
Family.prototype.rotation = 0;
Family.prototype.cx = 100;
Family.prototype.cy = 100;
Family.prototype.velX = 0;
Family.prototype.velY = 0;
Family.prototype.panic = 1;
Family.prototype.lifeSpan = 1 * SECS_TO_NOMINALS;
Family.prototype.isDying = false;
Family.prototype.renderPos = {cx: this.cx, cy: this.cy};
Family.prototype.willSpawnProg = false;

Family.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	if (!this.startPos) this.startPos = this.getPos();
	
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    if (this.isDying) {
		if (!this.died) {
			this.deadSound.currentTime = 0;
			this.died = true;
		}
		if (g_sounds) this.deadSound.play();
        this.lifeSpan += -du;
        if (this.lifeSpan <= 0) {
            if(this.willSpawnProg){
                entityManager.createProg(this.cx,this.cy);
            }
            this.kill();
        }
    } else {
        if (Math.random() < 0.01 && this.panic < 3) {
            this.panic += 0.1;
        }
        this.randomWalk();

        this.capPositions();
        //TODO: Make them less likely to change direction after bouncing?
        this.edgeBounce();
        this.cx += this.velX * du;
        this.cy += this.velY * du;

        // Handle collisions
        var hitEntity = this.findHitEntity();
        if (hitEntity) {
            if (hitEntity.makesProgs){
                this.willSpawnProg = true;
            }
            var canKillMe = hitEntity.killFamily;
            if (canKillMe) {
                this.takeChaserHit();
            }
        }

        spatialManager.register(this);
    }
};

Family.prototype.randomWalk = function () {
    if (Math.random() < 0.02 * this.panic) {
        //2% chance to change direction

        var n = Math.floor(Math.random() * 4);
        switch (n) {
            case 0:
                this.velX = -0.3 * this.panic;
                break;
            case 1:
                this.velY = -0.3 * this.panic;
                break;
            case 2:
                this.velX = 0.3 * this.panic;
                break;
            case 3:
                this.velY = 0.3 * this.panic;
        }
    }
};

Family.prototype.takeChaserHit = function () {
    this.isDying = true;
};

Family.prototype.takeProtagonistHit = function () {
    // I'm Saved!!!
    Player.addScore(Player.scoreValues.Family * Player.getMultiplier());
    entityManager.createScoreImg({
        cx: this.cx,
        cy: this.cy,
        m: Player.getMultiplier()});
    Player.addMultiplier();
    Player.addSaveCount();
	this.savedSound.currentTime = 0;
	if (g_sounds) this.savedSound.play();
    this.kill();
};

Family.prototype.takeBulletHit = function () {
    this.isDying = true;
};

Family.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Family.prototype.render = function (ctx) {
    if (this.isDying) {
        g_sprites.Skull.drawCentredAt(ctx,
            this.cx,
            this.cy,
            this.rotation);
    } else {
        var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
        var angle = util.angleTo(this.renderPos.cx, this.renderPos.cy, this.cx, this.cy);
        var PI = Math.PI;
        var facing = 3; // right
        if(angle > PI*1/4) facing = 6; //down
        if(angle > PI*3/4) facing = 0; //left
        if(angle > PI*5/4) facing = 9; //up
        if(angle > PI*7/4) facing = 3; //right

        switch(true) {
            case distSq<3*3:
                g_sprites.Dad[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
                break;
            case distSq<6*6:
                g_sprites.Dad[facing+1].drawCentredAt(ctx, this.cx, this.cy, 0);
                break;
            case distSq<9*9:
                g_sprites.Dad[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
                break;
            case distSq<12*12:
                g_sprites.Dad[facing+2].drawCentredAt(ctx, this.cx, this.cy, 0);
                break;
            default:
                this.renderPos = {cx: this.cx, cy: this.cy};
                g_sprites.Dad[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
        }
    }
};
