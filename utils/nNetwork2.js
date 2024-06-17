import Constants from '../constants.js';
import { NeuralNetwork } from '../engine/NeuralNetwork.js';
import { distanceBetweenPoints } from './asteroid.js';
import { angleToPoint } from './game.js';
let nNetwork = undefined;
export function neuralNetworkTrein(ship) {
    nNetwork = new NeuralNetwork(Constants.NUM_INPUTS, Constants.NUM_HIDDEN, Constants.NUM_OUTPUTS);
    let ax, ay, sa, sx, sy;
    for (let i = 0; i < Constants.NUM_SAMPLES; i++) {
        ax = Math.random() * (Constants.SCREEN_WIDTH + Constants.ROID_SIZE) - Constants.ROID_SIZE / 2;
        ay = Math.random() * (Constants.SCREEN_HEIGHT + Constants.ROID_SIZE) - Constants.ROID_SIZE / 2;
        sa = Math.random() * Math.PI * 2;
        sx = ship.x;
        sy = ship.y;

        let angle = angleToPoint(sx, sy, sa, ax, ay);
        let direction = angle > Math.PI ? Constants.OUTPUT_LEFT : Constants.OUTPUT_RIGHT;
        nNetwork.trein(normaliseInputToNetwork(ax, ay, angle, sa), [direction]);
    }
}
export function normaliseInputToNetwork(roidX, roidY, roidAngle, shipA) {
    let input = [];
    input[0] = (roidX + Constants.ROID_SIZE / 2) / (Constants.SCREEN_WIDTH + Constants.ROID_SIZE);
    input[1] = (roidY + Constants.ROID_SIZE / 2) / (Constants.SCREEN_HEIGHT + Constants.ROID_SIZE);
    input[2] = roidAngle / (Math.PI * 2);
    input[3] = shipA / (Math.PI * 2);
    return input;
}
export function predictionOfNetwork(ship, asteroids) {
    let asteroidIndex = calculateClosestAsteroid(ship, asteroids);
    let ax = asteroids[asteroidIndex].x;
    let ay = asteroids[asteroidIndex].y;
    let sa = ship.a;
    let angle = angleToPoint(ship.x, ship.y, sa, ax, ay);
    let predict = nNetwork.feedForward(normaliseInputToNetwork(ax, ay, angle, sa)).data[0][0];
    return predict;
}
function calculateClosestAsteroid(ship, asteroids) {
    let closestAsteroidIndex = 0;
    let dist0 = distanceBetweenPoints(ship.x, ship.y, asteroids[0].x, asteroids[0].y);
    for (let i = 1; i < asteroids.length; i++) {
        let dist1 = distanceBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y);
        if (dist1 < dist0) {
            dist0 = dist1;
            closestAsteroidIndex = i;
        }
    }
    return closestAsteroidIndex;
}
