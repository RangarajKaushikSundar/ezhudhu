// Decode Base64 to JSON
function decodeWord(base64Str) {
    try {
        const jsonStr = atob(base64Str.trim());
        return JSON.parse(jsonStr.trim());
    } catch (e) {
        console.error("Error decoding word:", base64Str, e);
        return null;
    }
}

/* ---------- TAMIL SPLIT ---------- */
function splitTamilSyllables(word) {
    const regex = /[\u0B85-\u0B94]|[\u0B95-\u0BB9][\u0BBE-\u0BCD]*/g;
    return word.match(regex) || [];
}

/* ---------- DAILY ---------- */
function getDailyWordIndex() {
    const now = new Date();
    const START_DATE = new Date("2026-02-05").getTime();
    const daysSinceEpoch = Math.floor(
        (now.getTime() - START_DATE) / (1000 * 60 * 60 * 24),
    );
    return daysSinceEpoch;
}

function getDailyWord(hardMode = false) {
    const index = getDailyWordIndex();
    const wordList = hardMode ? HARD_WORDS : WORDS;
    return wordList[index % wordList.length];
}

// Check if a character is a vowel modifier (from vowel-row)
function isVowelModifier(char) {
    const vowelModifiers = [
        "\u0BBE",
        "\u0BBF",
        "\u0BC0",
        "\u0BC1",
        "\u0BC2",
        "\u0BC6",
        "\u0BC7",
        "\u0BC8",
        "\u0BCB",
        "\u0BCA",
        "\u0BCC",
        "\u0BCD",
    ];
    return vowelModifiers.includes(char);
}

// Check if a character is an independent vowel (cannot take vowel modifiers)
function isIndependentVowel(char) {
    const independentVowels = [
        "\u0B85",
        "\u0B86",
        "\u0B87",
        "\u0B88",
        "\u0B89",
        "\u0B8A",
        "\u0B8E",
        "\u0B8F",
        "\u0B90",
        "\u0B92",
        "\u0B93",
        "\u0B94",
    ];
    return independentVowels.includes(char);
}
