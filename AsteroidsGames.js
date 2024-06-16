import { BattleScene } from './BattleScene.js';
import Constants from './constants.js';

const canvas = document.getElementById('gameCanvas');
canvas.width = Constants.SCREEN_WIDTH;
canvas.height = Constants.SCREEN_HEIGHT;
const ctx = canvas.getContext('2d');

const scene = new BattleScene();

scene.newGame();

setInterval(() => scene.update(canvas, ctx), 1000 / Constants.FPS);
