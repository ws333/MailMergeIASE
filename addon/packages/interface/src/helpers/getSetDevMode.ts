type DevModeState = "enabled" | "disabled";

const devModeKey = "devmode";
const devModeValue = "true";

export function getDevMode(): DevModeState {
    if (localStorage.getItem(devModeKey) === devModeValue) {
        return "enabled";
    } else {
        return "disabled";
    }
}

export function isDevMode() {
    return getDevMode() === "enabled";
}

export function setDevMode(state: DevModeState) {
    if (state === "enabled") {
        localStorage.setItem(devModeKey, devModeValue);
        console.warn(`Localstorage: added key "${devModeKey}" with value "${devModeValue}"`);
    } else {
        localStorage.removeItem(devModeKey);
        console.warn(`Localstorage: removed key "${devModeKey}"`);
    }
}

export function setDevModeIfLocalhost() {
    if (isLocalhost()) setDevMode("enabled");
}

export function isLocalhost(): boolean {
    return (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "[::1]"
    );
}
