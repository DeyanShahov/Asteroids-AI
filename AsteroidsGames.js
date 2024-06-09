import Constants from './constants.js';
import { Asteroid } from './entities/Asteroid.js';
import { distanceBetweenPoints } from './utils/asteroid.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// set up sound effects
//const fxExplode = new Sound('sounds/explode.m4a');
//const fxHit = new Sound('sounds/hit.m4a', 5);
//const fxLaser = new Sound('sounds/laser.m4a', 5, 0.5);
//const fxThrust = new Sound('sounds/thrust.m4a');

// set up the music
//const music = new Music('sounds/music-low.m4a', 'sounds/music-high.m4a');
let asteroidsLeft, asteroidsTotal;

// set up the game parameters
let level, lives, asteroids, score, scoreHigh, ship, text, textAlpha;

// set up event handlers
//document.addEventListener('keydown', keyDown);
//document.addEventListener('keyup', keyUp);

// set up the game loop
//setInterval(update, 1000 / Constants.FPS);


function newGame() {
    level = 0;
    lives = Constants.GAME_LIVES;
    score = 0;
    //ship = newShip();
    scoreHigh = 0;

    text = 'Level ' + (level + 1);
    textAlpha = 1.0;
    createAsteroidBelt();
    update();
}

function createAsteroidBelt() {
    asteroids = [];
    asteroidsTotal = (Constants.ROID_NUM + level) * 7;
    asteroidsLeft = asteroidsTotal;
    let x, y;
    for (let i = 0; i < Constants.ROID_NUM + level; i++) {
        // random asteroidlocation ( not touching spcaeship )
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
            //}while (distanceBetweenPoints(ship.x, ship.y, x, y) < Constants.ROID_SIZE * 2 + ship.r);
        } while (distanceBetweenPoints(110, 90, x, y) < Constants.ROID_SIZE * 2 + 15);
        const aster = new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE / 2), level);
        asteroids.push(aster);
    }
}

function update() {
    // draw space
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw the asteroids
    let a, r, x, y, offs, vert;
    for (let i = 0; i < asteroids.length; i++) {
        ctx.strokeStyle = 'slategrey';
        ctx.lineWidth = Constants.SHIP_SIZE / 20;

        // get the asteroids parameters
        a = asteroids[i].a;
        r = asteroids[i].r;
        x = asteroids[i].x;
        y = asteroids[i].y;
        offs = asteroids[i].offs;
        vert = asteroids[i].vert;

        // draw the path
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );

        // draw the polygon
        for (var j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        ctx.closePath();
        ctx.stroke();

        // show asteroid's collision circle
        if (Constants.SHOW_BOUNDING) {
            ctx.strokeStyle = 'lime';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }


    // draw the game text
    if (textAlpha >= 0) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, ' + textAlpha + ')';
        ctx.font = 'small-caps ' + Constants.TEXT_SIZE + 'px dejavu sans mono';
        ctx.fillText(text, canvas.width / 2, canvas.height * 0.75);
        textAlpha -= (1.0 / Constants.TEXT_FADE_TIME / Constants.FPS);
    }
    // } else if (ship.dead) {
    //     // after "game over" fades, start a new game
    //     newGame();
    // }

    
}


newGame();