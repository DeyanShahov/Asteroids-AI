import Constants from '../constants.js';

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

    destroy(asteroids, index) {
        const x = asteroids[index].x;
        const y = asteroids[index].y;
        const r = asteroids[index].r;

        // split the asteroid int two if necessery
        if (r === Math.ceil(Constants.ROID_SIZE / 2)) {
            // large asteroid
            asteroids.push(this.create(x, y, Math.ceil(Constants.ROID_SIZE/ 4)));
            asteroids.push(this.create(x, y, Math.ceil(Constants.ROID_SIZE/ 4)));
            //score += Constants.ROID_PTS_LGE;
        } else if (r == Math.ceil(ROID_SIZE / 4)) { 
            // medium asteroid
            asteroids.push(this.create(x, y, Math.ceil(Constants.ROID_SIZE / 8)));
            asteroids.push(this.create(x, y, Math.ceil(Constants.ROID_SIZE / 8)));
            //score += Constants.ROID_PTS_MED;
        } else {
            //score += Constants.ROID_PTS_SML;
        }

        // check high score
        if (score > scoreHigh) {
            //scoreHigh = score;
            //localStorage.setItem(Constants.SAVE_KEY_SCORE, scoreHigh);
        }

        // deastroy the asteroid
        asteroids.splice(index, 1);
        //fhHit.play();

        // calculate the ratio of remaining asteroids to determine music tempo
        //asteroidsLeft--;
        //music.setAsteroidRatio(asteroidsLeft / asteroidsTotal);
        
        // new level when no more asteroids
        // if( asteroids.length === 0) {
        //     levl++;
        //     newLevle();
        // }
    };  
}