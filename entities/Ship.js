import Constants from '../constants.js';

export class Ship {
    constructor(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.a = 90 / 180 * Math.PI; // convert to radius
        this.r = Constants.SHIP_SIZE / 2;
        this.blinkNum = Math.ceil(Constants.SHIP_INV_DUR / Constants.SHIP_BLINK_DUR);
        this.blinkTime = Math.cbrt(Constants.SHIP_BLINK_DUR * Constants.FPS);
        this.canShoot = true;
        this.dead = false;
        this.explodeTime = 0;
        this.lasers = [];
        this.rot = 0;
        this.thrusting = false;
        this.thrust = { x: 0, y: 0 };
    }

    drawShip(ctx, x, y, a, colour = "white") {
        ctx.strokeStyle = colour;
        ctx.lineWidth = Constants.SHIP_SIZE / 20;
        ctx.beginPath();
        ctx.moveTo( // nose of the ship
            x + 4 / 3 * this.r * Math.cos(a),
            y - 4 / 3 * this.r * Math.sin(a)
        );
        ctx.lineTo( // rear left
            x - this.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
            y + this.r * (2 / 3 * Math.sin(a) - Math.cos(a))
        );
        ctx.lineTo( // rear right
            x - this.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
            y + this.r * (2 / 3 * Math.sin(a) + Math.cos(a))
        );
        ctx.closePath();
        ctx.stroke();
    }

    newShip(canv) {
        return {
            x: canv.width / 2,
            y: canv.height / 2,
            a: 90 / 180 * Math.PI, // convert to radians
            r: SHIP_SIZE / 2,
            blinkNum: Math.ceil(Constants.SHIP_INV_DUR / Constants.SHIP_BLINK_DUR),
            blinkTime: Math.ceil(Constants.SHIP_BLINK_DUR * Constants.FPS),
            canShoot: true,
            dead: false,
            explodeTime: 0,
            lasers: [],
            rot: 0,
            thrusting: false,
            thrust: {
                x: 0,
                y: 0
            }
        }
    }
}