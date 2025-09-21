// src/utils/localStorage.js
export function setLocalStorageKey(key, value) {
    if (value) {
        localStorage.setItem(key, value);
    } else {
        localStorage.removeItem(key);
    }
}

export function getLocalStorageKey(key) {
    return localStorage.getItem(key);
}

export function clearLocalStorage() {
    localStorage.clear();
}