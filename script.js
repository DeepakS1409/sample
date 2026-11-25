/**
 * Cute Interactive Birthday Invitation
 * Vanilla JavaScript (ES6+)
 * 
 * Features:
 * - Easy Configuration at the top
 * - Confetti & Hearts Canvas Engine
 * - Web Audio API Lullaby/Music Box Synthesizer (No external MP3 required)
 * - Gift Box Opening Sequence
 * - Interactive Birthday Cake Candle Blowing
 * - Live Accurate Countdown Timer
 * - RSVP State & LocalStorage Persistence
 * - Interactive 5-Star Rating Feedback System
 * - Admin Modal with Delete, Clear & JSON Export
 * - Google Calendar & Map Deep Links
 */

/* ==========================================================================
   1. CUSTOMIZABLE CONFIGURATION
   ========================================================================== */
const INVITATION_CONFIG = {
  // Birthday Person
  personName: "Princess Sophia",
  signature: "With all my love & hugs, Sophia 💕",

  // Date & Time
  dateDisplay: "Saturday, Dec 19, 2026",
  timeDisplay: "5:00 PM – 9:00 PM",
  
  // Target date for countdown (Local Time)
  targetDate: new Date("2026-12-19T17:00:00"),

  // Location
  venueName: "Fairytale Blossom Villa, Rose Garden",
  venueAddress: "123 Blossom Lane, Wonderland Park",

  // Personalized Message
  personalMessage: "Your smile and presence bring so much warmth. Having you by my side as I turn another year wiser, happier and wilder means the absolute world to me. Come ready for delicious treats, games, music, and endless photos!",

  // LocalStorage Keys
  STORAGE_KEY_RSVP: "birthday_invitation_rsvp_v1",
  STORAGE_KEY_FEEDBACKS: "birthday_invitation_feedbacks_v1"
};

/* ==========================================================================
   2. DOM ELEMENTS
   ========================================================================== */
const DOM = {
  // Canvas
  canvas: document.getElementById("confettiCanvas"),

  // Welcome Screen & Gift
  welcomeScreen: document.getElementById("welcomeScreen"),
  giftBox: document.getElementById("giftBox"),
  openGiftBtn: document.getElementById("openGiftBtn"),

  // Main Invitation
  invitationMain: document.getElementById("invitationMain"),
  invitationCard: document.getElementById("invitationCard"),

  // Config target displays
  confPerson: document.getElementById("confBirthdayPerson"),
  confDate: document.getElementById("confBirthdayDate"),
  confTime: document.getElementById("confBirthdayTime"),
  confVenue: document.getElementById("confBirthdayVenue"),
  confMsg: document.getElementById("confBirthdayMessage"),
  confSig: document.getElementById("confSignature"),

  // Cake
  cakeContainer: document.getElementById("cakeContainer"),
  cakeCandle: document.getElementById("cakeCandle"),
  wishStatusText: document.getElementById("wishStatusText"),

  // Countdown
  timerDays: document.getElementById("timerDays"),
  timerHours: document.getElementById("timerHours"),
  timerMinutes: document.getElementById("timerMinutes"),
  timerSeconds: document.getElementById("timerSeconds"),
  celebrationBanner: document.getElementById("celebrationLiveBanner"),

  // RSVP
  rsvpButtonsWrap: document.getElementById("rsvpButtonsWrap"),
  rsvpYesBtn: document.getElementById("rsvpYesBtn"),
  rsvpNoBtn: document.getElementById("rsvpNoBtn"),
  rsvpResponseCard: document.getElementById("rsvpResponseCard"),
  rsvpResponseEmoji: document.getElementById("rsvpResponseEmoji"),
  rsvpResponseHeading: document.getElementById("rsvpResponseHeading"),
  rsvpResponseText: document.getElementById("rsvpResponseText"),
  changeRsvpBtn: document.getElementById("changeRsvpBtn"),

  // Feedback Form
  feedbackForm: document.getElementById("feedbackForm"),
  feedbackName: document.getElementById("feedbackName"),
  feedbackText: document.getElementById("feedbackText"),
  birthdayWishes: document.getElementById("birthdayWishes"),
  selectedRating: document.getElementById("selectedRating"),
  starRatingWrap: document.getElementById("starRatingWrap"),
  starButtons: document.querySelectorAll(".star-btn"),
  starLabel: document.getElementById("starLabel"),
  nameError: document.getElementById("nameError"),
  ratingError: document.getElementById("ratingError"),
  feedbackError: document.getElementById("feedbackError"),
  feedbackSuccessCard: document.getElementById("feedbackSuccessCard"),
  writeAnotherFeedbackBtn: document.getElementById("writeAnotherFeedbackBtn"),

  // Admin Modal
  openAdminBtn: document.getElementById("openAdminBtn"),
  closeAdminBtn: document.getElementById("closeAdminBtn"),
  adminModal: document.getElementById("adminModal"),
  adminEntriesList: document.getElementById("adminEntriesList"),
  adminEntryCount: document.getElementById("adminEntryCount"),
  adminExportJsonBtn: document.getElementById("adminExportJsonBtn"),
  adminClearAllBtn: document.getElementById("adminClearAllBtn"),

  // Music Controller
  musicController: document.getElementById("musicController"),
  musicToggleBtn: document.getElementById("musicToggleBtn"),
  musicLabel: document.getElementById("musicLabel"),

  // Quick Action Buttons
  addToCalBtn: document.getElementById("addToCalBtn"),
  viewMapBtn: document.getElementById("viewMapBtn")
};

/* ==========================================================================
   3. WEB AUDIO API CHIME & LULLABY SYNTHESIZER
   Plays gentle, cheerful music-box arpeggios without needing external MP3s
   ========================================================================== */
class MusicBoxSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.step = 0;

    // Sweet pentatonic music-box notes (Hz)
    // C5, D5, E5, G5, A5, C6, D6, E6
    this.melody = [
      523.25, 659.25, 783.99, 1046.50,
      659.25, 523.25, 783.99, 880.00,
      783.99, 659.25, 587.33, 523.25,
      587.33, 659.25, 783.99, 1046.50,
      880.00, 1046.50, 1174.66, 1318.51,
      1046.50, 783.99, 659.25, 523.25
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPluck(freq, delay = 0, duration = 1.2) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;

    // Primary bell tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Warm music box envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    // Cute harmonic sparkle overtone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.5));

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc2.start(now);
    osc2.stop(now + duration * 0.5 + 0.05);
  }

  playCelebrationChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playPluck(freq, idx * 0.09, 1.5);
    });
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      const freq = this.melody[this.step % this.melody.length];
      this.playPluck(freq, 0, 1.4);

      // Add a soft bass anchor note on every 4th step
      if (this.step % 4 === 0) {
        this.playPluck(freq / 2, 0.02, 1.8);
      }

      this.step++;
      this.timerId = setTimeout(playNext, 460);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

const musicSynth = new MusicBoxSynth();

/* ==========================================================================
   4. FULL CONFETTI & PARTICLES ENGINE
   ========================================================================== */
class ConfettiEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.animId = null;
    this.colors = [
      "#f43f5e", "#fb7185", "#fda4af",
      "#c084fc", "#a855f7", "#d8b4fe",
      "#facc15", "#fde047", "#38bdf8",
      "#4ade80", "#fff"
    ];

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 100) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const shape = Math.random() > 0.4 ? "circle" : (Math.random() > 0.5 ? "rect" : "heart");

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 5 + 3),
        size: Math.random() * 10 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        shape: shape,
        gravity: 0.28,
        friction: 0.96,
        alpha: 1,
        fadeSpeed: Math.random() * 0.012 + 0.008
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.rotation += p.rotSpeed;
      p.alpha -= p.fadeSpeed;

      if (p.alpha <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === "rect") {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === "heart") {
        this.drawHeart(this.ctx, 0, -p.size / 2, p.size);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
    }
  }
}

const confetti = new ConfettiEngine(DOM.canvas);

/* ==========================================================================
   5. GIFT BOX OPENING FLOW
   ========================================================================== */
let isGiftOpened = false;

function openGift() {
  if (isGiftOpened) return;
  isGiftOpened = true;

  // Add opened class for 3D animation
  DOM.giftBox.classList.add("opened");

  // Play celebration sound
  musicSynth.playCelebrationChime();

  // Burst confetti right at the gift box location
  const rect = DOM.giftBox.getBoundingClientRect();
  const giftX = rect.left + rect.width / 2;
  const giftY = rect.top + rect.height / 2;
  
  confetti.burst(giftX, giftY, 120);

  // Auto-start sweet background music after user interaction
  setTimeout(() => {
    if (!musicSynth.isPlaying) {
      musicSynth.start();
      updateMusicUI(true);
    }
  }, 600);

  // Transition from Welcome to Main Invitation
  setTimeout(() => {
    DOM.welcomeScreen.classList.add("fade-out");

    setTimeout(() => {
      DOM.welcomeScreen.classList.add("hidden");
      DOM.invitationMain.classList.remove("hidden");
      
      // Trigger card unfold transition
      requestAnimationFrame(() => {
        DOM.invitationMain.classList.add("revealed");
        confetti.burst(window.innerWidth / 2, window.innerHeight * 0.35, 90);

        // Smooth scroll to card
        DOM.invitationCard.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 600);
  }, 1000);
}

/* ==========================================================================
   6. INTERACTIVE BIRTHDAY CAKE CANDLE
   ========================================================================== */
let candleIsBlown = false;

function toggleCakeCandle() {
  if (!candleIsBlown) {
    // Blow out candle
    candleIsBlown = true;
    DOM.cakeCandle.classList.add("extinguished");
    DOM.wishStatusText.innerHTML = "✨ Your wish is on its way to the stars! 🌟 (Tap to relight)";
    DOM.wishStatusText.style.color = "var(--color-pink-500)";

    musicSynth.playCelebrationChime();

    const rect = DOM.cakeCandle.getBoundingClientRect();
    confetti.burst(rect.left + rect.width / 2, rect.top, 50);
  } else {
    // Relight candle
    candleIsBlown = false;
    DOM.cakeCandle.classList.remove("extinguished");
    DOM.wishStatusText.innerHTML = "Candle is lit! Click it to blow out ✨";
    DOM.wishStatusText.style.color = "var(--text-secondary)";
  }
}

/* ==========================================================================
   7. LIVE COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  function updateTimer() {
    const now = new Date().getTime();
    const distance = INVITATION_CONFIG.targetDate.getTime() - now;

    if (distance <= 0) {
      // Reached zero or in past
      DOM.timerDays.textContent = "00";
      DOM.timerHours.textContent = "00";
      DOM.timerMinutes.textContent = "00";
      DOM.timerSeconds.textContent = "00";

      DOM.celebrationBanner.classList.remove("hidden");
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    DOM.timerDays.textContent = pad(days);
    DOM.timerHours.textContent = pad(hours);
    DOM.timerMinutes.textContent = pad(minutes);

    const currentSec = pad(seconds);
    if (DOM.timerSeconds.textContent !== currentSec) {
      DOM.timerSeconds.textContent = currentSec;
      const wrap = DOM.timerSeconds.parentElement;
      wrap.classList.remove("tick");
      // Trigger reflow to restart animation
      void wrap.offsetWidth;
      wrap.classList.add("tick");
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   8. RSVP LOGIC & LOCALSTORAGE
   ========================================================================== */
function loadSavedRSVP() {
  try {
    const saved = localStorage.getItem(INVITATION_CONFIG.STORAGE_KEY_RSVP);
    if (saved) {
      const data = JSON.parse(saved);
      showRSVPResponse(data.status, false);
    }
  } catch (e) {
    console.warn("Could not load RSVP from localStorage", e);
  }
}

function handleRSVP(status) {
  const rsvpData = {
    status: status,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(INVITATION_CONFIG.STORAGE_KEY_RSVP, JSON.stringify(rsvpData));
  } catch (e) {
    console.warn("Could not save RSVP to localStorage", e);
  }

  showRSVPResponse(status, true);
}

function showRSVPResponse(status, triggerEffects) {
  DOM.rsvpButtonsWrap.classList.add("hidden");
  DOM.rsvpResponseCard.classList.remove("hidden");

  if (status === "yes") {
    DOM.rsvpResponseEmoji.textContent = "🎉💖";
    DOM.rsvpResponseHeading.textContent = "Yay! See You There!";
    DOM.rsvpResponseText.textContent = "We're so excited to celebrate with you! Get ready for the sweetest time!";

    if (triggerEffects) {
      musicSynth.playCelebrationChime();
      const rect = DOM.rsvpResponseCard.getBoundingClientRect();
      confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    }
  } else {
    DOM.rsvpResponseEmoji.textContent = "🥺💌";
    DOM.rsvpResponseHeading.textContent = "We'll Miss You!";
    DOM.rsvpResponseText.textContent = "Sending you lots of love ❤️ You'll be warmly with us in spirit!";
  }
}

function resetRSVPView() {
  DOM.rsvpResponseCard.classList.add("hidden");
  DOM.rsvpButtonsWrap.classList.remove("hidden");
}

/* ==========================================================================
   9. FEEDBACK FORM & STAR RATING SYSTEM
   ========================================================================== */
const ratingDescriptions = [
  "Tap a star to rate!",
  "Needs Love 💭",
  "Sweet! 🌸",
  "Lovely! 💕",
  "Super Cute! 💖",
  "Pure Magic! ✨🎂"
];

function initStarRating() {
  DOM.starButtons.forEach((starBtn) => {
    const starVal = parseInt(starBtn.dataset.value, 10);

    // Hover effect
    starBtn.addEventListener("mouseenter", () => {
      highlightStars(starVal);
      DOM.starLabel.textContent = ratingDescriptions[starVal];
    });

    // Click effect
    starBtn.addEventListener("click", () => {
      DOM.selectedRating.value = starVal;
      highlightStars(starVal, true);
      DOM.starLabel.textContent = ratingDescriptions[starVal];
      DOM.ratingError.parentElement.classList.remove("has-error");
    });
  });

  DOM.starRatingWrap.addEventListener("mouseleave", () => {
    const currentVal = parseInt(DOM.selectedRating.value, 10) || 0;
    highlightStars(currentVal, true);
    DOM.starLabel.textContent = ratingDescriptions[currentVal];
  });
}

function highlightStars(count, isSelected = false) {
  DOM.starButtons.forEach((btn) => {
    const val = parseInt(btn.dataset.value, 10);
    if (val <= count) {
      btn.classList.add(isSelected ? "active" : "hovered");
    } else {
      btn.classList.remove("active", "hovered");
    }
  });
}

function handleFeedbackSubmit(e) {
  e.preventDefault();

  const nameVal = DOM.feedbackName.value.trim();
  const ratingVal = parseInt(DOM.selectedRating.value, 10) || 0;
  const feedbackVal = DOM.feedbackText.value.trim();
  const wishesVal = DOM.birthdayWishes.value.trim();

  let hasError = false;

  // Validate Name
  if (!nameVal) {
    DOM.feedbackName.closest(".form-group").classList.add("has-error");
    hasError = true;
  } else {
    DOM.feedbackName.closest(".form-group").classList.remove("has-error");
  }

  // Validate Rating
  if (ratingVal === 0) {
    DOM.starRatingWrap.closest(".form-group").classList.add("has-error");
    hasError = true;
  } else {
    DOM.starRatingWrap.closest(".form-group").classList.remove("has-error");
  }

  // Validate Feedback
  if (!feedbackVal) {
    DOM.feedbackText.closest(".form-group").classList.add("has-error");
    hasError = true;
  } else {
    DOM.feedbackText.closest(".form-group").classList.remove("has-error");
  }

  if (hasError) return;

  // Construct Entry Object
  const newEntry = {
    id: "fb_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    name: nameVal,
    rating: ratingVal,
    feedback: feedbackVal,
    wishes: wishesVal,
    timestamp: new Date().toISOString()
  };

  // Save to LocalStorage
  saveFeedbackToStorage(newEntry);

  // Play celebratory chime and burst confetti
  musicSynth.playCelebrationChime();
  const rect = DOM.feedbackForm.getBoundingClientRect();
  confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 90);

  // Clear Form
  DOM.feedbackForm.reset();
  DOM.selectedRating.value = "0";
  highlightStars(0, true);
  DOM.starLabel.textContent = ratingDescriptions[0];

  // Show Success Card
  DOM.feedbackForm.classList.add("hidden");
  DOM.feedbackSuccessCard.classList.remove("hidden");
  DOM.feedbackSuccessCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

function saveFeedbackToStorage(entry) {
  try {
    const list = getFeedbacksFromStorage();
    list.unshift(entry);
    localStorage.setItem(INVITATION_CONFIG.STORAGE_KEY_FEEDBACKS, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save feedback to localStorage", e);
  }
}

function getFeedbacksFromStorage() {
  try {
    const raw = localStorage.getItem(INVITATION_CONFIG.STORAGE_KEY_FEEDBACKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Could not parse feedbacks", e);
    return [];
  }
}

/* ==========================================================================
   10. ADMIN MODAL & GUESTBOOK MANAGEMENT
   ========================================================================== */
function openAdminModal() {
  DOM.adminModal.classList.remove("hidden");
  renderAdminEntries();
}

function closeAdminModal() {
  DOM.adminModal.classList.add("hidden");
}

function renderAdminEntries() {
  const entries = getFeedbacksFromStorage();
  DOM.adminEntryCount.textContent = `${entries.length} guest ${entries.length === 1 ? "note" : "notes"} received`;

  if (entries.length === 0) {
    DOM.adminEntriesList.innerHTML = `
      <div class="admin-empty-state">
        <div class="admin-empty-icon">💌</div>
        <p>No feedback notes submitted yet in this browser.</p>
        <p style="font-size: 0.85rem; margin-top: 6px;">Submit a note on the main page to test this view!</p>
      </div>
    `;
    return;
  }

  DOM.adminEntriesList.innerHTML = entries.map(item => {
    const dateFormatted = new Date(item.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    const stars = "⭐".repeat(item.rating);

    return `
      <div class="admin-entry-card" data-id="${item.id}">
        <button class="entry-delete-btn" onclick="deleteAdminEntry('${item.id}')" title="Delete this note">🗑️</button>
        <div class="entry-header">
          <div class="entry-guest-info">
            <span class="entry-name">${escapeHTML(item.name)}</span>
            <span class="entry-stars" title="${item.rating} Stars">${stars}</span>
          </div>
          <span class="entry-time">${dateFormatted}</span>
        </div>
        <p class="entry-feedback">"${escapeHTML(item.feedback)}"</p>
        ${item.wishes ? `<div class="entry-wishes">🎂 Wishes: "${escapeHTML(item.wishes)}"</div>` : ""}
      </div>
    `;
  }).join("");
}

// Global scope for onclick button in HTML string
window.deleteAdminEntry = function(id) {
  if (!confirm("Are you sure you want to delete this guest note?")) return;
  try {
    let list = getFeedbacksFromStorage();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(INVITATION_CONFIG.STORAGE_KEY_FEEDBACKS, JSON.stringify(list));
    renderAdminEntries();
  } catch (e) {
    console.warn("Could not delete entry", e);
  }
};

function clearAllAdminEntries() {
  if (!confirm("Delete all guest notes from this browser's storage?")) return;
  try {
    localStorage.removeItem(INVITATION_CONFIG.STORAGE_KEY_FEEDBACKS);
    renderAdminEntries();
  } catch (e) {
    console.warn("Could not clear entries", e);
  }
}

function exportAdminJson() {
  const entries = getFeedbacksFromStorage();
  const jsonStr = JSON.stringify(entries, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `birthday_feedbacks_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

/* ==========================================================================
   11. MUSIC CONTROLLER UI
   ========================================================================== */
function updateMusicUI(isPlaying) {
  if (isPlaying) {
    DOM.musicController.classList.add("playing");
    DOM.musicLabel.textContent = "Music: On";
  } else {
    DOM.musicController.classList.remove("playing");
    DOM.musicLabel.textContent = "Music: Off";
  }
}

function toggleMusic() {
  const isNowPlaying = musicSynth.toggle();
  updateMusicUI(isNowPlaying);
}

/* ==========================================================================
   12. EXTERNAL CALENDAR & MAP HELPERS
   ========================================================================== */
function openGoogleCalendar() {
  // Format target date for Google Calendar ISO
  const startISO = "20261219T113000Z"; // approximate UTC equivalent
  const endISO = "20261219T153000Z";
  
  const title = encodeURIComponent(`${INVITATION_CONFIG.personName}'s Birthday Party! 🎉`);
  const details = encodeURIComponent(INVITATION_CONFIG.personalMessage);
  const location = encodeURIComponent(`${INVITATION_CONFIG.venueName}, ${INVITATION_CONFIG.venueAddress}`);

  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
  window.open(gCalUrl, "_blank", "noopener,noreferrer");
}

function openVenueDirections() {
  const query = encodeURIComponent(`${INVITATION_CONFIG.venueName}, ${INVITATION_CONFIG.venueAddress}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}

/* ==========================================================================
   13. INITIALIZATION & EVENT LISTENERS
   ========================================================================== */
function init() {
  // Populate config texts
  if (DOM.confPerson) DOM.confPerson.textContent = INVITATION_CONFIG.personName;
  if (DOM.confDate) DOM.confDate.textContent = INVITATION_CONFIG.dateDisplay;
  if (DOM.confTime) DOM.confTime.textContent = INVITATION_CONFIG.timeDisplay;
  if (DOM.confVenue) DOM.confVenue.textContent = INVITATION_CONFIG.venueName;
  if (DOM.confMsg) DOM.confMsg.textContent = `"${INVITATION_CONFIG.personalMessage}"`;
  if (DOM.confSig) DOM.confSig.textContent = INVITATION_CONFIG.signature;

  // Gift Box Open listeners
  DOM.openGiftBtn.addEventListener("click", openGift);
  DOM.giftBox.addEventListener("click", openGift);

  // Cake candle listener
  DOM.cakeContainer.addEventListener("click", toggleCakeCandle);

  // Countdown
  initCountdown();

  // RSVP
  loadSavedRSVP();
  DOM.rsvpYesBtn.addEventListener("click", () => handleRSVP("yes"));
  DOM.rsvpNoBtn.addEventListener("click", () => handleRSVP("no"));
  DOM.changeRsvpBtn.addEventListener("click", resetRSVPView);

  // Feedback
  initStarRating();
  DOM.feedbackForm.addEventListener("submit", handleFeedbackSubmit);
  DOM.writeAnotherFeedbackBtn.addEventListener("click", () => {
    DOM.feedbackSuccessCard.classList.add("hidden");
    DOM.feedbackForm.classList.remove("hidden");
  });

  // Clear validation errors on type
  DOM.feedbackName.addEventListener("input", () => {
    DOM.feedbackName.closest(".form-group").classList.remove("has-error");
  });
  DOM.feedbackText.addEventListener("input", () => {
    DOM.feedbackText.closest(".form-group").classList.remove("has-error");
  });

  // Admin Modal
  DOM.openAdminBtn.addEventListener("click", openAdminModal);
  DOM.closeAdminBtn.addEventListener("click", closeAdminModal);
  DOM.adminExportJsonBtn.addEventListener("click", exportAdminJson);
  DOM.adminClearAllBtn.addEventListener("click", clearAllAdminEntries);

  // Check URL hash for direct admin access e.g., #admin
  if (window.location.hash.toLowerCase() === "#admin") {
    openAdminModal();
  }
  window.addEventListener("hashchange", () => {
    if (window.location.hash.toLowerCase() === "#admin") {
      openAdminModal();
    }
  });

  // Close admin when clicking on overlay backdrop
  DOM.adminModal.addEventListener("click", (e) => {
    if (e.target === DOM.adminModal) {
      closeAdminModal();
    }
  });

  // Music toggle button
  DOM.musicToggleBtn.addEventListener("click", toggleMusic);

  // Quick Action Buttons
  DOM.addToCalBtn.addEventListener("click", openGoogleCalendar);
  DOM.viewMapBtn.addEventListener("click", openVenueDirections);
}

// Run on DOM Content Loaded
document.addEventListener("DOMContentLoaded", init);
