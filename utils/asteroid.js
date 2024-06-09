import Constants from '../constants.js';

export function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2- y1, 2));
};

// export function newAsteroid(asteroidX, asteroidY, asteroidRadius, gameLevel) {
//     const lvlMulti = 1 + 0.1 * gameLevel;
//     const asteroid = {
//         x: asteroidX,
//         y: asteroidY,
//         xv: Math.random() * Constants.ROID_SPD * lvlMulti / Constants.FPS * (Math.random() < 0.5 ? 1 : -1),
//         yv: Math.random() * Constants.ROID_SPD * lvlMulti / Constants.FPS * (Math.random() < 0.5 ? 1 : -1),
//         a: Math.random() * Math.PI * 2, // in radius
//         r: asteroidRadius,
//         offs: [],
//         vert: Math.floor(Math.random() * (Constants.ROID_VERT + 1) + Constants.ROID_VERT / 2),     
//     };

//     // populate the offsets array
//     for (let i = 0; i < asteroid.vert; i++) {
//         asteroid.offs.push(Math.random() * Constants.ROID_JAG * 2 + 1 - Constants.ROID_JAG);
//     }

//     return asteroid;
// };