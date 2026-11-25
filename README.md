# Cute Interactive Birthday Invitation Website 🎂💖✨

A tiny, adorable, interactive and visually enchanting digital Birthday Invitation Website crafted with pure **HTML5, CSS3, and Vanilla JavaScript**.

Designed with a warm fairytale pastel aesthetic (**Pastel Pink, Lavender, Cream, Soft Purple and Warm Gold**).

---

## ✨ Features Overview

1. **🎁 3D Gift Box Opening Screen**:
   - Floating hearts, stars, sparkles and balloons in the background.
   - Interactive gift box with animated ribbon and bow.
   - Smooth opening animation with confetti explosion and unfolding birthday card transition.
2. **🎂 Birthday Invitation Card**:
   - Elegant pastel glassmorphic card with cute corner botanical accents.
   - **Interactive Birthday Cake**: Visitors can click the candle to blow out the flame with realistic rising smoke and celebratory sparkles! Clicking again relights it.
   - Customizable details: Birthday Person name, Date, Time, Venue, and Personalized heartfelt message.
   - "Add to Google Calendar" and "Get Venue Directions" quick-action buttons.
3. **⏳ Live Countdown Timer**:
   - Real-time countdown (Days, Hours, Minutes, Seconds) with gentle pulse animation on every second tick.
   - Replaces with "It's Celebration Time! 🎉" when the countdown reaches zero.
4. **❤️ Interactive RSVP**:
   - Two cute interactive buttons: *"Yes! I'll Be There ❤️"* and *"Sorry, Can't Make It 🥺"*.
   - Plays cheerful chime, triggers confetti burst, and provides instant positive confirmation.
   - Remembers the user's choice in `localStorage`, with option to update RSVP.
5. **💌 Feedback / Guestbook Form**:
   - Form fields: Name, interactive 1–5 Star Rating (with sweet dynamic emotion text), Feedback textarea, and optional Birthday Wishes message.
   - Form validation with cute inline error highlights.
   - Saves responses into browser `localStorage`.
   - Triggers confetti shower and animated confirmation card upon successful submission.
6. **🔒 Hidden Feedback Admin View**:
   - Access via the discreet *"View Guest Feedback"* button in the footer or by appending `#admin` to the URL (e.g. `index.html#admin`).
   - View all visitor names, star ratings, feedback, birthday wishes, and timestamps.
   - Delete individual feedback items or clear all.
   - One-click **Export JSON** feature.
   - Structured and cleanly decoupled for seamless backend integration (e.g. Supabase, Firebase).
7. **🎵 Ambient Music Box Background Music**:
   - Synthesized using the native **Web Audio API** (clean, lightweight, zero broken external audio file dependencies!).
   - Plays soft, cheerful acoustic chime / music-box arpeggios.
   - Adheres strictly to browser autoplay policies (starts only after user interaction / gift opening).
   - Floating music control pill with animated spinning disc and Mute/Unmute toggle.
8. **📱 Responsive & Lightweight**:
   - Optimized for mobile, tablet, and desktop screens with fluid clamp typography and touch-friendly buttons.
   - No heavy frameworks, no external libraries, super fast load time.

---

## 🚀 How to Run

Simply open `index.html` in any web browser!

- **Option 1**: Double-click `index.html` in Windows Explorer.
- **Option 2 (Local Server)**:
  ```bash
  # Using Python
  python -m http.server 8000
  # Then open http://localhost:8000 in your browser
  ```

---

## 🎨 How to Customize

All event details are conveniently grouped at the very top of `script.js` in the `INVITATION_CONFIG` object:

```javascript
const INVITATION_CONFIG = {
  // Birthday Person
  personName: "Princess Sophia",
  signature: "With all my love & hugs, Sophia 💕",

  // Date & Time
  dateDisplay: "Saturday, Dec 19, 2026",
  timeDisplay: "5:00 PM – 9:00 PM",
  
  // Target date for countdown (Year, Month - 1, Day, Hour, Min)
  targetDate: new Date("2026-12-19T17:00:00"),

  // Location
  venueName: "Fairytale Blossom Villa, Rose Garden",
  venueAddress: "123 Blossom Lane, Wonderland Park",

  // Personalized Message
  personalMessage: "Your smile and presence bring so much warmth...",
};
```

---

## 🌐 Connecting to Supabase (Optional)

The feedback and RSVP data currently persist smoothly in `localStorage`. To connect with Supabase for real-time team syncing:

1. Create a table in Supabase called `birthday_feedbacks`:
   - `id` (text or uuid, primary key)
   - `name` (text)
   - `rating` (int2)
   - `feedback` (text)
   - `wishes` (text, optional)
   - `created_at` (timestamptz, default `now()`)
2. In `script.js`, replace `saveFeedbackToStorage(newEntry)` and `getFeedbacksFromStorage()` with Supabase JS client calls:
   ```javascript
   // Insert
   const { data, error } = await supabase.from('birthday_feedbacks').insert([newEntry]);
   ```

---

## 📁 File Structure

```
├── index.html       # Semantic HTML5 layout and modal dialogs
├── style.css        # Pastel palette, glassmorphism, animations & responsiveness
├── script.js        # Config, Confetti engine, Web Audio synth, RSVP & Feedback
└── README.md        # Documentation and customization guide
```
