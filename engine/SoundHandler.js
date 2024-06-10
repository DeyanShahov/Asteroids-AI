import Constants from '../constants.js';

// set up sound effects
export const fxExplode = new Sound('sounds/explode.m4a');
export const fxHit = new Sound('sounds/hit.m4a', 5);
export const fxLaser = new Sound('sounds/laser.m4a', 5, 0.5);
export const fxThrust = new Sound('sounds/thrust.m4a');

function Sound(src, maxStreams = 1, vol = 1.0) {
    this.streamNum = 0;
    this.streams = [];
    for (var i = 0; i < maxStreams; i++) {
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }

    this.play = function() {
        if (Constants.SOUND_ON) {
            this.streamNum = (this.streamNum + 1) % maxStreams;
            this.streams[this.streamNum].play();
        }
    }

    this.stop = function() {
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    }
}