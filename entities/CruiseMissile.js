// ======
// Cruise Missile
// ======

// Cruise missiles are periodically fired by Brains

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function CruiseMissile(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.target = entityManager.findProtagonist();
}

CruiseMissile.prototype = Object.create(Enemy.prototype);

CruiseMissile.prototype.update = function (du) {

    if (this.target === null || this.target === undefined) {
        this._isDeadNow = true;
    }

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);
};

CruiseMissile.prototype.seekTarget = function () {
    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = 2;
    } else if (xOffset < 0) {
        this.velX = -2;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = 2;
    } else if (yOffset < 0) {
        this.velY = -2;
    }
	
	// TODO: Clamp velocity
};

CruiseMissile.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(25 * Player.getMultiplier()); // TODO remove magic number
};

CruiseMissile.prototype.getRadius = function () {
    return 4;
};

CruiseMissile.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = "green";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};