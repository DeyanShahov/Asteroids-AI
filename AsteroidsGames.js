import { BattleScene } from './BattleScene.js';
import Constants from './constants.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');





const scene = new BattleScene();

scene.newGame(canvas);

setInterval(() => scene.update(canvas, ctx), 1000 / Constants.FPS);
