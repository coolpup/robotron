// ========
// Spheroid
// ========

// Spheroids spawn Enforcers.
// Spheroids (probably...) fly around quickly and randomly.

function Spheroid(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Spheroid[5];

    // Initializing speed
    this.baseSpeed = 3;
    this.velX = this.baseSpeed * util.randTrinary();
    this.velY = this.baseSpeed * util.randTrinary();
    this.tanksSpawned = 0;

    this.makeWarpParticles();
    // TODO play spawning sound?
}

Spheroid.prototype = Object.create(Enemy.prototype);
Spheroid.prototype.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
// TODO: Find a good spawn interval.
Spheroid.prototype.renderPos = {cx: this.cx, cy: this.cy};
Spheroid.prototype.maxTanks = 6;
Spheroid.prototype.constructionTime = SECS_TO_NOMINALS;

Spheroid.prototype.update = function (du) {
    this.animation += du;
    if (this.animation > SECS_TO_NOMINALS) this.animation = 0;

    spatialManager.unregister(this);

    this.constructionTime += -du;

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        Player.addScore(Player.scoreValues.Spheroid * Player.getMultiplier());
        return entityManager.KILL_ME_NOW;
    }

    if (this.isSpawning) {
        this.warpIn(du);
    } else {
        // maxTanks is effectively zero-indexed
        if (Math.random() < this.tankSpawnChance &&
            this.tanksSpawned < this.maxTanks &&
            this.constructionTime < 0) {
            this.tanksSpawned++;
            entityManager.createEnforcer(this.cx, this.cy);
            this.constructionTime = SECS_TO_NOMINALS;
        }

        this.randomWalk();

        this.capPositions();
        this.edgeBounce();

        this.cx += this.velX * du;
        this.cy += this.velY * du;

    }
    spatialManager.register(this);

};

Spheroid.prototype.randomWalk = function () {
    if (Math.random() < 0.02) {
        //2% chance to change direction

        var n = Math.floor(Math.random() * 4);
        switch (n) {
            case 0:
                this.velX = -this.baseSpeed;
                break;
            case 1:
                this.velY = -this.baseSpeed;
                break;
            case 2:
                this.velX = this.baseSpeed;
                break;
            case 3:
                this.velY = this.baseSpeed;
        }
    }
};

Spheroid.prototype.takeBulletHit = function () {
    this.kill();
    this.makeExplosion();
};

Spheroid.prototype.render = function (ctx) {
    if (this.isSpawning) {
        return;
    }

    var temp = Math.floor(8 * this.animation / SECS_TO_NOMINALS);
    if (temp > 7) temp = 7;
    g_sprites.Spheroid[temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};


Spheroid.prototype.colors = [
    {color: "red", ratio: 1}
];
