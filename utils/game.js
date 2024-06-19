import Constants from '../constants.js';
import { distanceBetweenPoints } from './asteroid.js';

// check high score
export function checkScoreHigh(score, scoreHigh) {
    if (score > scoreHigh) {
        localStorage.setItem(Constants.SAVE_KEY_SCORE, scoreHigh);
        return score;
    }

    return scoreHigh;
};

export function angleToPoint(x, y, bearing, targetX, targetY) {
    let angleToTarget = Math.atan2(-targetY + y, targetX - x);
    let diff = bearing - angleToTarget;
    return (diff + Math.PI * 2) % (Math.PI * 2);
}

export function drawCircle(x, y, r, ctx, style) {
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.stroke();
}

export function calculateAsteroidPositions(ship, asteroids) {
    let closestAsteroid = 0;
    let farthestAsteroid = 0;
    let dangerousAsteroids = [];
    let distClo = distanceBetweenPoints(ship.x, ship.y, asteroids[0].x, asteroids[0].y);
    let distFar = distClo;

    for (let i = 1; i < asteroids.length; i++) {
        let distTemp = distanceBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y);
        if (distTemp < distClo) {
            distClo = distTemp;
            closestAsteroid = i;
        }

        if (distTemp > distFar) {
            distFar = distTemp;
            farthestAsteroid = i;
        }

        if (isAsteroidHeadingTowardsShip(ship, asteroids[i])) dangerousAsteroids.push(i);
    }
    return { closestAsteroid, farthestAsteroid, dangerousAsteroids };
}

export function isAsteroidHeadingTowardsShip(ship, asteroid) {
    // Check if the vector intersects the area with the given coordinates and radius
    const targetX = ship.x; 
    const targetY = ship.y;
    const targetRadius = ship.r;
    const asteroidRadius = asteroid.r;

    // Calculate the length of the vector
    const vectorLength = Math.sqrt((asteroid.vectorEndPoint.x - asteroid.x) ** 2 + (asteroid.vectorEndPoint.y - asteroid.y) ** 2);

    // Checking if the vector can cross the target area, including the size of the asteroid
    const distanceToTarget = Math.abs((asteroid.vectorEndPoint.x - targetX) * (asteroid.y - targetY) - (asteroid.vectorEndPoint.y - targetY) * (asteroid.x - targetX)) / vectorLength;

    if (distanceToTarget <= (targetRadius + asteroidRadius)) {
        console.log('The vector can cross the ship!');
        return true;
    }
    return false;
}
