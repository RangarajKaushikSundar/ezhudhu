/* ---------- GDPR / localStorage Helpers ---------- */

const STORAGE_KEYS = {
    CONSENT: "ezhudhu_consent",
    VISITED: "ezhudhu_visited",
    PLAYED_PREFIX: "ezhudhu_played_",
    STATE_PREFIX: "ezhudhu_state_",
    HISTORY: "ezhudhu_history",
};

function _todayStr() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/* -- Consent -- */
function hasConsent() {
    return localStorage.getItem(STORAGE_KEYS.CONSENT) === "accepted";
}

function getConsentStatus() {
    return localStorage.getItem(STORAGE_KEYS.CONSENT); // "accepted", "declined", or null
}

function setConsent(accepted) {
    localStorage.setItem(
        STORAGE_KEYS.CONSENT,
        accepted ? "accepted" : "declined"
    );
}

/* -- First-time player -- */
function isFirstTimePlayer() {
    return !localStorage.getItem(STORAGE_KEYS.VISITED);
}

function markVisited() {
    if (hasConsent()) {
        localStorage.setItem(STORAGE_KEYS.VISITED, "true");
    }
}

/* -- Daily play tracking -- */
function hasPlayedToday(mode) {
    if (!hasConsent()) return false;
    return localStorage.getItem(STORAGE_KEYS.PLAYED_PREFIX + mode) === _todayStr();
}

function markPlayedToday(mode) {
    if (hasConsent()) {
        localStorage.setItem(STORAGE_KEYS.PLAYED_PREFIX + mode, _todayStr());
    }
}

/* -- Game state save/restore -- */
function saveGameState(mode, state) {
    if (hasConsent()) {
        localStorage.setItem(STORAGE_KEYS.STATE_PREFIX + mode, JSON.stringify(state));
    }
}

function loadGameState(mode) {
    if (!hasConsent()) return null;
    const raw = localStorage.getItem(STORAGE_KEYS.STATE_PREFIX + mode);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function clearGameState(mode) {
    localStorage.removeItem(STORAGE_KEYS.STATE_PREFIX + mode);
}

/* -- Historical Game Data -- */
function getGameHistory() {
    if (!hasConsent()) return [];
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function recordGameResult({ date, mode, won, attempts, guesses }) {
    if (!hasConsent()) return;
    const history = getGameHistory();
    history.push({ date, mode, won, attempts, guesses });
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

function clearGameHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

/* -- GDPR Banner -- */
function initCookieBanner() {
    const banner = document.getElementById("gdpr-banner");
    if (!banner) return;

    // If user already made a choice, hide banner
    if (getConsentStatus() === "accepted") {
        banner.style.display = "none";
        return;
    }

    // Show banner
    banner.style.display = "flex";

    document.getElementById("gdpr-accept").addEventListener("click", () => {
        setConsent(true);
        markVisited();
        banner.style.display = "none";
    });

    document.getElementById("gdpr-decline").addEventListener("click", () => {
        setConsent(false);
        banner.style.display = "none";
    });
}

// Auto-init banner when script loads
initCookieBanner();
