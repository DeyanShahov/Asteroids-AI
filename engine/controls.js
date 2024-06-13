
export const GamepadThumbstick = {
    DEAD_ZONE: 'deadZone',
    HORIZONTAL_AXE_ID: 'horizontalAxeId',
    VERTICAL_AXE_ID: 'verticalAxeId',
};

export const PS3GamepadButtons = {
    BUTTON_LEFT_B_14: '14', // 'button-left',
    BUTTON_UP_B_12: '12', // 'button-up',
    BUTTON_RIGHT_B_15: '15', // 'button-right',
    BUTTON_DOWN_B_13: '13', // 'button-down',
    BUTTON_SQUARE_B_2: '2', // 'button-square',
    BUTTON_TRIANGLE_B_3: '3', // 'button-triangle',
    BUTTON_CIRCLE_B_1: '1', // 'button-circle',
    BUTTON_CROSS_B_0: '0', // 'button-cross',
    BUTTON_L1_B_4: '4', // 'button-l1',
    BUTTON_L2_B_6: '6', // 'button-l2',
    BUTTON_R1_B_5: '5', // 'button-r1',
    BUTTON_R2_B_7: '7', // 'button-r2',
    BUTTON_SELECT_B_8: '8', // 'button-select',
    BUTTON_START_B_9: '9', // 'button-start',
    BUTTON_PS3_B_16: '16', // 'button-ps3',
};

export const Control = {
    TURN_LEFT: 'turn-left',
    TURN_RIGHT: 'turn-right',
    THRUSTING: 'thrusting',
    SHOOT: 'shoot',
};

export const controls = [
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.TURN_LEFT]: PS3GamepadButtons.BUTTON_LEFT_B_14,
            [Control.TURN_RIGHT]: PS3GamepadButtons.BUTTON_RIGHT_B_15,
            [Control.THRUSTING]: PS3GamepadButtons.BUTTON_UP_B_12,
            [Control.SHOOT]: PS3GamepadButtons.BUTTON_TRIANGLE_B_3,

        },
        keyboard: {
            [Control.TURN_LEFT]: 'ArrowLeft',
            [Control.TURN_RIGHT]: 'ArrowRight',
            [Control.THRUSTING]: 'ArrowUp',
            [Control.SHOOT]: 'Space',
        },
    },
];