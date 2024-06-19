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

export function aiPlayV1A(predict, ship) {
    // make a turn
    let deltaLeft = Math.abs(predict.direction - Constants.OUTPUT_LEFT);
    let deltaRight = Math.abs(predict.direction - Constants.OUTPUT_RIGHT);
    if (deltaLeft < Constants.OUTPUT_THRESHOLD) rotateShip(ship, false);
    else if (deltaRight < Constants.OUTPUT_THRESHOLD) rotateShip(ship, true);
    else ship.rot = 0; // stop rotation

    // shoot the laser
    if (predict.shoot && aiShootTime == 0) {
        aiShootTime = Math.ceil(Constants.FPS / Constants.RATE_OFFIRE);
        ship.canShoot = true;
        ship.shootLaser();
    } else if (aiShootTime > 0) {
        aiShootTime--;
    }
}

export function aiPlayV2(predict, ship) {
    let deltaLeft = Math.abs(predict.direction - Constants.OUTPUT_LEFT);
    let deltaRight = Math.abs(predict.direction - Constants.OUTPUT_RIGHT);
    if (deltaLeft < Constants.OUTPUT_THRESHOLD) rotateShip(ship, false);
    else if (deltaRight < Constants.OUTPUT_THRESHOLD) rotateShip(ship, true);
    else ship.rot = 0;

    if (predict.move == 3) {
        ship.thrusting = true;
    } else if (predict.move == 4) {
        ship.thrusting = false; // Пример за движение назад (може да изисква допълнителна имплементация)
    }
}

export function aiPlayV3(predict, ship) {
    //let direction = predict.direction;
    //let move = predict.move;

    // if (direction == Constants.OUTPUT_LEFT) {
    //     rotateShip(ship, false);
    // } else if (direction == Constants.OUTPUT_RIGHT) {
    //     rotateShip(ship, true);
    // } else {
    //     ship.rot = 0;
    // }
    // make a turn
    let deltaLeft = Math.abs(predict.direction - Constants.OUTPUT_LEFT);
    let deltaRight = Math.abs(predict.direction - Constants.OUTPUT_RIGHT);
    if (deltaLeft < Constants.OUTPUT_THRESHOLD) rotateShip(ship, false);
    else if (deltaRight < Constants.OUTPUT_THRESHOLD) rotateShip(ship, true);
    else ship.rot = 0; // stop rotation

    let deltaMove = Math.abs(predict.move - 0);
    let deltaStop = Math.abs(predict.move - 1);

    if (deltaMove < Constants.OUTPUT_THRESHOLD) {
        ship.thrusting = true;
    } else if (deltaStop < Constants.OUTPUT_THRESHOLD) {
        ship.thrusting = false; // Пример за движение назад (може да изисква допълнителна имплементация)
    }

    // Автоматично стрелба
    if (aiShootTime == 0) {
        aiShootTime = Math.ceil(Constants.FPS / Constants.RATE_OFFIRE);
        ship.canShoot = true;
        ship.shootLaser();
    } else {
        aiShootTime--;
    }
}
