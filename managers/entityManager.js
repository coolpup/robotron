/*

 entityManager.js

 A module which handles arbitrary entity-management for "Robotron"


 We create this module as a single global object, and initialise it
 with suitable 'data' and 'methods'.

 "Private" properties are denoted by an underscore prefix convention.

 */


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

    _protagonists: [],
	_family: [],
	_enemies: [],
	_bullets: [],
	
	_bulletFrameCounter: 12,

// "PRIVATE" METHODS

    _generateThings: function () {
        //TODO: Generate some
		for (var i = 0; i < 10; i++)
			this.createGrunt();
		this.createFamily();
		this.createFamily();
		this.createFamily();
    },

    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
    KILL_ME_NOW: -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
    deferredSetup: function () {
        this._categories = [
			this._protagonists, 
			this._bullets, 
			this._family, 
			this._enemies
		];
    },

    init: function () {
        this._generateThings();
    },

    createProtagonist: function (descr) {
        this._protagonists.push(new Protagonist(descr));
    },
	
	fire: function (aimX, aimY) {
		if (this._bulletFrameCounter !== 12) {
			this._bulletFrameCounter++;
			return;
		}
		
		for (var i in this._protagonists) {
			
            var pos = this._protagonists[i].getPos();
            var dirn = util.angleTo(pos.cx, pos.cy, aimX, aimY);
            
            var launchdist = this._protagonists[i].getRadius() * 0.5;
            
            var dirnX = Math.cos(dirn);
            var dirnY = Math.sin(dirn);
            
            this.fireBullet(pos.cx + launchdist * dirnX, 
                            pos.cy + launchdist * dirnY, 
                            dirnX, 
                            dirnY);
		}
		this._bulletFrameCounter = 0;
	},
	
	fireBullet: function(cx, cy, dirnX, dirnY) {
		this._bullets.push(new Bullet({
			cx   : cx,
			cy   : cy,
			dirnX : dirnX,
			dirnY : dirnY
		}));
	},
	
	findProtagonist: function () {
		var p = Math.floor(util.randRange(
					0, 
					this._protagonists.length)
		);
		return this._protagonists[p];
	},

    createGrunt: function () {
        var playerSafeDist = 120;
		var descr;
        for (var i = 0; i < 100; i++) {
            var x = util.randRange(0, g_canvas.width);
            var y = util.randRange(0, g_canvas.height);
			
			var locationFound = true;
			
			for (var i in this._protagonists) {
				var pPos = this._protagonists[i].getPos();
				var distSq = util.distSq(x, y, pPos.cx, pPos.cy);
				if (distSq < util.square(playerSafeDist))
					locationFound = false;
			}
			
			if (!locationFound) continue;
			
            descr = {
                cx: x,
                cy: y
            };
			break;
        }
        this._enemies.push(new Grunt(descr));
    },

    createFamily: function () {

		var x = util.randRange(0, g_canvas.width);
        var y = util.randRange(0, g_canvas.height);

        var descr = {
			cx: x,
			cy: y
		};
        this._family.push(new Family(descr));
    },

    update: function (du) {

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
        }
    },

    render: function (ctx) {

        var debugX = 10, debugY = 100;

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);

            }
            debugY += 10;
        }
    }

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

