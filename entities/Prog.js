// ======
// Progs
// ======

// Progs are spawned when a Brain kills a family member.
// Progs walk around randomly, killing the protagonist if encountered.

function Prog(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Prog;
    this.target = entityManager.findProtagonist();
    // TODO play spawning sound?
}

Prog.prototype = Object.create(Enemy.prototype);
Prog.prototype.panic = 5;
Prog.prototype.renderPos = {cx: this.cx, cy: this.cy};

Prog.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (Math.random() < 0.01 && this.panic < 3) {
        this.panic += 0.1;
    }
    this.randomWalk();

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);

};

Prog.prototype.randomWalk = function () {
    if (Math.random() < 0.01 * this.panic) {
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

Prog.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.Prog * Player.getMultiplier());
};

// Overriding from Enemy.
// Prog sprites are very tall, default implementation does not
// give an accurate bounding circle.
Prog.prototype.getRadius = function () {
    return (this.sprite.height / 2) * 0.9;
};

Prog.prototype.render = function (ctx) {
    g_sprites.Prog.drawCentredAt(ctx, this.cx, this.cy, 0);
};