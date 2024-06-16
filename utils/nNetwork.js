import Constants from '../constants.js';
import { NeuralNetwork } from '../engine/NeuralNetwork.js';
import { distanceBetweenPoints } from './asteroid.js';
import { angleToPoint } from './game.js';

let nNetwork = undefined;

export function neuralNetworkTrein(ship) {
    nNetwork = new NeuralNetwork(Constants.NUM_INPUTS, Constants.NUM_HIDDEN, Constants.NUM_OUTPUTS);

    let ax, ay, sa, sx, sy;

    for (let i = 0; i < Constants.NUM_SAMPLES; i++) {
        // random asteroids location
        ax = Math.random() * (Constants.SCREEN_WIDTH + Constants.ROID_SIZE) - Constants.ROID_SIZE / 2;
        ay = Math.random() * (Constants.SCREEN_HEIGHT + Constants.ROID_SIZE) - Constants.ROID_SIZE / 2;

        // ship angle and position
        sa = Math.random() * Math.PI * 2;
        sx = ship.x;
        sy = ship.y;

        // calculate the angle to the asteroid
        let angle = angleToPoint(sx, sy, sa, ax, ay);

        // determinate the drirection to turn
        let direction = angle > Math.PI ? Constants.OUTPUT_LEFT : Constants.OUTPUT_RIGHT;

        // train the network
        nNetwork.trein(normaliseInputToNetwork(ax, ay, angle, sa), [direction]);

        // // test train the network with XOR logic
        // for (let i = 0; i < Constants.NUM_SAMPLES; i++) {
        //     // TEST XOR logic
        //     // 0 0 = 0
        //     // 0 1 = 1
        //     // 1 0 = 1
        //     // 1 1 = 0

        //     let input0 = Math.round(Math.random()); // 0 or 1 
        //     let input1 = Math.round(Math.random()); // 0 or 1
        //     let output = input0 == input1 ? 0 : 1;
        //     nNetwork.trein([input0, input1], [output]); 
        // }

        // // test output
        // console.log('0, 0 = ' + nNetwork.feedForward([0, 0]).data);
        // console.log('0, 1 = ' + nNetwork.feedForward([0, 1]).data);
        // console.log('1, 0 = ' + nNetwork.feedForward([1, 0]).data);
        // console.log('1, 1 = ' + nNetwork.feedForward([1, 1]).data);
    }
}

export function normaliseInputToNetwork(roidX, roidY, roidAngle, shipA) {
    // normalise the values to between 0 and 1
    let input = [];
    input[0] = (roidX + Constants.ROID_SIZE / 2) / (Constants.SCREEN_WIDTH + Constants.ROID_SIZE);
    input[1] = (roidY + Constants.ROID_SIZE / 2) / (Constants.SCREEN_HEIGHT + Constants.ROID_SIZE);
    input[2] = roidAngle / (Math.PI * 2);
    input[3] = shipA / (Math.PI * 2);
    return input;
}

export function predictionOfNetwork(ship, asteroids) {
    let asteroidIndex = calculateClosestAsteroid(ship, asteroids);

    // make a prediction based on current data
    let ax = asteroids[asteroidIndex].x;
    let ay = asteroids[asteroidIndex].y;
    let sa = ship.a;
    let angle = angleToPoint(ship.x, ship.y, sa, ax, ay);
    let predict = nNetwork.feedForward(normaliseInputToNetwork(ax, ay, angle, sa)).data[0][0];

    return predict;
}

function calculateClosestAsteroid(ship, asteroids) {
    // compute the closest asteroid
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
