import Constants from '../constants.js';
import { fxHit } from '../engine/SoundHandler.js';

export class Asteroid {
    constructor(asteroidX, asteroidY, asteroidRadius, gameLevel) {
        const lvlMulti = 1 + 0.1 * gameLevel;
        this.x = asteroidX;
        this.y = asteroidY;
        this.xv = Math.random() * Constants.ROID_SPD * lvlMulti / Constants.FPS * (Math.random() < 0.5 ? 1 : -1);
        this.yv = Math.random() * Constants.ROID_SPD * lvlMulti / Constants.FPS * (Math.random() < 0.5 ? 1 : -1);
        this.a = Math.random() * Math.PI * 2; // in radians
        this.r = asteroidRadius;
        this.offs = [];
        this.vert = Math.floor(Math.random() * (Constants.ROID_VERT + 1) + Constants.ROID_VERT / 2);
        
        // populate the offsets array
        for (let i = 0; i < this.vert; i++) {
            this.offs.push(Math.random() * Constants.ROID_JAG * 2 + 1 - Constants.ROID_JAG);
        }
    }

    destroy(asteroids, index, gameLevel) {
        const x = asteroids[index].x;
        const y = asteroids[index].y;
        const r = asteroids[index].r;

        let scoreTemp = 0;

        // split the asteroid int two if necessery
        if (r === Math.ceil(Constants.ROID_SIZE / 2)) {
            // large asteroid
            asteroids.push(new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE/ 4), gameLevel));
            asteroids.push(new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE/ 4), gameLevel));
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