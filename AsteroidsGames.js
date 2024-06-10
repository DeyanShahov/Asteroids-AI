import { BattleScene } from './BattleScene.js';
import Constants from './constants.js';
import { registerKeyboardEvents } from './engine/InputHandler.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// set up sound effects
//const fxExplode = new Sound('sounds/explode.m4a');
//const fxHit = new Sound('sounds/hit.m4a', 5);
//const fxLaser = new Sound('sounds/laser.m4a', 5, 0.5);
//const fxThrust = new Sound('sounds/thrust.m4a');

// set up the music
//const music = new Music('sounds/music-low.m4a', 'sounds/music-high.m4a');

const scene = new BattleScene();

scene.newGame(canvas);

setInterval(() => scene.update(canvas, ctx), 1000 / Constants.FPS);
