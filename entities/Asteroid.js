import Constants from '../constants.js';
import { fxHit } from '../engine/SoundHandler.js';

export class Asteroid {
    constructor(asteroidX, asteroidY, asteroidRadius, gameLevel) {
        const lvlMulti = 1 + 0.1 * gameLevel;
        this.x = asteroidX;
        this.y = asteroidY;
        this.xv = getSpeedForAsteroid(lvlMulti);
        this.yv = getSpeedForAsteroid(lvlMulti);
        this.a = Math.random() * Math.PI * 2; // in radians
        this.r = asteroidRadius;
        this.vectorEndPoint = { x: 0, y: 0 };
        this.offs = [];
        this.vert = Math.floor(Math.random() * (Constants.ROID_VERT + 1) + Constants.ROID_VERT / 2);
        // populate the offsets array
        for (let i = 0; i < this.vert; i++) {
            this.offs.push(Math.random() * Constants.ROID_JAG * 2 + 1 - Constants.ROID_JAG);
        }
    }


    drawAsteroidVector(ctx, dangerous = false) {
        // Line color ant thickness
        ctx.strokeStyle = dangerous ? '#FFCCCB' : 'blue';
        ctx.lineWidth = 1;

        ctx.beginPath(); // Starting a new path

        ctx.moveTo(this.x, this.y); // Starting point - the center of the asteroid

        // Calculate the end point of the vactor to the end of the screen
        this.vectorEndPoint = this.calculateEndPointToBoundary(this.x, this.y, this.xv, this.yv, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);

        ctx.lineTo(this.vectorEndPoint.x, this.vectorEndPoint.y); // End point

        ctx.closePath();

        ctx.save();

        ctx.setLineDash([8, 8]);  // Create a hatched effect    
        ctx.lineWidth = 1;

        ctx.stroke(); // Draw the line

        ctx.restore();
    };

    calculateEndPointToBoundary(x, y, xv, yv, canvasWidth, canvasHeight) {
        let tMin = Infinity;
        let endX = x;
        let endY = y;

        // Checking for intersection with the right boundary
        if (xv > 0) {
            const t = (canvasWidth - x) / xv;
            if (t < tMin) {
                tMin = t;
                endX = canvasWidth;
                endY = y + yv * t;
            }
        }

        // Checking for intersection with the left boundary
        if (xv < 0) {
            const t = -x / xv;
            if (t < tMin) {
                tMin = t;
                endX = 0;
                endY = y + yv * t;
            }
        }

        // Check for intersection with the lower bound
        if (yv > 0) {
            const t = (canvasHeight - y) / yv;
            if (t < tMin) {
                tMin = t;
                endY = canvasHeight;
                endX = x + xv * t;
            }
        }

        // Check for intersection with the upper bound
        if (yv < 0) {
            const t = -y / yv;
            if (t < tMin) {
                tMin = t;
                endY = 0;
                endX = x + xv * t;
            }
        }

        return { x: endX, y: endY };
    }

    destroy(asteroids, index, gameLevel) {
        const x = asteroids[index].x;
        const y = asteroids[index].y;
        const r = asteroids[index].r;

        let scoreTemp = 0;

        // split the asteroid int two if necessery
        if (r === Math.ceil(Constants.ROID_SIZE / 2)) {
            // large asteroid
            asteroids.push(new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE / 4), gameLevel));
            asteroids.push(new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE / 4), gameLevel));
            scoreTemp += Constants.ROID_PTS_LGE;
        } else if (r === Math.ceil(Constants.ROID_SIZE / 4)) {
            // medium asteroid
            asteroids.push(new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE / 8), gameLevel));
            asteroids.push(new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE / 8), gameLevel));
            scoreTemp += Constants.ROID_PTS_MED;
        } else {
            scoreTemp += Constants.ROID_PTS_SML;
        }

        // deastroy the asteroid
        asteroids.splice(index, 1);
        fxHit.play();

        return scoreTemp;
    };
}


function getSpeedForAsteroid(lvlMulti) {
    let speed = Math.random() * Constants.ROID_SPD * lvlMulti / Constants.FPS;
    if (speed <= 0.2) speed = 0.2;
    speed = speed * (Math.random() < 0.5 ? 1 : -1);
    return speed;
}