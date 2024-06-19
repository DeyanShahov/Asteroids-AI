export let DEBUG_BOX_ENABLE = false;
export let DEBUG_LOG_ENABLE = true;
export let ENABLE_AI = true;

export function handleDebugBoxClick(checkbox) {
    DEBUG_BOX_ENABLE = checkbox.checked ? true : false;
}

export function handleDebugLogClick(checkbox) {
    DEBUG_LOG_ENABLE = checkbox.checked ? true : false;
}

export function handleAIClick(checkbox) {
    ENABLE_AI = checkbox.checked ? true : false;
}


