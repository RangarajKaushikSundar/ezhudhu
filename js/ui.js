/* ---------- MODAL LOGIC ---------- */
const modal = document.getElementById("howToPlayModal");
const closeBtn = modal.querySelector(".close-btn");
const gotItBtn = modal.querySelector(".primary-btn");

// Open modal (call this on first visit or help icon click)
function openHowToPlay() {
    modal.classList.remove("hidden");
}
// Only auto-open for first-time players
if (getConsentStatus() !== "accepted") {
    openHowToPlay();
}

// Close modal
function closeHowToPlay() {
    modal.classList.add("hidden");
}

closeBtn.addEventListener("click", closeHowToPlay);
gotItBtn.addEventListener("click", closeHowToPlay);

// Optional: close when clicking outside the modal
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeHowToPlay();
});

// Example: auto-open on first load
document.getElementById("rules").addEventListener("click", openHowToPlay);
// openHowToPlay();

/* ---------- GLITCH EFFECT ---------- */
const textElement = document.getElementById("glitch-text");
const states = ["PAZHAGU", "பழகு"];
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZபழகுகிதுஎ$%&/<>[]";
let currentStateIndex = 0;

function solve() {
    const targetText = states[currentStateIndex];
    let iteration = 0;

    // Add jitter class during transition
    textElement.classList.add("is-glitching");

    const interval = setInterval(() => {
        textElement.innerText = targetText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return targetText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        if (iteration >= targetText.length) {
            clearInterval(interval);
            textElement.classList.remove("is-glitching");

            setTimeout(() => {
                currentStateIndex = (currentStateIndex + 1) % states.length;
                solve();
            }, 2500);
        }

        iteration += 1 / 4;
    }, 40);
}

solve();

/* ---------- SETUP ---------- */
let currentMode = "easy";
let word = null;
let target = null;
let attempts = 0;
let emojiGrid = [];
let tanglishVisible = currentMode === "easy";

const gridEl1 = document.getElementById("grid1");
const gridEl2 = document.getElementById("grid2");
const gridEl3 = document.getElementById("grid3");
const keyboardWrapper = document.querySelector(".keyboard-wrapper");
const tanglishEl = document.getElementById("tanglish");
const toggleTanglishBtn = document.getElementById("toggleTanglishBtn");
const hardModeToggle = document.getElementById("hardModeToggle");
const sliderLabel = document.getElementById("sliderLabel");

function updateDisplay() {
    tanglishEl.textContent = tanglishVisible ? word.tanglish : "??????";
    document.getElementById("meaning").textContent = word.meaning;

    // Update toggle button visibility and text
    if (currentMode === "hard") {
        toggleTanglishBtn.classList.add("visible");
        toggleTanglishBtn.innerHTML = tanglishVisible
            ? '<img src="hide.png" alt="Hide Tanglish" style="width:16px; vertical-align:middle;" />'
            : '<img src="eye.png" alt="Show Tanglish" style="width:16px; vertical-align:middle;" />';
    } else {
        toggleTanglishBtn.classList.remove("visible");
    }
}

function initializeGame() {
    attempts = 0;
    emojiGrid = [];
    currentInput = [];
    currentAttempt = 0;
    guesses = [];
    word = getDailyWord(currentMode === "hard");
    target = splitTamilSyllables(word.tamil);
    tanglishVisible = currentMode === "easy";

    // Update game rule text depending on mode
    const gameRuleEl = document.getElementById('game-rule');
    if (gameRuleEl) {
        if (currentMode === 'hard') {
            gameRuleEl.innerHTML = 'Tap the <img src="eye.png" alt="Show Tanglish" style="width:16px; vertical-align:middle;" /> icon to reveal the தங்lish word.';
        } else {
            gameRuleEl.innerHTML = 'This is <u><b>not a guessing game</b></u> — the word is already given.';
        }
    }

    // Reset display
    updateDisplay();
    renderEmptyGrid();

    // Re-enable enter button
    document.getElementById("enter").disabled = false;
    document.getElementById("resultmodal").style.display = "none";
    document.getElementById("viewResultsBtn").style.display = "none";

    // Check if already played today and restore state
    if (hasPlayedToday(currentMode)) {
        const saved = loadGameState(currentMode);
        if (saved && saved.finished) {
            // Restore a finished game — replay the grid visuals
            attempts = saved.attempts;
            emojiGrid = saved.emojiGrid || [];
            currentAttempt = saved.currentAttempt;

            if (saved.guesses) {
                saved.guesses.forEach((guess, attemptIdx) => {
                    if (attemptIdx >= grids.length) return;
                    const boxes = grids[attemptIdx].querySelectorAll(".box");
                    guess.forEach((letter, i) => {
                        if (i < boxes.length) {
                            boxes[i].textContent = letter;
                            boxes[i].classList.add("flip");
                            if (letter === target[i]) {
                                boxes[i].classList.add("correct");
                            } else {
                                boxes[i].classList.add("wrong");
                            }
                        }
                    });
                });
            }

            endGame(saved.won, true);
        } else if (saved) {
            // Restore an in-progress game
            attempts = saved.attempts;
            currentAttempt = saved.currentAttempt;
            currentInput = saved.currentInput || [];
            emojiGrid = saved.emojiGrid || [];
            guesses = saved.guesses || [];

            if (saved.guesses) {
                saved.guesses.forEach((guess, attemptIdx) => {
                    if (attemptIdx >= grids.length) return;
                    const boxes = grids[attemptIdx].querySelectorAll(".box");
                    guess.forEach((letter, i) => {
                        if (i < boxes.length) {
                            boxes[i].textContent = letter;
                            boxes[i].classList.add("flip");
                            if (letter === target[i]) {
                                boxes[i].classList.add("correct");
                            } else {
                                boxes[i].classList.add("wrong");
                            }
                        }
                    });
                });
            }

            renderGridForAttempt(currentAttempt);
        }
    }
}

function renderEmptyGrid() {
    [gridEl1, gridEl2, gridEl3].forEach((gridEl) => {
        gridEl.innerHTML = "";
        target.forEach(() => {
            const b = document.createElement("div");
            b.className = "box";
            gridEl.appendChild(b);
        });
    });
}

/* ---------- KEYBOARD INPUT HANDLER ---------- */
// Disable right-click
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable F12 and Ctrl+U
document.onkeydown = function (e) {
    if (e.keyCode == 123 || (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 73))) {
        return false;
    }
};

/* ---------- MODE SWITCHING ---------- */
hardModeToggle.addEventListener("change", () => {
    const newMode = hardModeToggle.checked ? "hard" : "easy";
    if (currentMode === newMode) return;

    // Update current mode
    currentMode = newMode;

    // Update label
    sliderLabel.textContent = hardModeToggle.checked ? "HARD" : "EASY";

    // Update game rule text depending on mode
    const gameRuleEl = document.getElementById('game-rule');
    if (gameRuleEl) {
        if (currentMode === 'hard') {
            gameRuleEl.innerHTML = 'Tap the <img src="eye.png" alt="Show Tanglish" style="width:16px; vertical-align:middle;" /> icon to reveal the தங்lish word.';
        } else {
            gameRuleEl.innerHTML = 'This is <u><b>not a guessing game</b></u> — the word is already given.';
        }
    }

    // Reset and reinitialize game
    initializeGame();
    // Show keyboard if View Results is not visible
    const viewBtn = document.getElementById("viewResultsBtn");
    if (viewBtn && viewBtn.style.display === "none" && keyboardWrapper) {
        keyboardWrapper.style.display = "block";
    }
});

/* ---------- TOGGLE TANGLISH IN HARD MODE ---------- */
toggleTanglishBtn.addEventListener("click", () => {
    tanglishVisible = !tanglishVisible;
    updateDisplay();
});

/* ---------- STATISTICS MODAL ---------- */
const statsBtn = document.getElementById("statsBtn");
const statsModal = document.getElementById("statsModal");
const statsCloseBtn = statsModal.querySelector(".close-btn");

statsBtn.addEventListener("click", () => {
        renderStatsModal();
        statsModal.classList.remove("hidden");
});

statsCloseBtn.addEventListener("click", () => {
        statsModal.classList.add("hidden");
});

function renderStatsContent(statsContent) {
    let history = [];
    try {
        history = getGameHistory();
    } catch (e) {
        history = [];
    }
    // Only count finished games
    const finishedGames = history.filter(g => g.won !== undefined && g.attempts !== undefined);
    const gamesPlayed = finishedGames.length;
    const gamesWon = finishedGames.filter(g => g.won).length;
    const winPct = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

    // Streaks: sorted by date, only count days with a win, streak breaks if a day is missed or a loss occurs
    const byDate = [...finishedGames].sort((a, b) => a.date.localeCompare(b.date));
    let maxStreak = 0, currentStreak = 0, lastDate = null;
    let streak = 0;
    for (let i = 0; i < byDate.length; ++i) {
        const g = byDate[i];
        if (!g.won) {
            streak = 0;
            continue;
        }
        if (lastDate) {
            const prev = new Date(lastDate);
            const curr = new Date(g.date);
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak += 1;
            } else {
                streak = 1;
            }
        } else {
            streak = 1;
        }
        if (streak > maxStreak) maxStreak = streak;
        lastDate = g.date;
    }
    // Current streak: check from the end
    currentStreak = 0;
    if (byDate.length > 0) {
        let i = byDate.length - 1;
        let last = null;
        while (i >= 0 && byDate[i].won) {
            if (!last) {
                currentStreak = 1;
                last = byDate[i].date;
            } else {
                const prev = new Date(byDate[i].date);
                const curr = new Date(last);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    currentStreak += 1;
                    last = byDate[i].date;
                } else {
                    break;
                }
            }
            i--;
        }
    }

    // Guess distribution: 1, 2, 3 attempts
    const guessDist = [0, 0, 0];
    finishedGames.forEach(g => {
        if (g.won && g.attempts >= 1 && g.attempts <= 3) {
            guessDist[g.attempts - 1] += 1;
        }
    });

    // Render
    statsContent.innerHTML = `
      <div class="stats-row">
        <div class="stats-item"><strong>${gamesPlayed}</strong>Played</div>
        <div class="stats-item"><strong>${winPct}</strong>Win %</div>
        <div class="stats-item"><strong>${currentStreak}</strong>Current Streak</div>
        <div class="stats-item"><strong>${maxStreak}</strong>Max Streak</div>
      </div>
      <hr />
      <h4>Guess Distribution</h4>
      <div class="stats-barchart">
        <div class="bar"><span class="bar-label">1</span><span class="bar-value">${guessDist[0]}</span></div>
        <div class="bar"><span class="bar-label">2</span><span class="bar-value">${guessDist[1]}</span></div>
        <div class="bar"><span class="bar-label">3</span><span class="bar-value">${guessDist[2]}</span></div>
      </div>
    `;
}

function renderStatsModal() {
    const statsContent = document.getElementById("statsContent");
    if (statsContent) {
        renderStatsContent(statsContent);
    }
}

/* ---------- GAME ---------- */
document.getElementById("enter").onclick = () => {
    if (attempts >= 3) return;

    const letters = currentInput;
    if (letters.length !== target.length) {
        grids[currentAttempt].classList.add("shake");
        setTimeout(
            () => grids[currentAttempt].classList.remove("shake"),
            400,
        );
        return;
    }

    let rowEmoji = "";
    letters.forEach((l, i) => {
        if (l === target[i]) {
            rowEmoji += "🟩";
        } else {
            rowEmoji += "🟥";
        }
    });

    emojiGrid.push(rowEmoji);
    guesses.push([...letters]);
    attempts++;

    // Color the boxes for current attempt
    const boxes = grids[currentAttempt].querySelectorAll(".box");
    boxes.forEach((box, i) => {
        box.classList.add("flip");
        if (letters[i] === target[i]) {
            box.classList.add("correct");
        } else {
            box.classList.add("wrong");
        }
    });

    if (!rowEmoji.includes("🟥") || attempts === 3) {
        const won = !rowEmoji.includes("🟥");
        endGame(won);
        markPlayedToday(currentMode);
        saveGameState(currentMode, {
            attempts: attempts,
            currentAttempt: currentAttempt,
            emojiGrid: emojiGrid,
            guesses: guesses,
            finished: true,
            won: won,
        });
    } else {
        // Move to next attempt
        currentAttempt++;
        currentInput = [];
        // Save in-progress state
        saveGameState(currentMode, {
            attempts: attempts,
            currentAttempt: currentAttempt,
            currentInput: currentInput,
            emojiGrid: emojiGrid,
            guesses: guesses,
            finished: false,
        });
    }
};

function endGame(win, isRestore = false) {
    const modal = document.getElementById("resultmodal");
    const messageEl = document.getElementById("message");
    const shareEl = document.getElementById("share");
    const btn = document.getElementById("shareBtn");
    const popup = document.getElementById("myPopup");
    const closeBtn = document.querySelector(".resultmodalclose");


    // 1. Show the Modal only for live games, not on page restore
    if (!isRestore) {
        modal.style.display = "flex";
        // Record game result in history
        const today = new Date().toISOString().slice(0, 10);
        recordGameResult({
            date: today,
            mode: currentMode,
            won: win,
            attempts: attempts,
            guesses: guesses
        });
        // Render stats in resultmodal as well
        const statsContent = document.querySelector("#resultmodal #resultStatsContent");
        if (statsContent) renderStatsContent(statsContent);
    } else {
        // Show "View Results" button so user can open modal on demand
        const viewBtn = document.getElementById("viewResultsBtn");
        viewBtn.style.display = "block";
        // Hide the keyboard when View Results is shown
        if (keyboardWrapper) keyboardWrapper.style.display = "none";
        viewBtn.onclick = () => {
            modal.style.display = "flex";
            // Render stats in resultmodal as well
            const statsContent = document.querySelector("#resultmodal #resultStatsContent");
            if (statsContent) renderStatsContent(statsContent);
        };
    }

    // 2. Close Modal Logic
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    // 3. Disable input
    document.getElementById("enter").disabled = true;

    // 4. Set Result Message
    if (win) {
        messageEl.innerHTML = `Correct! 🎉`;
        messageEl.className = "message msg-success";
    } else {
        messageEl.innerHTML = `The correct word was: <br><span style="font-size: 28px; color: var(--error-color);">${word.tamil}</span>`;
        messageEl.className = "message msg-fail";
    }

    // 5. Prepare Share Content
    // We create an HTML version for the screen and a plain text version for the clipboard
    const modeHeader = `தமிழ் PAZHAGU [${currentMode.toUpperCase()}] #${getDailyWordIndex()}`;
    const gridContent = emojiGrid.join("<br />");

    // Display version (HTML)
    shareEl.innerHTML = `<div style="margin: 20px 0;">${gridContent}</div>`;

    // 6. Share Button Click Logic
    btn.onclick = () => {
        // Clipboard version (Plain Text)
        const plainTextGrid = emojiGrid.join("\n");
        const shareText = `${modeHeader}\n\n${plainTextGrid}\n\nPlay here: https://tamilpazhagu.com`;

        function showCopiedFeedback() {
            popup.classList.add("show");
            setTimeout(() => {
                popup.classList.remove("show");
            }, 2000);
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareText).then(showCopiedFeedback);
        } else {
            // Fallback for non-secure contexts (plain HTTP)
            const textArea = document.createElement("textarea");
            textArea.value = shareText;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            showCopiedFeedback();
        }
    };
}

/* ---------- KEY PRESS HANDLER FOR GRIDS ---------- */
const grids = [
    document.getElementById("grid1"),
    document.getElementById("grid2"),
    document.getElementById("grid3"),
];
let currentAttempt = 0;
let currentInput = [];
let guesses = [];

function renderGridForAttempt(attemptIndex) {
    if (attemptIndex >= grids.length) return;
    const grid = grids[attemptIndex];
    const boxes = grid.querySelectorAll(".box");

    boxes.forEach((box, i) => {
        if (i < currentInput.length) {
            box.textContent = currentInput[i];
        } else {
            box.textContent = "";
        }
    });
}

// Toggle visual disabled state for vowel modifier keys
function setVowelModifiersDisabled(disabled) {
    const vowelRow = document.getElementById('vowel-row');
    if (!vowelRow) return;
    const keys = vowelRow.querySelectorAll('.key');
    keys.forEach(k => {
        if (disabled) k.classList.add('disabled');
        else k.classList.remove('disabled');
    });
}

function handleKeyPress(event) {
    const key = event.key;

    // Only process Tamil characters
    if (!/[\u0B80-\u0BFF]/.test(key)) return;

    event.preventDefault();

    if (currentAttempt <= grids.length) {
        const grid = grids[currentAttempt];
        const boxes = grid.querySelectorAll(".box");

        if (currentInput.length <= boxes.length) {
            // Check if this is a vowel modifier and combine with previous character
            if (isVowelModifier(key) && currentInput.length > 0) {
                const prev = currentInput[currentInput.length - 1];
                // Do not combine a vowel modifier with an independent vowel
                if (!isIndependentVowel(prev)) {
                    currentInput[currentInput.length - 1] += key;
                } else {
                    // ignore combining modifier with independent vowel
                }
            } else if (currentInput.length === boxes.length) {
                // If the grid is full, do nothing
            } else {
                currentInput.push(key);
            }
            renderGridForAttempt(currentAttempt);
        }
    }
}

// Also handle keyboard clicks
document.querySelector(".keyboard").onclick = (e) => {
    if (!e.target.classList.contains("key")) return;

    if (e.target.id === "back") {
        currentInput.pop();
        renderGridForAttempt(currentAttempt);
    } else if (e.target.id === "enter") {
        // dont do anything
    } else {
        const key = e.target.textContent;
        if (currentAttempt <= grids.length) {
            const grid = grids[currentAttempt];
            const boxes = grid.querySelectorAll(".box");

            if (currentInput.length <= boxes.length) {
                if (isVowelModifier(key) && currentInput.length > 0) {
                    const prev = currentInput[currentInput.length - 1];
                    if (!isIndependentVowel(prev)) {
                        currentInput[currentInput.length - 1] += key;
                    } else {
                        // ignore combining modifier with independent vowel
                    }
                } else if (currentInput.length === boxes.length) {
                    // If the grid is full, do nothing
                } else {
                    currentInput.push(key);
                }
                renderGridForAttempt(currentAttempt);
            }
        }
    }
};

// Update visual state when clicking keys (disable diacritics if independent vowel selected)
document.querySelector('.keyboard').addEventListener('click', (e) => {
    if (!e.target.classList.contains('key')) return;
    const key = e.target.textContent;
    // If an independent vowel key was clicked and it's being added as a new character,
    // then disable vowel modifiers; otherwise re-enable.
    // Determine last character after the click effect by peeking at currentInput
    // (Note: click handler above already mutates currentInput before this runs)
    const last = currentInput.length > 0 ? currentInput[currentInput.length - 1] : null;
    if (last && isIndependentVowel(last[0])) {
        setVowelModifiersDisabled(true);
    } else {
        setVowelModifiersDisabled(false);
    }
});

document.addEventListener("keypress", handleKeyPress);
