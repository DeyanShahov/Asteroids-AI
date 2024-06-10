import Constants from '../constants.js';

// set up the music
export const music = new Music('sounds/music-low.m4a', 'sounds/music-high.m4a');

function Music(srcLow, srcHigh) {
    this.soundLow = new Audio(srcLow);
    this.soundHigh = new Audio(srcHigh);
    this.low = true;
    this.tempo = 1.0; // seconds per beat
    this.beatTime = 0; // frames left until next beat

    this.play = function() {
        if (Constants.MUSIC_ON) {
            if (this.low) {
                this.soundLow.play();
            } else {
                this.soundHigh.play();
            }
            this.low = !this.low;
        }
    }

    this.setAsteroidRatio = function(ratio) {
        this.tempo = 1.0 - 0.75 * (1.0 - ratio);
    }

    this.tick = function() {
        if (this.beatTime == 0) {
            this.play();
            this.beatTime = Math.ceil(this.tempo * Constants.FPS);
        } else {
            this.beatTime--;
        }
    }
}