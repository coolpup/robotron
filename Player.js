//======
//PLAYER
//======
/*

An object which contains all the important parameters of the player such as
the score, remaining lives and the current level number.

Well, that's what it started as. Now it also contains the power up methods
and effects, and the score values as well as rendering the scorebar...

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Player() {

};

Player.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};

Player.prototype.level = 1;
Player.prototype.lives = 5;
Player.prototype.multiplier = 1;
Player.prototype.score = 0;
Player.prototype.saveCount = 0;
Player.prototype.speed = 3;
Player.prototype.speedTimer = 10 * SECS_TO_NOMINALS;
Player.prototype.fireRate = 20;
Player.prototype.ammo = 0;
Player.prototype.hasShotgun = false;
Player.prototype.hasMachineGun = false;
Player.prototype.shieldTime = 0;
Player.prototype.powerupTime = 1 * SECS_TO_NOMINALS;
Player.prototype.powerupText = "";
Player.prototype.colorCounter = 0;
Player.prototype.scoreValues = {
    Electrode: 5,
    Spark: 25,
    Shell: 50,
    CruiseMissile: 75,
    Prog: 100,
    Grunt: 100,
    Enforcer: 200,
    Tank : 300,
    Brain: 500,
    Spheroid: 1000,
    Quark: 1000,
    Family: 1000,
    Powerup: 300
};

// -------------
// Basic Methods

Player.prototype.resetAll = function() {
    this.resetLives();
    this.resetLevel();
    this.resetScore();
    this.resetSpeed();
    this.resetSpeedTimer();
    this.resetMultiplier();
    this.resetFireRate();
    this.resetAmmo();
    this.resetShield();
    this.resetShieldTime();
};

Player.prototype.render = function(ctx) {
    ctx.save();
	
	// Display score bar
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, ctx.canvas.width, consts.wallTop);
	
	// Display the score
    ctx.lineWidth = 1.5;
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    var scoretxt = "Score: " + this.score;
    ctx.fillText(scoretxt, 5, 20);

    //display the multiplier and the level
    var disp = "X" + this.multiplier + "  Level: " + this.level;
    ctx.fillText(disp, g_canvas.width/2 - 140, 20);
    
    // Display ammo
    var text = "Ammo: " + this.ammo;
    ctx.fillText(text, g_canvas.width/2, 20);
    
    // Display shield
    var moretxt = "Shield: " + Math.ceil(this.shieldTime / SECS_TO_NOMINALS);
    ctx.fillText(moretxt, g_canvas.width/2 + 130, 20);

    // Display remaining lives
    for (var i = 1; i < this.lives; i++) {
        g_sprites.Extralife.drawCentredAt(ctx, 
                                          g_canvas.width - i*20, 
                                          15, 
                                          0
										 );
    };

	// Display border
	ctx.fillStyle = consts.colors[this.colorCounter%consts.colors.length];
	ctx.fillRect(0, consts.wallTop, ctx.canvas.width, consts.wallThickness);
	ctx.fillRect(0, consts.wallTop, consts.wallLeft, g_canvas.height - consts.wallTop);
	ctx.fillRect(0, consts.wallBottom, g_canvas.width, consts.wallThickness);
	ctx.fillRect(consts.wallRight, consts.wallTop, consts.wallThickness, g_canvas.height - consts.wallTop);
	
    ctx.restore();
};


// ---------------------------
// General attribute modifiers

Player.prototype.addLevel = function () {
    this.level += 1;
    if (this.level > 255) this.level = 1;
};

Player.prototype.subtractLevel = function () {
    this.level += -1;
};

Player.prototype.resetLevel = function () {
    this.level = 1;
};

Player.prototype.getLevel = function () {
    return this.level;
};

Player.prototype.addScore = function (score) {
    this.score += score;
};

Player.prototype.resetScore = function () {
    this.score = 0;
};

Player.prototype.getScore = function () {
    return this.score;
};

Player.prototype.addLives = function () {
    this.lives += 1;
    if (this.lives > 8) this.lives = 8;
};

Player.prototype.subtractLives = function () {
    if(this.lives > 0) this.lives += -1;
};

Player.prototype.resetLives = function () {
    this.lives = 5;
};

Player.prototype.getLives = function () {
    return this.lives;
};


// --------------
// Rescue Methods

Player.prototype.addMultiplier = function () {
    if (this.multiplier < 5) {
        this.multiplier += 1;
    }
};

Player.prototype.resetMultiplier = function () {
    this.multiplier = 1;
};

Player.prototype.getMultiplier = function () {
    return this.multiplier;
};

Player.prototype.addSaveCount = function () {
    // This function gives an extra life
    // when you have saved 7 family members
    this.saveCount += 1;
    if (this.saveCount > 6) {
        this.addLives();
        this.resetSaveCount();
    }
};

Player.prototype.resetSaveCount = function () {
    this.saveCount = 0;
};


// ---------------
// Speed Methods

Player.prototype.addSpeed = function () {
    this.resetSpeedTimer();
    if (this.speed < 5) this.speed = 5;
};

Player.prototype.getSpeed = function () {
    return this.speed;
};

Player.prototype.tickSpeedTimer = function (du) {
    this.speedTimer += -du;
    if (this.speedTimer < 0) {
        this.resetSpeed();
        this.resetSpeedTimer();
    }
};

Player.prototype.resetSpeed = function () {
    this.speed = 2;
}

Player.prototype.resetSpeedTimer = function () {
    this.speedTimer = 10 * SECS_TO_NOMINALS;
};


// --------------
// Shield Methods

Player.prototype.getShieldTime = function () {
    return this.shieldTime;
};

Player.prototype.setShieldTime = function (time) {
    this.shieldTime = time * SECS_TO_NOMINALS;
};

Player.prototype.addShieldTime = function() {
    this.activateShield();
    this.shieldTime += 20 * SECS_TO_NOMINALS;
    if (this.shieldTime > 60 * SECS_TO_NOMINALS) {
        this.setShieldTime(60);
    };
};

Player.prototype.tickShieldTime = function (du) {
    this.shieldTime += -du;
    if (this.shieldTime < 0) {
        this.resetShield();
        this.resetShieldTime();
    }
};

Player.prototype.activateShield = function () {
    g_canBeKilled = false;
};

Player.prototype.resetShield = function () {
    g_canBeKilled = true;
};

Player.prototype.resetShieldTime = function () {
    this.shieldTime = 0;
}


// -------------------
// Gun Methods

Player.prototype.getFireRate = function () {
    return this.fireRate;
};

Player.prototype.setFireRate = function (fireRate) {
    this.fireRate = fireRate;
};

Player.prototype.resetFireRate = function () {
    this.fireRate = 20;
    this.hasShotgun = false;
    this.hasMachineGun = false;
};

Player.prototype.getAmmo = function () {
    return this.ammo;
};

Player.prototype.setAmmo = function (ammo) {
    this.ammo = ammo;
};

Player.prototype.subtractAmmo = function () {
    if (this.ammo > 0) this.ammo += -1;
    if (this.ammo < 1) this.resetFireRate();
};

Player.prototype.addAmmo = function (ammo) {
    this.ammo += ammo;
    if (this.ammo > 500) this.setAmmo(500);
};

Player.prototype.resetAmmo = function () {
    this.ammo = 0;
};


// -------------------
// Powerup text animation Methods

Player.prototype.setPowerupText = function (str) {
    this.powerupText = str;
}

Player.prototype.getPowerupText = function () {
    if(this.powerupText==undefined)
        return "";
    return this.powerupText;
}

Player.prototype.setPowerupTime = function () {
    this.powerupTime = 1 * SECS_TO_NOMINALS;
};

Player.prototype.getPowerupTime = function () {
    return this.powerupTime;
};

Player.prototype.tickPowerupTime = function (du) {
    if (this.powerupTime < 0) return;
    this.powerupTime += -du;
};

Player.prototype.tickColorCounter = function (du) {
    this.colorCounter++;
}