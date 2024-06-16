import Constants from '../constants.js';

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


