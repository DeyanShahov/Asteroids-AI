import Constants from '../constants.js';

// set up event handlers
export function registerKeyboardEvents(ship) {
    document.addEventListener('keydown', (ev) => keyDown(ev, ship));
    document.addEventListener('keyup', (ev) => keyUp(ev, ship));
}

export function keyDown(ev, ship) {
    if (ship.dead) return;

    ev.preventDefault();

    switch (ev.keyCode) {
        case 32: // spce bar ( shoot laser )
            ship.shootLaser();
            break;
        case 37: // left arrow (rotate ship left)
            ship.rot = Constants.SHIP_TURN_SPD / 180 * Math.PI / Constants.FPS;
            break;
        case 38: // up arrow (thrust the ship forward)
            ship.thrusting = true;
            break;
        case 39: // right arrow (rotate ship right)
            ship.rot = -Constants.SHIP_TURN_SPD / 180 * Math.PI / Constants.FPS;
            break;
    }
}

export function keyUp(ev, ship) {

    if (ship.dead) return;

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