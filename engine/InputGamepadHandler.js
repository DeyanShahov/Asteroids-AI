import Constants from '../constants.js';
import { controls, Control, GamepadThumbstick, PS3GamepadButtons } from './controls.js';

const gamePads = new Map();

function handleGamepadConnected(event) {
    const { gamepad: { index, axes, buttons } } = event;

    gamePads.set(index, { axes, buttons });
}

function handleGamepadDisconnected(event) {
    const { gamepad: { index } } = event;

    gamePads.delete(index);
}

export function registerGamepadEvents() {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
}

export function pollGamepads(ship) {
    for (const gamePad of navigator.getGamepads()) {
        if (!gamePad) continue;

        if (gamePads.has(gamePad.index)) {
            const { index, axes, buttons } = gamePad;

            gamePads.set(index, { axes, buttons });

            for (const button in buttons) {
                if (isLeft(gamePad.index)) ship.rot = Constants.SHIP_TURN_SPD / 180 * Math.PI / Constants.FPS;

                if (isRight(gamePad.index)) ship.rot = -Constants.SHIP_TURN_SPD / 180 * Math.PI / Constants.FPS;

                if (isUp(gamePad.index)) ship.thrusting = true;

                if (isShoot(gamePad.index))  ship.shootLaser();

                if (isButtonUp(gamePad.index, button)) {
                    switch (button) {
                        case PS3GamepadButtons.BUTTON_TRIANGLE_B_3:
                            ship.canShoot = true;
                            break;
                        case PS3GamepadButtons.BUTTON_LEFT_B_14:
                            ship.rot = 0;
                            break;
                        case PS3GamepadButtons.BUTTON_UP_B_12: 
                            ship.thrusting = false;
                            break;
                        case PS3GamepadButtons.BUTTON_RIGHT_B_15: 
                            ship.rot = 0;
                            break;
                    }
                }
            }
        }
    }
}


const isButtonDown = (padId, button) => gamePads.get(padId)?.buttons[button].pressed ?? false;
const isButtonUp = (padId, button) => !gamePads.get(padId)?.buttons[button].pressed ?? false;

const isAxeGreater = (padId, axeId, value) => gamePads.get(padId)?.axes[axeId] >= value;
const isAxeLower = (padId, axeId, value) => gamePads.get(padId)?.axes[axeId] <= value;


const isLeft = (id) => isButtonDown(id, controls[id].gamePad[Control.TURN_LEFT]) 
    || isAxeLower(id,
    controls[id].gamePad[GamepadThumbstick.HORIZONTAL_AXE_ID],
    -controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
);
const isRight = (id) => isButtonDown(id, controls[id].gamePad[Control.TURN_RIGHT])
    || isAxeGreater(id,
    controls[id].gamePad[GamepadThumbstick.HORIZONTAL_AXE_ID],
    controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
);
const isUp = (id) => isButtonDown(id, controls[id].gamePad[Control.THRUSTING])
        || isAxeLower(id,
        controls[id].gamePad[GamepadThumbstick.VERTICAL_AXE_ID],
        -controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
    );

const isShoot = (id) => isButtonDown(id, controls[id].gamePad[Control.SHOOT]);
