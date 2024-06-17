import Constants from '../constants.js';
import { rotateShip } from '../engine/InputKeyboardHandler.js';
let aiShootTime = 0;
export function aiPlay(predict, ship) {
    let deltaLeft = Math.abs(predict - Constants.OUTPUT_LEFT);
    let deltaRight = Math.abs(predict - Constants.OUTPUT_RIGHT);
    if (deltaLeft < Constants.OUTPUT_THRESHOLD) rotateShip(ship, false);
    else if (deltaRight < Constants.OUTPUT_THRESHOLD) rotateShip(ship, true);
    else ship.rot = 0;

    if (aiShootTime == 0) {
        aiShootTime = Math.ceil(Constants.FPS / Constants.RATE_OFFIRE);
        ship.canShoot = true;
        ship.shootLaser();
    } else aiShootTime--;
}