/* ---------- MODAL LOGIC ---------- */
const modal = document.getElementById("howToPlayModal");
const closeBtn = modal.querySelector(".close-btn");
const gotItBtn = modal.querySelector(".primary-btn");

// Open modal (call this on first visit or help icon click)
function openHowToPlay() {
  modal.classList.remove("hidden");
}
openHowToPlay()

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
  const regex = /([\u0B85-\u0B94]|[\u0B95-\u0BB9][\u0BBE-\u0BCD]*)/g;
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

/* ---------- SETUP ---------- */
let currentMode = "normal";
let word = null;
let target = null;
let attempts = 0;
let emojiGrid = [];
let tanglishVisible = currentMode === "normal";

const gridEl1 = document.getElementById("grid1");
const gridEl2 = document.getElementById("grid2");
const gridEl3 = document.getElementById("grid3");
const keyboardWrapper = document.querySelector(".keyboard-wrapper");
const tanglishEl = document.getElementById("tanglish");
const toggleTanglishBtn = document.getElementById("toggleTanglishBtn");
const hardModeToggle = document.getElementById("hardModeToggle");
const modeLabel = document.getElementById("modeLabel");

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
  word = getDailyWord(currentMode === "hard");
  target = splitTamilSyllables(word.tamil);
  tanglishVisible = currentMode === "normal";

  // Reset display
  updateDisplay();
  renderEmptyGrid();

  // Re-enable enter button
  document.getElementById("enter").disabled = false;
  document.getElementById("resultmodal").style.display = "none";
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


// Fetch and load words from JSON file
  const WORDS = [
    { tamil: "நில்லு", tanglish: "Nillu", meaning: "Stand (command)" },
    { tamil: "அனுப்பு", tanglish: "Anuppu", meaning: "Send" },
    { tamil: "உட்கார்", tanglish: "Utkaar", meaning: "Sit" },
    { tamil: "நிறுத்து", tanglish: "Niruthu", meaning: "Stop" },
    { tamil: "தொடங்கு", tanglish: "Thodangu", meaning: "Start" },
    { tamil: "முடிக்க", tanglish: "Mudikka", meaning: "To finish" },
    { tamil: "மாற்று", tanglish: "Maatru", meaning: "Change" },
    { tamil: "பிரிவு", tanglish: "Pirivu", meaning: "Separation" },
    { tamil: "தெரியும்", tanglish: "Theriyum", meaning: "Know" },
    { tamil: "புரியும்", tanglish: "Puriyum", meaning: "Understand" },
    { tamil: "மறதி", tanglish: "Maradhi", meaning: "Forgetfulness" },
    { tamil: "முயற்சி", tanglish: "Muyarchi", meaning: "Effort" },
    { tamil: "சோதனை", tanglish: "Sodhanai", meaning: "Test / Check" },
    { tamil: "கூட்டம்", tanglish: "Koottam", meaning: "Crowd / Meeting" },
    { tamil: "சிரிப்பு", tanglish: "Sirippu", meaning: "Laughter" },
    { tamil: "அழுகை", tanglish: "Azhugai", meaning: "Crying" },
    { tamil: "பார்வை", tanglish: "Paarvai", meaning: "Sight / Vision" },
    { tamil: "மூச்சு", tanglish: "Moochu", meaning: "Breath" },
    { tamil: "பேச்சு", tanglish: "Peechu", meaning: "Speech" },
    { tamil: "பாசம்", tanglish: "Paasam", meaning: "Affection" },
    { tamil: "நட்பு", tanglish: "Natpu", meaning: "Friendship" },
    { tamil: "உதவி", tanglish: "Udhavi", meaning: "Help" },
    { tamil: "பரிசு", tanglish: "Parisu", meaning: "Gift" },
    { tamil: "வெற்றி", tanglish: "Vetri", meaning: "Victory" },
    { tamil: "தோல்வி", tanglish: "Tholvi", meaning: "Failure" },
    { tamil: "கவலை", tanglish: "Kavalai", meaning: "Worry" },
    { tamil: "அமைதி", tanglish: "Amaidhi", meaning: "Peace" },
    { tamil: "கோபம்", tanglish: "Kobam", meaning: "Anger" },
    { tamil: "பயம்", tanglish: "Bayam", meaning: "Fear" },
    { tamil: "உண்மை", tanglish: "Unmai", meaning: "Truth" },
    { tamil: "துணிவு", tanglish: "Thunivu", meaning: "Courage" },
    { tamil: "அறிவு", tanglish: "Arivu", meaning: "Intellect" },
    { tamil: "வாழ்க்கை", tanglish: "Vaazhkai", meaning: "Life" },
    { tamil: "கனவு", tanglish: "Kanavu", meaning: "Dream" },
    { tamil: "நினைவு", tanglish: "Ninaivu", meaning: "Memory" },
    { tamil: "எண்ணம்", tanglish: "Ennam", meaning: "Thought" },
    { tamil: "செயல்", tanglish: "Seyal", meaning: "Action" },
    { tamil: "பதில்", tanglish: "Badhil", meaning: "Answer" },
    { tamil: "கேள்வி", tanglish: "Kelvi", meaning: "Question" },
    { tamil: "பாடம்", tanglish: "Paadam", meaning: "Lesson" },
    { tamil: "தேர்வு", tanglish: "Thervu", meaning: "Exam" },
    { tamil: "பள்ளி", tanglish: "Palli", meaning: "School" },
    { tamil: "வாசல்", tanglish: "Vaasal", meaning: "Entrance" },
    { tamil: "கதவு", tanglish: "Kadhavu", meaning: "Door" },
    { tamil: "பெட்டி", tanglish: "Petti", meaning: "Box" },
    { tamil: "கட்டில்", tanglish: "Kattil", meaning: "Bed" },
    { tamil: "படுக்கை", tanglish: "Padukkai", meaning: "Bedding" },
    { tamil: "போர்வை", tanglish: "Porvai", meaning: "Blanket" },
    { tamil: "சட்டை", tanglish: "Chattai", meaning: "Shirt" },
    { tamil: "பணம்", tanglish: "Panam", meaning: "Cash" },
    { tamil: "மலிவு", tanglish: "Malivu", meaning: "Cheap" },
    { tamil: "சந்தை", tanglish: "Sandhai", meaning: "Market" },
    { tamil: "வண்டி", tanglish: "Vandi", meaning: "Cart / Vehicle" },
    { tamil: "குளம்", tanglish: "Kulam", meaning: "Pond" },
    { tamil: "மரம்", tanglish: "Maram", meaning: "Tree" },
    { tamil: "பழம்", tanglish: "Pazham", meaning: "Fruit" },
    { tamil: "பூக்கள்", tanglish: "Pookal", meaning: "Flowers" },
    { tamil: "மலர்", tanglish: "Malar", meaning: "Blossom" },
    { tamil: "சிங்கம்", tanglish: "Singam", meaning: "Lion" },
    { tamil: "தங்கம்", tanglish: "Thangam", meaning: "Gold" },
    { tamil: "கப்பல்", tanglish: "Kappal", meaning: "Ship" },
    { tamil: "வட்டம்", tanglish: "Vattam", meaning: "Circle" },
    { tamil: "சத்தம்", tanglish: "Satham", meaning: "Sound / Noise" },
    { tamil: "முத்தம்", tanglish: "Mutham", meaning: "Kiss" },
    { tamil: "பந்தம்", tanglish: "Bandham", meaning: "Bond / Relation" },
    { tamil: "சந்தம்", tanglish: "Sandham", meaning: "Rhythm" },
    { tamil: "அந்தம்", tanglish: "Antham", meaning: "End" },
    { tamil: "இதயம்", tanglish: "Idhayam", meaning: "Heart" },
    { tamil: "உலகம்", tanglish: "Ulagam", meaning: "World" },
    { tamil: "உதயம்", tanglish: "Udhayam", meaning: "Sunrise" },
    { tamil: "சமயம்", tanglish: "Samayam", meaning: "Time / Religion" },
    { tamil: "மையம்", tanglish: "Maiyam", meaning: "Center" },
    { tamil: "பயணம்", tanglish: "Payanam", meaning: "Journey" },
    { tamil: "நகரம்", tanglish: "Nagaram", meaning: "City" },
    { tamil: "எறும்பு", tanglish: "Erumbu", meaning: "Ant" },
    { tamil: "வாத்து", tanglish: "Vaathu", meaning: "Duck" },
    { tamil: "மயில்", tanglish: "Mayil", meaning: "Peacock" },
    { tamil: "காகம்", tanglish: "Kaagam", meaning: "Crow" },
    { tamil: "குயில்", tanglish: "Kuyil", meaning: "Cuckoo" },
    { tamil: "பாம்பு", tanglish: "Paambu", meaning: "Snake" },
    { tamil: "குரங்கு", tanglish: "Kurangu", meaning: "Monkey" },
    { tamil: "மீன்கள்", tanglish: "Meengal", meaning: "Fish" },
    { tamil: "நாய்கள்", tanglish: "Naaygal", meaning: "Dogs" },
    { tamil: "பருந்து", tanglish: "Parundhu", meaning: "Eagle" },
    { tamil: "வானம்", tanglish: "Vaanam", meaning: "Sky" },
    { tamil: "சூரியன்", tanglish: "Sooriyan", meaning: "Sun" },
    { tamil: "காற்று", tanglish: "Kaatru", meaning: "Wind / Air" },
    { tamil: "புயல்", tanglish: "Puyal", meaning: "Storm" },
    { tamil: "மின்னல்", tanglish: "Minnal", meaning: "Lightning" },
    { tamil: "மேகம்", tanglish: "Megam", meaning: "Cloud" },
    { tamil: "பூக்கள்", tanglish: "Pookkal", meaning: "Flowers" },
    { tamil: "தண்டு", tanglish: "Thandu", meaning: "Stem" },
    { tamil: "முன்னால்", tanglish: "Munnaal", meaning: "In front" },
    { tamil: "பின்னால்", tanglish: "Pinnaal", meaning: "Behind" },
    { tamil: "அங்கே", tanglish: "Angae", meaning: "There" },
    { tamil: "இங்கே", tanglish: "Ingae", meaning: "Here" },
    { tamil: "எங்கே", tanglish: "Engae", meaning: "Where" },
    { tamil: "சதுரம்", tanglish: "Sathuram", meaning: "Square" },
    { tamil: "உயரம்", tanglish: "Uyaram", meaning: "Height" },
    { tamil: "அகலம்", tanglish: "Agalam", meaning: "Width" },
    { tamil: "ஆழம்", tanglish: "Aazham", meaning: "Depth" },
    { tamil: "அளவு", tanglish: "Alavu", meaning: "Measure" },
    { tamil: "ஒருவன்", tanglish: "Oruvan", meaning: "One man" },
    { tamil: "நாங்கள்", tanglish: "Naangal", meaning: "We" },
    { tamil: "நீங்கள்", tanglish: "Neengal", meaning: "You (plural)" },
    { tamil: "எவள்", tanglish: "Eval", meaning: "Which woman" },
    { tamil: "எவன்", tanglish: "Evan", meaning: "Which man" },
    { tamil: "எதற்கு", tanglish: "Edharku", meaning: "Why" },
    { tamil: "எப்போது", tanglish: "Eppodhu", meaning: "When" },
    { tamil: "வெள்ளை", tanglish: "Vellai", meaning: "White" },
    { tamil: "மஞ்சள்", tanglish: "Manjal", meaning: "Yellow" },
    { tamil: "நீலம்", tanglish: "Neelam", meaning: "Blue" },
    { tamil: "சிவப்பு", tanglish: "Sivappu", meaning: "Red" },
    { tamil: "கருப்பு", tanglish: "Karuppu", meaning: "Black" },
    { tamil: "பசுமை", tanglish: "Pasumai", meaning: "Greenery" },
    { tamil: "தூய்மை", tanglish: "Thooimai", meaning: "Purity / Clean" },
    { tamil: "இனிமை", tanglish: "Inimai", meaning: "Sweetness" },
    { tamil: "அருமை", tanglish: "Arumai", meaning: "Excellence" },
    { tamil: "பெருமை", tanglish: "Perumai", meaning: "Pride" },
    { tamil: "வறுமை", tanglish: "Varumai", meaning: "Poverty" },
    { tamil: "செல்வம்", tanglish: "Selvam", meaning: "Wealth" },
    { tamil: "வாழ்வு", tanglish: "Vaazhvu", meaning: "Life" },
    { tamil: "பிறப்பு", tanglish: "Pirappu", meaning: "Birth" },
    { tamil: "இறப்பு", tanglish: "Irappu", meaning: "Death" },
    { tamil: "உடம்பு", tanglish: "Udambu", meaning: "Body" },
    { tamil: "எலும்பு", tanglish: "Elumbu", meaning: "Bone" },
    { tamil: "நரம்பு", tanglish: "Narambu", meaning: "Nerve" },
    { tamil: "அரிசி", tanglish: "Arisi", meaning: "Rice" },
    { tamil: "பருப்பு", tanglish: "Paruppu", meaning: "Lentil / Dal" },
    { tamil: "தயிர்", tanglish: "Thayir", meaning: "Curd" },
    { tamil: "உப்பு", tanglish: "Uppu", meaning: "Salt" },
    { tamil: "இனிப்பு", tanglish: "Inippu", meaning: "Sweet" },
    { tamil: "கசப்பு", tanglish: "Kasappu", meaning: "Bitter" },
    { tamil: "புளிப்பு", tanglish: "Pulippu", meaning: "Sour" },
    { tamil: "காரம்", tanglish: "Kaaram", meaning: "Spicy" },
    { tamil: "தெய்வம்", tanglish: "Deivam", meaning: "God" },
    { tamil: "ஞானம்", tanglish: "Gnaanam", meaning: "Wisdom" },
    { tamil: "யோகம்", tanglish: "Yogam", meaning: "Yoga / Luck" },
    { tamil: "வேதம்", tanglish: "Vedham", meaning: "Veda / Scripture" },
    { tamil: "பாடல்", tanglish: "Paadal", meaning: "Song" },
    { tamil: "தாளம்", tanglish: "Thaalam", meaning: "Rhythm / Beat" },
    { tamil: "மேளம்", tanglish: "Melam", meaning: "Drum" },
    { tamil: "குழல்", tanglish: "Kuzhal", meaning: "Flute" },
    { tamil: "ஆட்டம்", tanglish: "Aattam", meaning: "Dance / Play" },
    { tamil: "ஓவியம்", tanglish: "Ooviyam", meaning: "Painting" },
    { tamil: "சிற்பம்", tanglish: "Sirpam", meaning: "Sculpture" },
    { tamil: "எழுத்து", tanglish: "Ezhuthu", meaning: "Letter / Script" },
    { tamil: "பக்கம்", tanglish: "Pakkam", meaning: "Page / Side" },
    { tamil: "லாபம்", tanglish: "Laabam", meaning: "Profit" },
    { tamil: "நட்டம்", tanglish: "Nattam", meaning: "Loss" },
  ];
  const HARD_WORDS = [
    { tamil: "வணக்கம்", tanglish: "Vanakkam", meaning: "Hello/Greetings" },
    { tamil: "மறுபடியும்", tanglish: "Marupadiyum", meaning: "Again" },
    { tamil: "நட்சத்திரம்", tanglish: "Natchathiram", meaning: "Star" },
    {
      tamil: "மழைக்காலம்",
      tanglish: "Mazhaikkaalam",
      meaning: "Rainy season",
    },
    { tamil: "ஆசிரியர்", tanglish: "Aasiriyar", meaning: "Teacher" },
    { tamil: "பேருந்து", tanglish: "Perunthu", meaning: "Bus" },
    { tamil: "மகிழ்ச்சி", tanglish: "Magizhchi", meaning: "Happiness" },
    { tamil: "குடும்பம்", tanglish: "Kudumbam", meaning: "Family" },
    { tamil: "புத்தகம்", tanglish: "Puthagam", meaning: "Book" },
    { tamil: "சுதந்திரம்", tanglish: "Sudandhiram", meaning: "Freedom" },
    { tamil: "சமத்துவம்", tanglish: "Samathuvam", meaning: "Equality" },
    {
      tamil: "பாரம்பரியம்",
      tanglish: "Parampariyam",
      meaning: "Tradition",
    },
    {
      tamil: "தொழில்நுட்பம்",
      tanglish: "Thozhilnutpam",
      meaning: "Technology",
    },
    {
      tamil: "சுற்றுச்சூழல்",
      tanglish: "Sutru-soozhal",
      meaning: "Environment",
    },
    {
      tamil: "நிலைத்தன்மை",
      tanglish: "Nilai-thunmai",
      meaning: "Sustainability",
    },
    { tamil: "சர்க்கரை", tanglish: "Sarkkarai", meaning: "Sugar" },
    { tamil: "தொலைபேசி", tanglish: "Tholaipesi", meaning: "Telephone" },
    { tamil: "மணிகாட்டி", tanglish: "Manikaatti", meaning: "Watch/Clock" },
    { tamil: "கொண்டுவா", tanglish: "Konduvaa", meaning: "Bring" },
    { tamil: "விளையாடு", tanglish: "Vilaiyaadu", meaning: "Play" },
    { tamil: "வரைபடம்", tanglish: "Varaipadam", meaning: "Map" },
    { tamil: "விடுமுறை", tanglish: "Vidumurai", meaning: "Holiday" },
    { tamil: "பலமில்லை", tanglish: "Balamillai", meaning: "Weakness" },
    { tamil: "பணக்கார", tanglish: "Panakkaara", meaning: "Rich" },
    { tamil: "மருத்துவர்", tanglish: "Maruthuvar", meaning: "Doctor" },
    { tamil: "தொழிலாளி", tanglish: "Thozhilaali", meaning: "Worker" },
    { tamil: "விருந்தினர்", tanglish: "Virundhinar", meaning: "Guest" },
    { tamil: "முதலாளி", tanglish: "Mudhalaali", meaning: "Owner/Boss" },
    { tamil: "ஓட்டுநர்", tanglish: "Ottunar", meaning: "Driver" },
    { tamil: "இயந்திரம்", tanglish: "Iyandhiram", meaning: "Machine" },
    { tamil: "மின்சாரம்", tanglish: "Minsaaram", meaning: "Electricity" },
    { tamil: "ஏனென்றால்", tanglish: "Aen-enraal", meaning: "Because" },
    { tamil: "சமையலறை", tanglish: "Samaiyal-arai", meaning: "Kitchen" },
    { tamil: "அஞ்சலகம்", tanglish: "Anjalagam", meaning: "Post Office" },
    { tamil: "ஞாபகம்", tanglish: "Gnaabagam", meaning: "Memory" },
    { tamil: "அரசாங்கம்", tanglish: "Arasaangam", meaning: "Government" },
    { tamil: "அலுவலகம்", tanglish: "Aluvalagam", meaning: "Office" },
    { tamil: "அறிவியல்", tanglish: "Ariviyal", meaning: "Science" },
    { tamil: "அரசாட்சி", tanglish: "Arasaatchi", meaning: "Governance" },
    { tamil: "மணிநேரம்", tanglish: "Manineram", meaning: "Hour" },
    { tamil: "மாதங்கள்", tanglish: "Maadhangal", meaning: "Months" },
    {
      tamil: "காலகட்டம்",
      tanglish: "Kaalagattam",
      meaning: "Period of time",
    },
    { tamil: "திருமணம்", tanglish: "Thirumanam", meaning: "Marriage" },
    { tamil: "பள்ளிக்கூடம்", tanglish: "Pallikkoodam", meaning: "School" },
    {
      tamil: "பாடப்புத்தகம்",
      tanglish: "Paadaputhagam",
      meaning: "Textbook",
    },
    { tamil: "எழுதுகோல்", tanglish: "Ezhudhukol", meaning: "Pen" },
    {
      tamil: "கரும்பலகை",
      tanglish: "Karumbhalagai",
      meaning: "Blackboard",
    },
    { tamil: "வகுப்பறை", tanglish: "Vagupparai", meaning: "Classroom" },
    {
      tamil: "விளையாட்டு",
      tanglish: "Vilaiyaattu",
      meaning: "Game/Sports",
    },
    { tamil: "உடற்பயிற்சி", tanglish: "Udarpayirchi", meaning: "Exercise" },
    { tamil: "மருத்துவம்", tanglish: "Maruthuvam", meaning: "Medicine" },
    { tamil: "காய்கறிகள்", tanglish: "Kaaygarigal", meaning: "Vegetables" },
    { tamil: "உணவுகள்", tanglish: "Unavugal", meaning: "Foods" },
    { tamil: "பலகாரம்", tanglish: "Palagaaram", meaning: "Snacks" },
    { tamil: "பானங்கள்", tanglish: "Paanangal", meaning: "Drinks" },
    { tamil: "விலங்குகள்", tanglish: "Vilangugal", meaning: "Animals" },
    { tamil: "பறவைகள்", tanglish: "Paravaigal", meaning: "Birds" },
    { tamil: "பூச்சிகள்", tanglish: "Poochigal", meaning: "Insects" },
    { tamil: "மேகங்கள்", tanglish: "Maegangal", meaning: "Clouds" },
    { tamil: "இடிமுழக்கம்", tanglish: "Idimuzhakkam", meaning: "Thunder" },
    { tamil: "பாலைவனம்", tanglish: "Paalaivanam", meaning: "Desert" },
    { tamil: "தெருக்கள்", tanglish: "Therukkal", meaning: "Streets" },
    { tamil: "ஜன்னல்கள்", tanglish: "Jannalgal", meaning: "Windows" },
    { tamil: "நாற்காலிகள்", tanglish: "Naarkaaligal", meaning: "Chairs" },
    { tamil: "விளக்குகள்", tanglish: "Vilakkugal", meaning: "Lights" },
    { tamil: "கடிகாரம்", tanglish: "Kadigaram", meaning: "Clock" },
    { tamil: "கடிதங்கள்", tanglish: "Kadidhangal", meaning: "Letters" },
    { tamil: "வார்த்தைகள்", tanglish: "Vaarthigal", meaning: "Words" },
    { tamil: "வாக்கியம்", tanglish: "Vaakkiyam", meaning: "Sentence" },
    { tamil: "இலக்கணம்", tanglish: "Ilakkanam", meaning: "Grammar" },
    { tamil: "தலைநகரம்", tanglish: "Thalainagaram", meaning: "Capital" },
    {
      tamil: "போக்குவரத்து",
      tanglish: "Pokkuvarathu",
      meaning: "Transport",
    },
    {
      tamil: "நிர்வாகம்",
      tanglish: "Nirvaagam",
      meaning: "Administration",
    },
    { tamil: "உண்மையான", tanglish: "Unmaiyaana", meaning: "Truthful" },
    { tamil: "முன்னேற்றம்", tanglish: "Munnetram", meaning: "Progress" },
    {
      tamil: "கண்டுபிடிப்பு",
      tanglish: "Kandupidipu",
      meaning: "Invention",
    },
    { tamil: "விண்வெளி", tanglish: "Vinveli", meaning: "Space" },
    { tamil: "உயிரினம்", tanglish: "Uyirinam", meaning: "Living thing" },
    { tamil: "விலங்கியல்", tanglish: "Vilangiyal", meaning: "Zoology" },
    { tamil: "புவியியல்", tanglish: "Puviyiyal", meaning: "Geography" },
    { tamil: "இலக்கியம்", tanglish: "Ilakkiyam", meaning: "Literature" },
    { tamil: "மனசாட்சி", tanglish: "Manasaatchi", meaning: "Conscience" },
    { tamil: "நம்பிக்கை", tanglish: "Nambikkai", meaning: "Confidence" },
    { tamil: "ஒழுக்கம்", tanglish: "Ozhukkam", meaning: "Discipline" },
    { tamil: "மன்னிப்பு", tanglish: "Mannippu", meaning: "Forgiveness" },
    { tamil: "ஆரோக்கியம்", tanglish: "Aarokkiyam", meaning: "Health" },
    { tamil: "கலாச்சாரம்", tanglish: "Kalaachaaram", meaning: "Culture" },
    { tamil: "நாகரிகம்", tanglish: "Naagarigam", meaning: "Civilization" },
    { tamil: "மின்அஞ்சல்", tanglish: "Min-anjal", meaning: "Email" },
    { tamil: "கடவுச்சொல்", tanglish: "Kadavuchol", meaning: "Password" },
    { tamil: "பதிவேற்றம்", tanglish: "Padhivetram", meaning: "Upload" },
    {
      tamil: "திரையரங்கம்",
      tanglish: "Thiraiyarangam",
      meaning: "Theater",
    },
    { tamil: "புகைப்படம்", tanglish: "Pugaippadam", meaning: "Photograph" },
    {
      tamil: "இசைக்கருவி",
      tanglish: "Isaikkaruvi",
      meaning: "Musical instrument",
    },
    { tamil: "திருவிழா", tanglish: "Thiruvizha", meaning: "Festival" },
    {
      tamil: "கொண்டாட்டம்",
      tanglish: "Kondaattam",
      meaning: "Celebration",
    },
    {
      tamil: "விமானநிலையம்",
      tanglish: "Vimaananilaiyam",
      meaning: "Airport",
    },
    { tamil: "பயணிகள்", tanglish: "Payanigal", meaning: "Passengers" },
    {
      tamil: "முன்னெச்சரிக்கை",
      tanglish: "Munnecharikkai",
      meaning: "Precaution",
    },
    {
      tamil: "தொலைக்காட்சி",
      tanglish: "Tholaikaatchi",
      meaning: "Television",
    },
    { tamil: "தொலைநோக்கி", tanglish: "Tholainokki", meaning: "Telescope" },
    { tamil: "நுண்ணோக்கி", tanglish: "Nunnokki", meaning: "Microscope" },
    { tamil: "விண்மீன்கள்", tanglish: "Vinmeengal", meaning: "Stars" },
    { tamil: "கோள்கள்", tanglish: "Kolgal", meaning: "Planets" },
    {
      tamil: "விண்வெளிவீரர்",
      tanglish: "Vinveliveerar",
      meaning: "Astronaut",
    },
    { tamil: "வானிலை", tanglish: "Vaanilai", meaning: "Weather" },
    { tamil: "வெப்பநிலை", tanglish: "Veppanilai", meaning: "Temperature" },
    {
      tamil: "நிலநடுக்கம்",
      tanglish: "Nilanadukkam",
      meaning: "Earthquake",
    },
    { tamil: "சுனாமி", tanglish: "Sunami", meaning: "Tsunami" },
    { tamil: "எரிமலை", tanglish: "Erimalai", meaning: "Volcano" },
    { tamil: "அதிகாரி", tanglish: "Adhigari", meaning: "Officer" },
    { tamil: "வழக்கறிஞர்", tanglish: "Vazhakkaringnar", meaning: "Lawyer" },
    { tamil: "விஞ்ஞானி", tanglish: "Vingnaani", meaning: "Scientist" },
    { tamil: "கலைஞர்", tanglish: "Kalaignar", meaning: "Artist" },
    { tamil: "வீரர்", tanglish: "Veerar", meaning: "Warrior/Hero" },
    { tamil: "விவசாயி", tanglish: "Vivasayi", meaning: "Farmer" },
    { tamil: "நெசவாளர்", tanglish: "Nesavalar", meaning: "Weaver" },
    { tamil: "தச்சன்", tanglish: "Thatchan", meaning: "Carpenter" },
    {
      tamil: "காவல்துறை",
      tanglish: "Kaaval-thurai",
      meaning: "Police Force",
    },
    {
      tamil: "தீயணைப்பு",
      tanglish: "Theeyanaippu",
      meaning: "Firefighting",
    },
    {
      tamil: "நினைவுச்சின்னம்",
      tanglish: "Ninaivuchinnam",
      meaning: "Monument",
    },
    {
      tamil: "அருங்காட்சியகம்",
      tanglish: "Arungaatchiyagam",
      meaning: "Museum",
    },
    { tamil: "தேவாலயம்", tanglish: "Devaalayam", meaning: "Church" },
    { tamil: "மசூதி", tanglish: "Masoodhi", meaning: "Mosque" },
    {
      tamil: "திருக்குளம்",
      tanglish: "Thirukkulam",
      meaning: "Temple Tank",
    },
    {
      tamil: "விளையாட்டுத்திடல்",
      tanglish: "Vilaiyattu-thidal",
      meaning: "Playground",
    },
    {
      tamil: "நீச்சல்-குளம்",
      tanglish: "Neechal-kulam",
      meaning: "Swimming Pool",
    },
    { tamil: "உணவகம்", tanglish: "Unavagam", meaning: "Restaurant" },
    { tamil: "கடற்கரை", tanglish: "Kadarkarai", meaning: "Beach" },
    {
      tamil: "மலைச்சிகரம்",
      tanglish: "Malaichigaram",
      meaning: "Mountain Peak",
    },
    { tamil: "பெருங்கடல்", tanglish: "Perungadal", meaning: "Ocean" },
    { tamil: "ஆறுகள்", tanglish: "Aarugal", meaning: "Rivers" },
    {
      tamil: "நீர்வீழ்ச்சி",
      tanglish: "Neerveezhchi",
      meaning: "Waterfall",
    },
    { tamil: "ஏரிகள்", tanglish: "Aerigal", meaning: "Lakes" },
    { tamil: "காடுகள்", tanglish: "Kadugal", meaning: "Forests" },
    { tamil: "செடிகள்", tanglish: "Sedigal", meaning: "Plants" },
    { tamil: "பூக்கள்", tanglish: "Pookkal", meaning: "Flowers" },
    { tamil: "கனிகள்", tanglish: "Kanigal", meaning: "Fruits" },
    { tamil: "விதைகள்", tanglish: "Vidhaigal", meaning: "Seeds" },
    { tamil: "வேர்கள்", tanglish: "Vergal", meaning: "Roots" },
    { tamil: "கிளைகள்", tanglish: "Kilaigal", meaning: "Branches" },
    { tamil: "இலைகள்", tanglish: "Ilaigal", meaning: "Leaves" },
    {
      tamil: "வண்ணத்துப்பூச்சி",
      tanglish: "Vannathupoochi",
      meaning: "Butterfly",
    },
    { tamil: "தேன்-தேனீ", tanglish: "Thenee", meaning: "Honeybee" },
    {
      tamil: "வெட்டுக்கிளி",
      tanglish: "Vettukkili",
      meaning: "Grasshopper",
    },
    {
      tamil: "கரப்பான்-பூச்சி",
      tanglish: "Karappan-poochi",
      meaning: "Cockroach",
    },
    { tamil: "மண்புழு", tanglish: "Manpuzhu", meaning: "Earthworm" },
    { tamil: "முதலை", tanglish: "Mudhalai", meaning: "Crocodile" },
    { tamil: "ஆமை", tanglish: "Aamai", meaning: "Turtle" },
    { tamil: "தவளை", tanglish: "Thavalai", meaning: "Frog" },
    { tamil: "மீன்கள்", tanglish: "Meengal", meaning: "Fish" },
    { tamil: "சுறா-மீன்", tanglish: "Sura-meen", meaning: "Shark" },
    { tamil: "திமிங்கலம்", tanglish: "Thimingalam", meaning: "Whale" },
    { tamil: "நண்டுகள்", tanglish: "Nandugal", meaning: "Crabs" },
    { tamil: "சிப்பிகள்", tanglish: "Sippigal", meaning: "Shells" },
    {
      tamil: "உடல்நலம்",
      tanglish: "Udalanalam",
      meaning: "Physical Health",
    },
    { tamil: "மனநலம்", tanglish: "Mananalam", meaning: "Mental Health" },
    { tamil: "சுவாசம்", tanglish: "Suvaasam", meaning: "Breath" },
    { tamil: "செரிமானம்", tanglish: "Serimaanam", meaning: "Digestion" },
    { tamil: "உணர்ச்சிகள்", tanglish: "Unarchigal", meaning: "Emotions" },
    { tamil: "கோபம்", tanglish: "Kobam", meaning: "Anger" },
    { tamil: "அச்சம்", tanglish: "Acham", meaning: "Fear" },
    { tamil: "கவலை", tanglish: "Kavalai", meaning: "Worry" },
    { tamil: "ஆச்சரியம்", tanglish: "Aachariyam", meaning: "Surprise" },
    { tamil: "பொறாமை", tanglish: "Poraamai", meaning: "Jealousy" },
    { tamil: "கருணை", tanglish: "Karunai", meaning: "Compassion" },
    { tamil: "அன்பு", tanglish: "Anbu", meaning: "Love" },
    { tamil: "வீரம்", tanglish: "Veeram", meaning: "Bravery" },
    { tamil: "மரியாதை", tanglish: "Mariyadhai", meaning: "Respect" },
    { tamil: "கடமை", tanglish: "Kadamai", meaning: "Duty" },
    { tamil: "பொறுப்பு", tanglish: "Poruppu", meaning: "Responsibility" },
    { tamil: "நேர்மை", tanglish: "Nermai", meaning: "Honesty" },
    { tamil: "வாய்மை", tanglish: "Vaimai", meaning: "Truth" },
    { tamil: "பெருமை", tanglish: "Perumai", meaning: "Pride" },
    { tamil: "நகைச்சுவை", tanglish: "Nagaichuvai", meaning: "Humor" },
    {
      tamil: "தன்னம்பிக்கை",
      tanglish: "Thannambikkai",
      meaning: "Self-confidence",
    },
    { tamil: "சுதந்திரம்", tanglish: "Sudhandhiram", meaning: "Freedom" },
    { tamil: "வெற்றி", tanglish: "Vetri", meaning: "Success" },
    { tamil: "தோல்வி", tanglish: "Tholvi", meaning: "Failure" },
    { tamil: "முயற்சி", tanglish: "Muyarchi", meaning: "Effort" },
    { tamil: "பயிற்சி", tanglish: "Payirchi", meaning: "Practice" },
    { tamil: "ஆராய்ச்சி", tanglish: "Aaraichi", meaning: "Research" },
    { tamil: "கற்பனை", tanglish: "Karpanai", meaning: "Imagination" },
    { tamil: "சிந்தனை", tanglish: "Sinthanai", meaning: "Thought" },
    {
      tamil: "புத்திசாலித்தனம்",
      tanglish: "Buthisalithanam",
      meaning: "Intelligence",
    },
    { tamil: "விவேகம்", tanglish: "Vivegam", meaning: "Wisdom" },
    { tamil: "அனுபவம்", tanglish: "Anubhavam", meaning: "Experience" },
    { tamil: "உந்துதல்", tanglish: "Undhuthal", meaning: "Motivation" },
    { tamil: "திறமை", tanglish: "Thiramai", meaning: "Talent" },
    {
      tamil: "கலைத்திறன்",
      tanglish: "Kalaithiran",
      meaning: "Artistic Skill",
    },
    { tamil: "வளர்ச்சி", tanglish: "Valarchi", meaning: "Growth" },
    { tamil: "மாற்றம்", tanglish: "Maatram", meaning: "Change" },
    { tamil: "புரட்சி", tanglish: "Puratchi", meaning: "Revolution" },
    { tamil: "அமைதி", tanglish: "Amaithi", meaning: "Peace" },
    { tamil: "ஒற்றுமை", tanglish: "Otrumai", meaning: "Unity" },
    {
      tamil: "சகிப்புத்தன்மை",
      tanglish: "Sakipputhanmai",
      meaning: "Tolerance",
    },
    { tamil: "நாகரிகம்", tanglish: "Naagarigam", meaning: "Civilization" },
    { tamil: "வரலாறு", tanglish: "Varalaaru", meaning: "History" },
    { tamil: "புவியியல்", tanglish: "Puviyiyal", meaning: "Geography" },
    { tamil: "அரசியல்", tanglish: "Arasiyal", meaning: "Politics" },
    { tamil: "நீதிமன்றம்", tanglish: "Neethimandram", meaning: "Court" },
    {
      tamil: "வாக்குமூலம்",
      tanglish: "Vaakkumoolam",
      meaning: "Testimony",
    },
    { tamil: "சாட்சியம்", tanglish: "Saatchiyam", meaning: "Evidence" },
    {
      tamil: "குற்றச்சாட்டு",
      tanglish: "Kutrachattu",
      meaning: "Accusation",
    },
    {
      tamil: "தண்டனைகள்",
      tanglish: "Thandanaigal",
      meaning: "Punishments",
    },
    { tamil: "பிணைக்கைதி", tanglish: "Pinaikkaidhi", meaning: "Hostage" },
    {
      tamil: "சட்டமன்றம்",
      tanglish: "Sattamanram",
      meaning: "Legislative Assembly",
    },
    { tamil: "நகராட்சி", tanglish: "Nagaraatchi", meaning: "Municipality" },
    {
      tamil: "ஊராட்சிகள்",
      tanglish: "Ooraatchigal",
      meaning: "Village Councils",
    },
    {
      tamil: "மாவட்டங்கள்",
      tanglish: "Maavattangal",
      meaning: "Districts",
    },
    {
      tamil: "இதயத்துடிப்பு",
      tanglish: "Idhayathudippu",
      meaning: "Heartbeat",
    },
    {
      tamil: "இரத்தக்கொதிப்பு",
      tanglish: "Rathakkodhippu",
      meaning: "Blood pressure",
    },
    { tamil: "நுரையீரல்", tanglish: "Nuraieeral", meaning: "Lungs" },
    { tamil: "செரிமானம்", tanglish: "Serimaanam", meaning: "Digestion" },
    {
      tamil: "தசைநார்கள்",
      tanglish: "Thasainaargal",
      meaning: "Muscles/Ligaments",
    },
    {
      tamil: "மூச்சுக்குழாய்",
      tanglish: "Moocchukuzhaai",
      meaning: "Windpipe",
    },
    {
      tamil: "நரம்புமண்டலம்",
      tanglish: "Narambumandalam",
      meaning: "Nervous system",
    },
    {
      tamil: "கண்மணிகள்",
      tanglish: "Kanmanigal",
      meaning: "Pupils of the eye",
    },
    { tamil: "சிறுநீரகம்", tanglish: "Siruneeragam", meaning: "Kidney" },
    {
      tamil: "எலும்புக்கூடு",
      tanglish: "Elumbukkoodu",
      meaning: "Skeleton",
    },
    {
      tamil: "குளிர்சாதனம்",
      tanglish: "Kulirsadhanam",
      meaning: "Air conditioner",
    },
    { tamil: "மின்விசிறி", tanglish: "Minvisiri", meaning: "Electric fan" },
    {
      tamil: "நிலைக்கண்ணாடி",
      tanglish: "Nilaikkannaadi",
      meaning: "Full-length mirror",
    },
    { tamil: "திரைச்சீலை", tanglish: "Thiraiccheelai", meaning: "Curtain" },
    {
      tamil: "சமையற்பத்திரம்",
      tanglish: "Samaiyarpathiram",
      meaning: "Cooking vessel",
    },
    {
      tamil: "தேநீர்க்கோப்பை",
      tanglish: "Theneerkkoappai",
      meaning: "Tea cup",
    },
    { tamil: "தலையணைகள்", tanglish: "Thalayanaigal", meaning: "Pillows" },
    { tamil: "போர்வைகள்", tanglish: "Porvaigal", meaning: "Blankets" },
    { tamil: "துடைப்பங்கள்", tanglish: "Thudaippangal", meaning: "Brooms" },
    {
      tamil: "குப்பைத்தொட்டி",
      tanglish: "Kuppaithotti",
      meaning: "Dustbin",
    },
    {
      tamil: "அலைபேசிகள்",
      tanglish: "Alaipesigal",
      meaning: "Mobile phones",
    },
    {
      tamil: "கணினித்திரை",
      tanglish: "Kaninithirai",
      meaning: "Computer screen",
    },
    {
      tamil: "மென்பொருள்கள்",
      tanglish: "Menporulgal",
      meaning: "Software items",
    },
    {
      tamil: "வன்பொருள்கள்",
      tanglish: "Vanporulgal",
      meaning: "Hardware items",
    },
    { tamil: "இணையதளம்", tanglish: "Inaiyathalam", meaning: "Website" },
    { tamil: "தரவுத்தளம்", tanglish: "Tharavuthalam", meaning: "Database" },
    {
      tamil: "சமூகவலைத்தளம்",
      tanglish: "Samoogavalaiyathalam",
      meaning: "Social network",
    },
    {
      tamil: "கடவுச்சொற்கள்",
      tanglish: "Kadavuchorkal",
      meaning: "Passwords",
    },
    {
      tamil: "பதிவிறக்கம்",
      tanglish: "Pathivirakkam",
      meaning: "Download",
    },
    {
      tamil: "ஒளிபரப்புகள்",
      tanglish: "Oliparappugal",
      meaning: "Broadcasts",
    },
    {
      tamil: "தென்னைமரம்",
      tanglish: "Thennaimaram",
      meaning: "Coconut tree",
    },
    {
      tamil: "ஆலமரங்கள்",
      tanglish: "Aalamarangal",
      meaning: "Banyan trees",
    },
    { tamil: "செம்பரத்தை", tanglish: "Sembarathai", meaning: "Hibiscus" },
    {
      tamil: "தாமரைப்பூ",
      tanglish: "Thaamaraipoo",
      meaning: "Lotus flower",
    },
    {
      tamil: "மல்லிகைப்பூ",
      tanglish: "Malligaipoo",
      meaning: "Jasmine flower",
    },
    {
      tamil: "சூரியகாந்தி",
      tanglish: "Sooriyagandhi",
      meaning: "Sunflower",
    },
    { tamil: "வேப்பமரம்", tanglish: "Veppamaram", meaning: "Neem tree" },
    { tamil: "பலாப்பழம்", tanglish: "Palappazham", meaning: "Jackfruit" },
    { tamil: "திராட்சைகள்", tanglish: "Thiratchaigal", meaning: "Grapes" },
    {
      tamil: "மாதுளைகள்",
      tanglish: "Maadhulaigal",
      meaning: "Pomegranates",
    },
    { tamil: "அடக்கமான", tanglish: "Adakkamaana", meaning: "Humble" },
    {
      tamil: "பொறுமைசாலி",
      tanglish: "Porumaisali",
      meaning: "Patient person",
    },
    { tamil: "நேர்மையான", tanglish: "Nermaiyaana", meaning: "Honest" },
    {
      tamil: "துணிச்சலான",
      tanglish: "Thunichalaana",
      meaning: "Brave/Bold",
    },
    {
      tamil: "உற்சாகமான",
      tanglish: "Urchaagamaana",
      meaning: "Enthusiastic",
    },
    {
      tamil: "ஈடுபாடுகள்",
      tanglish: "Eedupaadugal",
      meaning: "Involvements",
    },
    {
      tamil: "விடாமுயற்சி",
      tanglish: "Vidamuyarchi",
      meaning: "Perseverance",
    },
    { tamil: "தாராளமான", tanglish: "Tharaalamaana", meaning: "Generous" },
    {
      tamil: "விழிப்புணர்வு",
      tanglish: "Vizhippunarvu",
      meaning: "Awareness",
    },
    {
      tamil: "மனவலிமை",
      tanglish: "Manavalimai",
      meaning: "Mental strength",
    },
    {
      tamil: "நிலப்பரப்புகள்",
      tanglish: "Nilapparappugal",
      meaning: "Terrains",
    },
    { tamil: "கடற்கரைகள்", tanglish: "Kadarkaraigal", meaning: "Beaches" },
    {
      tamil: "தீவுக்கூட்டம்",
      tanglish: "Theevukkootam",
      meaning: "Archipelago",
    },
    { tamil: "சமவெளிகள்", tanglish: "Samaveligal", meaning: "Plains" },
    { tamil: "பீடபூமிகள்", tanglish: "Peedaboomigal", meaning: "Plateaus" },
    { tamil: "பனிமலைகள்", tanglish: "Panimalaigal", meaning: "Icebergs" },
    { tamil: "சுழற்காற்று", tanglish: "Suzharkatru", meaning: "Whirlwind" },
    { tamil: "தட்பவெப்பம்", tanglish: "Thatpaveppam", meaning: "Climate" },
    {
      tamil: "காற்றுமாசு",
      tanglish: "Kaatrumasu",
      meaning: "Air pollution",
    },
    {
      tamil: "இயற்கைவளம்",
      tanglish: "Iyarkaivalam",
      meaning: "Natural resource",
    },
    {
      tamil: "கலந்தாலோசனை",
      tanglish: "Kalanthalosanai",
      meaning: "Consultation",
    },
    {
      tamil: "ஒருங்கிணைப்பு",
      tanglish: "Orunginaippu",
      meaning: "Coordination",
    },
    { tamil: "மேற்பார்வை", tanglish: "Merparvai", meaning: "Supervision" },
    {
      tamil: "நடைமுறைகள்",
      tanglish: "Nadaimuraigal",
      meaning: "Procedures",
    },
    { tamil: "அங்கீகாரம்", tanglish: "Angigaaram", meaning: "Recognition" },
    {
      tamil: "நிராகரிப்பு",
      tanglish: "Niraagarippu",
      meaning: "Rejection",
    },
    {
      tamil: "பரிசீலனை",
      tanglish: "Pariseelanai",
      meaning: "Consideration",
    },
    { tamil: "ஆவணங்கள்", tanglish: "Aavanangal", meaning: "Documents" },
    { tamil: "உறுதிமொழி", tanglish: "Urudhimozhi", meaning: "Pledge" },
    { tamil: "முன்னுரிமை", tanglish: "Munnurimai", meaning: "Priority" },
    { tamil: "காவியங்கள்", tanglish: "Kaaviyangal", meaning: "Epics" },
    { tamil: "கவிதைகள்", tanglish: "Kavidhaigal", meaning: "Poems" },
    { tamil: "நாடகங்கள்", tanglish: "Naadagangal", meaning: "Plays" },
    { tamil: "ஓவியங்கள்", tanglish: "Ooviyangal", meaning: "Paintings" },
    { tamil: "சிற்பங்கள்", tanglish: "Sirpangal", meaning: "Sculptures" },
    { tamil: "இன்னிசைகள்", tanglish: "Innisaisal", meaning: "Melodies" },
    { tamil: "நடனங்கள்", tanglish: "Nadanangal", meaning: "Dances" },
    {
      tamil: "இசைக்கருவி",
      tanglish: "Isaikkaruvi",
      meaning: "Musical instrument",
    },
    {
      tamil: "படைப்புகள்",
      tanglish: "Padaippugal",
      meaning: "Literary works",
    },
    {
      tamil: "படைப்பாற்றல்",
      tanglish: "Padaippaatral",
      meaning: "Creativity",
    },
    { tamil: "அலுவலகங்கள்", tanglish: "Aluvalagangal", meaning: "Offices" },
    { tamil: "நூலகங்கள்", tanglish: "Noolagangal", meaning: "Libraries" },
    { tamil: "சிற்றுண்டிகள்", tanglish: "Sittrundigal", meaning: "Snacks" },
    {
      tamil: "குளிர்பானங்கள்",
      tanglish: "Kulirpaanangal",
      meaning: "Cold drinks",
    },
    { tamil: "புகைவண்டிகள்", tanglish: "Pugaivandigal", meaning: "Trains" },
    {
      tamil: "மிதிவண்டிகள்",
      tanglish: "Midhivandigal",
      meaning: "Bicycles",
    },
    {
      tamil: "வானூர்திகள்",
      tanglish: "Vaanoorthigal",
      meaning: "Airplanes",
    },
    { tamil: "கடற்படைகள்", tanglish: "Kadarpadaigal", meaning: "Navies" },
    {
      tamil: "வான்படைகள்",
      tanglish: "Vaanpadaigal",
      meaning: "Air forces",
    },
    { tamil: "தரைப்படைகள்", tanglish: "Tharaipadaigal", meaning: "Armies" },
  ];


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
  const newMode = hardModeToggle.checked ? "hard" : "normal";
  if (currentMode === newMode) return;

  // Update current mode
  currentMode = newMode;

  // Update label
  modeLabel.textContent = hardModeToggle.checked ? "HARD" : "EASY";

  // Reset and reinitialize game
  initializeGame();
});

/* ---------- TOGGLE TANGLISH IN HARD MODE ---------- */
toggleTanglishBtn.addEventListener("click", () => {
  tanglishVisible = !tanglishVisible;
  updateDisplay();
});

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
    endGame(!rowEmoji.includes("🟥"));
  } else {
    // Move to next attempt
    currentAttempt++;
    currentInput = [];
  }
};

function endGame(win) {
  let modal = document.getElementById("resultmodal");
  modal.style.display = "block";
  document.querySelector(".resultmodalclose").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("enter").disabled = true;
  let messageEl = document.getElementById("message");
  messageEl.textContent = win
    ? "Correct! 🎉"
    : `The correct word was: ${word.tamil}`;
  messageEl.style.color = win ? "#4caf50" : "#f44336";
  messageEl.style.fontSize = "24px";

  const share = `தமிழ் PAZHAGU #${getDailyWordIndex()}\n
${emojiGrid.join("\n")}`;

  const shareEl = document.getElementById("share");
  shareEl.textContent = share;
  shareEl.style.fontSize = "16px";
  shareEl.style.marginTop = "12px";
  shareEl.style.marginBottom = "12px";
  shareEl.style.fontWeight = "bold";

  const btn = document.getElementById("shareBtn");
  const popup = document.getElementById("myPopup");
  btn.style.display = "inline-block";
  btn.onclick = () => {
    const shareText = share + "\n\nPlay here: https://tamilpazhagu.com";
    navigator.clipboard.writeText(shareText);
    popup.classList.toggle("show");
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

// Check if a character is a vowel modifier (from vowel-row)
function isVowelModifier(char) {
  const vowelModifiers = [
    "ா",
    "ி",
    "ீ",
    "ு",
    "ூ",
    "ெ",
    "ே",
    "ை",
    "ோ",
    "ொ",
    "ௌ",
    "்",
  ];
  return vowelModifiers.includes(char);
}

function renderGridForAttempt(attemptIndex) {
  console.log("Rendering grid for attempt", attemptIndex, "with input", currentInput);
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
        currentInput[currentInput.length - 1] += key;
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
          currentInput[currentInput.length - 1] += key;
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

document.addEventListener("keypress", handleKeyPress);
initializeGame();
