import Constants from './constants.js';
import { registerKeyboardEvents } from './engine/InputKeyboardHandler.js';
import { music } from './engine/MusicHandler.js';
import { fxThrust } from './engine/SoundHandler.js';
import { Asteroid } from './entities/Asteroid.js';
import { Ship } from './entities/Ship.js';
import { distanceBetweenPoints } from './utils/asteroid.js';
import { checkScoreHigh } from './utils/game.js';
import { pollGamepads, registerGamepadEvents } from './engine/InputGamepadHandler.js';
import { neuralNetworkTrein, predictionOfNetwork } from './utils/nNetwork.js';
import { aiPlay } from './utils/nNetworkPlay.js';

export class BattleScene {
    asteroids = [];
    level = 0;
    lives = 0;
    score = 0;
    scoreHigh = 0;
    ship = undefined;
    text = '';
    textAlpha = 0;;

    asteroidsLeft = 0;
    asteroidsTotal = 0;

    //aiShootTime = 0;

    constructor() {

    }

    newGame(canvas) {
        this.level = 0;
        this.lives = Constants.GAME_LIVES;
        this.score = 0;
        this.ship = new Ship(canvas);
        this.scoreHigh = 0;

        // set up event handlers
        registerKeyboardEvents(this.ship);
        registerGamepadEvents();

        // get the high score from local storage
        let scoreStr = localStorage.getItem(Constants.SAVE_KEY_SCORE);
        if (scoreStr === null) {
            this.scoreHigh = 0;
        } else {
            this.scoreHigh = parseInt(scoreStr);
        }

        // SET UP THE NEURAL NETWORK!!!  
        if (Constants.AUTOMATION_ON) neuralNetworkTrein(this.ship);

        // reset asteroid count before load new game
        this.asteroids = [];

        this.newLevel(canvas);
    }

    conditionForNewLevel(asteroidsLength, canvas) {
        if (asteroidsLength === 0) {
            this.level++;
            this.newLevel(canvas);
        }
    }

    newLevel(canvas) {
        music.setAsteroidRatio(1);
        this.text = 'Level ' + (this.level + 1);
        this.textAlpha = 1.0;
        this.createAsteroidBelt(canvas);
    }

    gameOver() {
        this.ship.dead = true;
        this.text = 'Game Over';
        this.textAlpha = 1.0;
    }

    createAsteroidBelt(canvas) {
        this.asteroidsTotal = (Constants.ROID_NUM + this.level) * 7;
        this.asteroidsLeft = this.asteroidsTotal;

        let x, y;
        for (let i = 0; i < Constants.ROID_NUM + this.level; i++) {
            // random asteroidlocation ( not touching spcaeship )
            do {
                x = Math.floor(Math.random() * canvas.width);
                y = Math.floor(Math.random() * canvas.height);
            } while (distanceBetweenPoints(this.ship.x, this.ship.y, x, y) < Constants.ROID_SIZE * 2 + this.ship.r);
            const aster = new Asteroid(x, y, Math.ceil(Constants.ROID_SIZE / 2), this.level);
            this.asteroids.push(aster);
        }
    }

    update(canvas, ctx) {
        pollGamepads(this.ship);

        let blinkOn = this.ship.blinkNum % 2 === 0;
        let exploding = this.ship.explodeTime > 0;

        // use the neural network to rotate the ship and shoot
        if (Constants.AUTOMATION_ON) {
            // make a prediction based on current data
            let predict = predictionOfNetwork(this.ship, this.asteroids);

            // comand ship based on the prediction
            aiPlay(predict, this.ship);
        }

        // tick the music
        music.tick();

        // draw space
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw the asteroids
        let a, r, x, y, offs, vert;
        for (let i = 0; i < this.asteroids.length; i++) {
            ctx.strokeStyle = 'slategrey';
            ctx.lineWidth = Constants.SHIP_SIZE / 20;

            // get the asteroids properties
            a = this.asteroids[i].a;
            r = this.asteroids[i].r;
            x = this.asteroids[i].x;
            y = this.asteroids[i].y;
            offs = this.asteroids[i].offs;
            vert = this.asteroids[i].vert;

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


        // thrust the ship
        if (this.ship.thrusting && !this.ship.dead) {
            this.ship.thrust.x += Constants.SHIP_THRUST * Math.cos(this.ship.a) / Constants.FPS;
            this.ship.thrust.y -= Constants.SHIP_THRUST * Math.sin(this.ship.a) / Constants.FPS;
            fxThrust.play();

            // draw the thruster
            if (!exploding && blinkOn) {
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = Constants.SHIP_SIZE / 10;
                ctx.beginPath();
                ctx.moveTo( // rear left
                    this.ship.x - this.ship.r * (2 / 3 * Math.cos(this.ship.a) + 0.5 * Math.sin(this.ship.a)),
                    this.ship.y + this.ship.r * (2 / 3 * Math.sin(this.ship.a) - 0.5 * Math.cos(this.ship.a))
                );
                ctx.lineTo( // rear centre (behind the ship)
                    this.ship.x - this.ship.r * 5 / 3 * Math.cos(this.ship.a),
                    this.ship.y + this.ship.r * 5 / 3 * Math.sin(this.ship.a)
                );
                ctx.lineTo( // rear right
                    this.ship.x - this.ship.r * (2 / 3 * Math.cos(this.ship.a) - 0.5 * Math.sin(this.ship.a)),
                    this.ship.y + this.ship.r * (2 / 3 * Math.sin(this.ship.a) + 0.5 * Math.cos(this.ship.a))
                );
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        } else {
            // apply friction (slow the ship down when not thrusting)
            this.ship.thrust.x -= Constants.FRICTION * this.ship.thrust.x / Constants.FPS;
            this.ship.thrust.y -= Constants.FRICTION * this.ship.thrust.y / Constants.FPS;
            fxThrust.stop();
        }

        // draw the triangular ship
        if (!exploding) {
            if (blinkOn && !this.ship.dead) {
                this.ship.drawShip(ctx, this.ship.x, this.ship.y, this.ship.a);
            }

            // handle blinking
            if (this.ship.blinkNum > 0) {

                // reduce the blink time
                this.ship.blinkTime--;

                // reduce the blink num
                if (this.ship.blinkTime !== 0) {
                    this.ship.blinkTime = Math.ceil(Constants.SHIP_BLINK_DUR * Constants.FPS);
                    this.ship.blinkNum--;
                }
            }
        } else {
            // draw the explosion (concentric circles of different colours)
            ctx.fillStyle = 'darkred';
            ctx.beginPath();
            ctx.arc(this.ship.x, this.ship.y, this.ship.r * 1.7, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.ship.x, this.ship.y, this.ship.r * 1.4, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(this.ship.x, this.ship.y, this.ship.r * 1.1, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.ship.x, this.ship.y, this.ship.r * 0.8, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.ship.x, this.ship.y, this.ship.r * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
        }

        // show ship's collision circle
        if (Constants.SHOW_BOUNDING) {
            ctx.strokeStyle = 'lime';
            ctx.beginPath();
            ctx.arc(this.ship.x, this.ship.y, this.ship.r, 0, Math.PI * 2, false);
            ctx.stroke();
        }

        // show ship's centre dot
        if (Constants.SHOW_CENTRE_DOT) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.ship.x - 1, this.ship.y - 1, 2, 2);
        }

        // draw the lasers
        for (let i = 0; i < this.ship.lasers.length; i++) {
            if (this.ship.lasers[i].explodeTime === 0) {
                ctx.fillStyle = 'salmon';
                ctx.beginPath();
                ctx.arc(this.ship.lasers[i].x, this.ship.lasers[i].y, Constants.SHIP_SIZE / 15, 0, Math.PI * 2, false);
                ctx.fill();
            } else {
                // draw the eplosion
                ctx.fillStyle = 'orangered';
                ctx.beginPath();
                ctx.arc(this.ship.lasers[i].x, this.ship.lasers[i].y, this.ship.r * 0.75, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.fillStyle = 'salmon';
                ctx.beginPath();
                ctx.arc(this.ship.lasers[i].x, this.ship.lasers[i].y, this.ship.r * 0.5, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.fillStyle = 'pink';
                ctx.beginPath();
                ctx.arc(this.ship.lasers[i].x, this.ship.lasers[i].y, this.ship.r * 0.25, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }


        // draw the game text
        if (this.textAlpha >= 0) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this.textAlpha + ')';
            ctx.font = 'small-caps ' + Constants.TEXT_SIZE + 'px dejavu sans mono';
            ctx.fillText(this.text, canvas.width / 2, canvas.height * 0.75);
            this.textAlpha -= (1.0 / Constants.TEXT_FADE_TIME / Constants.FPS);
        } else if (this.ship.dead) {
            // after "game over" fades, start a new game
            this.newGame(canvas);
        }

        // draw the lives
        let lifeColour;
        for (let i = 0; i < this.lives; i++) {
            lifeColour = exploding && i === this.lives - 1 ? 'red' : 'white';
            this.ship.drawShip(ctx, Constants.SHIP_SIZE + i * Constants.SHIP_SIZE * 1.2, Constants.SHIP_SIZE, 0.5 * Math.PI, lifeColour);
        }

        // draw the score
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.font = Constants.TEXT_SIZE + 'px dejavu sans mono';
        ctx.fillText(this.score, canvas.width - Constants.SHIP_SIZE / 2, Constants.SHIP_SIZE);


        // draw the high score
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.font = (Constants.TEXT_SIZE * 0.75) + 'px dejavu sans mono';
        ctx.fillText('BEST ' + this.scoreHigh, canvas.width / 2, Constants.SHIP_SIZE);


        // detect laser hits on asteroids
        let ax, ay, ar, lx, ly;
        for (let i = this.asteroids.length - 1; i >= 0; i--) {

            // grab the asteroid properties
            ax = this.asteroids[i].x;
            ay = this.asteroids[i].y;
            ar = this.asteroids[i].r;

            // loop over the lasers
            for (let j = this.ship.lasers.length - 1; j >= 0; j--) {

                // grab the laser properties
                lx = this.ship.lasers[j].x;
                ly = this.ship.lasers[j].y;

                // detect hits
                if (this.ship.lasers[j].explodeTime == 0 && distanceBetweenPoints(ax, ay, lx, ly) < ar) {

                    // destroy the asteroid and activate the laser explosion
                    this.score += this.asteroids[i].destroy(this.asteroids, i, this.level);
                    this.ship.lasers[j].explodeTime = Math.ceil(Constants.LASER_EXPLODE_DUR * Constants.FPS);

                    // set high score
                    this.scoreHigh = checkScoreHigh(this.score, this.scoreHigh);
                    // new level when no more asteroids
                    this.conditionForNewLevel(this.asteroids.length, canvas);
                    // calculate the ratio of remaining asteroids to determine music tempo
                    this.asteroidsLeft--;
                    music.setAsteroidRatio(this.asteroidsLeft / this.asteroidsTotal);
                    break;
                }
            }
        }

        // check for asteroid collisions (when not exploding)
        if (!exploding) {

            // only check when not blinking
            if (this.ship.blinkNum === 0 && !this.ship.dead) {
                for (let i = 0; i < this.asteroids.length; i++) {
                    if (distanceBetweenPoints(this.ship.x, this.ship.y, this.asteroids[i].x, this.asteroids[i].y) < this.ship.r + this.asteroids[i].r) {
                        this.ship.explodeShip();
                        this.score += this.asteroids[i].destroy(this.asteroids, i, this.level);

                        // set high score
                        this.scoreHigh = checkScoreHigh(this.score, this.scoreHigh);
                        // new level when no more asteroids
                        this.conditionForNewLevel(this.asteroids.length, canvas);
                        // calculate the ratio of remaining asteroids to determine music tempo
                        this.asteroidsLeft--;
                        music.setAsteroidRatio(this.asteroidsLeft / this.asteroidsTotal);
                        break;
                    }
                }
            }

            // rotate the ship
            this.ship.a += this.ship.rot;

            // keep the angle between 0 and 360 ( two PI)
            if (this.ship.a < 0) {
                this.ship.a += (Math.PI * 2);
            } else if (this.ship.a >= Math.PI * 2) {
                this.ship.a -= (Math.PI * 2)
            }

            // move the ship
            this.ship.x += this.ship.thrust.x;
            this.ship.y += this.ship.thrust.y;
        } else {
            // reduce the explode time
            this.ship.explodeTime--;

            // reset the ship after the explosion has finished
            if (this.ship.explodeTime === 0) {
                this.lives--;
                if (this.lives === 0) {
                    this.gameOver();
                } else {
                    this.ship = new Ship();
                }
            }
        }


        // handle edge of screen
        if (this.ship.x < 0 - this.ship.r) {
            this.ship.x = canvas.width + this.ship.r;
        } else if (this.ship.x > canvas.width + this.ship.r) {
            this.ship.x = 0 - this.ship.r;
        }
        if (this.ship.y < 0 - this.ship.r) {
            this.ship.y = canvas.height + this.ship.r;
        } else if (this.ship.y > canvas.height + this.ship.r) {
            this.ship.y = 0 - this.ship.r;
        }

        // move the lasers
        for (let i = this.ship.lasers.length - 1; i >= 0; i--) {

            // check distance travelled
            if (this.ship.lasers[i].dist > Constants.LASER_DIST * canvas.width) {
                this.ship.lasers.splice(i, 1);
                continue;
            }

            // handle the explosion
            if (this.ship.lasers[i].explodeTime > 0) {
                this.ship.lasers[i].explodeTime--;

                // destroy the laser after the duration is up
                if (this.ship.lasers[i].explodeTime == 0) {
                    this.ship.lasers.splice(i, 1);
                    continue;
                }
            } else {
                // move the laser
                this.ship.lasers[i].x += this.ship.lasers[i].xv;
                this.ship.lasers[i].y += this.ship.lasers[i].yv;

                // calculate the distance travelled
                this.ship.lasers[i].dist += Math.sqrt(Math.pow(this.ship.lasers[i].xv, 2) + Math.pow(this.ship.lasers[i].yv, 2));
            }

            // handle edge of screen
            if (this.ship.lasers[i].x < 0) {
                this.ship.lasers[i].x = canvas.width;
            } else if (this.ship.lasers[i].x > canvas.width) {
                this.ship.lasers[i].x = 0;
            }
            if (this.ship.lasers[i].y < 0) {
                this.ship.lasers[i].y = canvas.height;
            } else if (this.ship.lasers[i].y > canvas.height) {
                this.ship.lasers[i].y = 0;
            }
        }

        // move the asteroids
        for (var i = 0; i < this.asteroids.length; i++) {
            this.asteroids[i].x += this.asteroids[i].xv;
            this.asteroids[i].y += this.asteroids[i].yv;

            // handle asteroid edge of screen
            if (this.asteroids[i].x < 0 - this.asteroids[i].r) {
                this.asteroids[i].x = canvas.width + this.asteroids[i].r;
            } else if (this.asteroids[i].x > canvas.width + this.asteroids[i].r) {
                this.asteroids[i].x = 0 - this.asteroids[i].r
            }
            if (this.asteroids[i].y < 0 - this.asteroids[i].r) {
                this.asteroids[i].y = canvas.height + this.asteroids[i].r;
            } else if (this.asteroids[i].y > canvas.height + this.asteroids[i].r) {
                this.asteroids[i].y = 0 - this.asteroids[i].r
            }
        }
    }
}