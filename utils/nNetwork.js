import Constants from '../constants.js';
import { readyNeuralNetwork } from '../data/readyToUseAi.js';
import { NeuralNetwork } from '../engine/NeuralNetwork.js';
import { NeuralNetworkV2 } from '../engine/NeuralNetworkV2.js';
import { distanceBetweenPoints } from './asteroid.js';
import { angleToPoint, calculateAsteroidPositions } from './game.js';

const useRedyAiAsParameter = false;
const useReadyAiFromDataFile = true;
const useReadyAiFromLocalStorage = true;
let nNetwork = undefined;

export async function prepereNeuralNetwork(ship) {
    if (useRedyAiAsParameter) nNetwork = loadNetworkAsParameter();
    else {
        // check for network in data file
        let loadNetwork = useReadyAiFromDataFile ? await loadNetworkFromDataFile() : null;
        if (loadNetwork != null && loadNetwork instanceof NeuralNetwork) nNetwork = loadNetwork;
        // on missing or error in data file, check in localStorage
        if (loadNetwork == null && useReadyAiFromLocalStorage) {
            const data = loadNetworkFromLoacalStorage();
            if (data != null && data instanceof NeuralNetwork) nNetwork = data;
        }

        if (nNetwork == undefined && !(nNetwork instanceof NeuralNetwork)) neuralNetworkTrein(ship);
    }
}

function neuralNetworkTrein(ship) {
    console.log('Train new neural network ...');
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
        
        let angle = angleToPoint(sx, sy, sa, ax, ay); // calculate the angle to the asteroid

        let direction = angle > Math.PI ? Constants.OUTPUT_LEFT : Constants.OUTPUT_RIGHT;  // determinate the drirection to turn

        let shoot = Math.random() < 0.5 ? 0 : 1;  // Random decision to shoot in treining

        nNetwork.trein(normaliseInputToNetwork(ax, ay, angle, sa), [direction, shoot]);  // Train the network
    }

    // save trained network
    console.log('Ready newly trained neural network!');
    saveNetworkToLocalStorage(nNetwork);
}

function neuralNetworkTreinV1A(ship) {
    console.log('Train new neural network ...');
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

        // Random decision to shoot in treining
        let shoot = Math.random() < 0.5 ? 0 : 1;

        // train the network
        nNetwork.trein(normaliseInputToNetwork(ax, ay, angle, sa), [direction, shoot]);
    }
    // save trained network
    console.log('Ready newly trained neural network!');
    //saveNetworkToLocalStorage(nNetwork);
}


function neuralNetworkTreinV2(ship, asteroids) {
    console.log('Train new neural network ...');
    nNetwork = new NeuralNetworkV2(12, 20, 10, 2);
    let ax, ay, sa, sx, sy, axv, ayv, shipSpeed;
    for (let i = 0; i < Constants.NUM_SAMPLES; i++) {
        let asteroidIndex = Math.floor(Math.random() * asteroids.length);
        ax = asteroids[asteroidIndex].x;
        ay = asteroids[asteroidIndex].y;
        sa = ship.a;
        sx = ship.x;
        sy = ship.y;
        axv = asteroids[asteroidIndex].xv;
        ayv = asteroids[asteroidIndex].yv;
        shipSpeed = Math.random();
        let angle = angleToPoint(sx, sy, sa, ax, ay);
        let direction = angle > Math.PI ? Constants.OUTPUT_LEFT : Constants.OUTPUT_RIGHT;
        let move = Math.random() < 0.5 ? 0 : 1;

        // Train the network
        nNetwork.trein(normaliseInputToNetworkV2(ax, ay, angle, sa), [direction, move]);   
    }
    console.log('Ready newly trained neural network!');
    //saveNetworkToLocalStorage(nNetwork);
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

export function normaliseInputToNetworkV2(roidX, roidY, roidXV, roidYV, roidAngle, ship) {
    let input = [];
    input[0] = (roidX + Constants.ROID_SIZE / 2) / (Constants.SCREEN_WIDTH + Constants.ROID_SIZE);
    input[1] = (roidY + Constants.ROID_SIZE / 2) / (Constants.SCREEN_HEIGHT + Constants.ROID_SIZE);
    input[2] = (roidXV + 1) / 2; // Нормализиране на скоростта на метеорита (xv)
    input[3] = (roidYV + 1) / 2; // Нормализиране на скоростта на метеорита (yv)
    input[4] = roidAngle / (Math.PI * 2);
    input[5] = (ship.x + Constants.SHIP_SIZE / 2) / (Constants.SCREEN_WIDTH + Constants.SHIP_SIZE);
    input[6] = (ship.y + Constants.SHIP_SIZE / 2) / (Constants.SCREEN_HEIGHT + Constants.SHIP_SIZE);
    input[7] = ship.a / (Math.PI * 2);
    input[8] = ship.thrusting ? 1 : 0;
    input[9] = ship.thrust.x / Constants.SHIP_THRUST;
    input[10] = ship.thrust.y / Constants.SHIP_THRUST;
    input[11] = ship.rot / Math.PI; // Нормализиране на ротацията
    //input[8] = ship.blinkNum / Constants.SHIP_INV_DUR; // Нормализиране на броя мигания
    //input[8] = ship.thrust.x ** 2 + ship.thrust.y ** 2; // Скорост на кораба
    return input;
}

export function predictionOfNetwork(ship, asteroids) {
    let indexAsteroidsOfInterest = calculateAsteroidPositions(ship, asteroids);

    let asteroidIndex;
    if (indexAsteroidsOfInterest.dangerousAsteroids.length > 0) {
        const filteredDangerousArray = asteroids.filter((_, index) => indexAsteroidsOfInterest.dangerousAsteroids.includes(index));
        asteroidIndex = calculateClosestAsteroid(ship, filteredDangerousArray, indexAsteroidsOfInterest.dangerousAsteroids);
    } else {
        asteroidIndex = indexAsteroidsOfInterest.closestAsteroid;
    }

    let ax = asteroids[asteroidIndex].x;
    let ay = asteroids[asteroidIndex].y;
    let sa = ship.a;
    let angle = angleToPoint(ship.x, ship.y, sa, ax, ay);
    let predict = nNetwork.feedForward(normaliseInputToNetwork(ax, ay, angle, sa)).data[0][0];
    return { predict, indexAsteroidsOfInterest };
}

export function predictionOfNetworkV1A(ship, asteroids) {
    let asteroidIndex = calculateAsteroidPositions(ship, asteroids).closestAsteroidIndex;

    // make a prediction based on current data
    let ax = asteroids[asteroidIndex].x;
    let ay = asteroids[asteroidIndex].y;
    let sa = ship.a;
    let angle = angleToPoint(ship.x, ship.y, sa, ax, ay);
    let predictions = nNetwork.feedForward(normaliseInputToNetwork(ax, ay, angle, sa)).data[0];
    let direction = predictions[0];
    let shoot = predictions[1] >= 0.5; // Prediction to shoot or not

    return {direction, shoot};
}

export function predictionOfNetworkV2(ship, asteroids) {
    let asteroidIndex = calculateAsteroidPositions(ship, asteroids).closestAsteroidIndex;
    let ax = asteroids[asteroidIndex].x;
    let ay = asteroids[asteroidIndex].y;
    let axv = asteroids[asteroidIndex].xv;
    let ayv = asteroids[asteroidIndex].yv;
    let sa = ship.a;
    let angle = angleToPoint(ship.x, ship.y, sa, ax, ay);
    let predictions = nNetwork.feedForward(normaliseInputToNetworkV2(ax, ay, axv, ayv, angle, ship)).data[0];
    let direction = predictions[0];
    let move = predictions[1];

    return { direction, move };
}

function calculateClosestAsteroid(ship, asteroidsList, originalAsteroidsIndexes) {
    let closestAsteroidIndex = 0;
    let dist0 = distanceBetweenPoints(ship.x, ship.y, asteroidsList[0].x, asteroidsList[0].y);
    for (let i = 1; i < asteroidsList.length; i++) {
        let dist1 = distanceBetweenPoints(ship.x, ship.y, asteroidsList[i].x, asteroidsList[i].y);
        if (dist1 < dist0) {
            dist0 = dist1;
            closestAsteroidIndex = i;
        }
    }
    return originalAsteroidsIndexes[closestAsteroidIndex];
}

function saveNetworkToLocalStorage(neuralNetwork) {
    try {
        const data = JSON.stringify(neuralNetwork.toJSON());
        localStorage.setItem('trainedNetwork', data);
        console.log('Network saved to localStorage');
    } catch (error) {
        console.error('Failed to save network to localStorage:', error);
    }
}

function loadNetworkFromLoacalStorage() {
    try {
        const data = localStorage.getItem('trainedNetwork');
        if (data) {
            console.log('Loaded network from localStorage');
            const parsedData = JSON.parse(data);
            return NeuralNetwork.fromJSON(parsedData);
        }
        if (data == null) console.log('Local Storage dont contain saved neural network!');
    } catch (error) {
        console.error('Failed to load network from localStorage:', error);
        return null;
    }
}

async function loadNetworkFromDataFile() {
    try {
        const response = await fetch('../data/readyToUseAi.json');
        if (!response.ok) throw new Error('Network respons was not ok');
        console.log('Loaded network from data file');
        const data = await response.json();
        return NeuralNetwork.fromJSON(data);
        //return data;
    } catch (error) {
        console.error('Failed to load network from data file (radyToUseAi.json): ', error);
        return null;
    }
}

function loadNetworkAsParameter() {
    // const data = readyNeuralNetwork;
    // console.log('Loaded network as param');
    // const parsedData = JSON.parse(data);
    // const parsedData2 = data.json();
    // console.log('a');
    // return NeuralNetwork.fromJSON(parsedData2);
}


