import Constants from '../constants.js';
import { ENABLE_AI } from '../utils/gameUiSetings.js';

let currentShip = null;

// set up event handlers
export function registerKeyboardEvents(ship) {
    if (currentShip) {
        window.removeEventListener('keydown', currentShip.keyDownHandler);
        window.removeEventListener('keyup', currentShip.keyUpHandler);
    }

    currentShip = ship;
    currentShip.keyDownHandler = (ev) => keyDown(ev, currentShip);
    currentShip.keyUpHandler = (ev) => keyUp(ev, currentShip);

    window.addEventListener('keydown', currentShip.keyDownHandler);
    window.addEventListener('keyup', currentShip.keyUpHandler);
}

function keyDown(ev, ship) {
    //if (ship.dead || Constants.AUTOMATION_ON) return;
    if (ship.dead || ENABLE_AI) return;

    ev.preventDefault();

    switch (ev.keyCode) {
        case 32: // spce bar ( shoot laser )
            ship.shootLaser();
            break;
        case 37: // left arrow (rotate ship left)
            rotateShip(ship, false);
            break;
        case 38: // up arrow (thrust the ship forward)
            ship.thrusting = true;
            break;
        case 39: // right arrow (rotate ship right)
            rotateShip(ship, true);
            break;
    }
}

function keyUp(ev, ship) {
    //if (ship.dead || Constants.AUTOMATION_ON) return;
    if (ship.dead || ENABLE_AI) return;

    ev.preventDefault();

    switch (ev.keyCode) {
        case 32: // space bar (allow shooting again)
            ship.canShoot = true;
            break;
        case 37: // left arrow (stop rotating left)
            ship.rot = 0;
            break;
        case 38: // up arrow (stop thrusting)
            ship.thrusting = false;
            break;
        case 39: // right arrow (stop rotating right)
            ship.rot = 0;
            break;
    }
}

export function rotateShip(ship, right) {
    let sign = right ? -1 : 1;
    ship.rot = Constants.SHIP_TURN_SPD / 180 * Math.PI / Constants.FPS * sign;
}