import { BattleScene } from './BattleScene.js';
import Constants from './constants.js';
import { handleAIClick, handleDebugBoxClick, handleDebugLogClick } from './utils/gameUiSetings.js';

const canvas = document.getElementById('gameCanvas');
canvas.width = Constants.SCREEN_WIDTH;
canvas.height = Constants.SCREEN_HEIGHT;
const ctx = canvas.getContext('2d');

function handleDebugBox() {
    const debugCheckbox = document.getElementById('debugBox');
    if (debugCheckbox) {
        window.addEventListener('click', () => handleDebugBoxClick(debugCheckbox));
    }
}

function handleDebugLog() {
    const debugCheckbox = document.getElementById('debugLog');
    if (debugCheckbox) {
        window.addEventListener('click', () => handleDebugLogClick(debugCheckbox));
    }
}

function handleAI() {
    const blockTypeBox = document.getElementById('ai');
    if (blockTypeBox) {
        window.addEventListener('click', () => handleAIClick(blockTypeBox));
    }
}

handleDebugBox();
handleDebugLog();
handleAI();

const scene = new BattleScene();

scene.newGame();

setInterval(() => scene.update(canvas, ctx), 1000 / Constants.FPS);


