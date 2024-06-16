import Constants from '../constants.js';
import { rotateShip } from '../engine/InputKeyboardHandler.js';

let aiShootTime = 0;

export function aiPlay(predict, ship) {
    // make a turn
    let deltaLeft = Math.abs(predict - Constants.OUTPUT_LEFT);
    let deltaRight = Math.abs(predict - Constants.OUTPUT_RIGHT);
    if (deltaLeft < Constants.OUTPUT_THRESHOLD) {
        rotateShip(ship, false);
    } else if (deltaRight < Constants.OUTPUT_THRESHOLD) {
        rotateShip(ship, true);
    } else {
        // stop rotatin
        ship.rot = 0;
    }

    // shoot the laser
    if (aiShootTime == 0) {
        aiShootTime = Math.ceil(Constants.FPS / Constants.RATE_OFFIRE);
        ship.canShoot = true;
        ship.shootLaser();
    } else {
        aiShootTime--;
    }
}