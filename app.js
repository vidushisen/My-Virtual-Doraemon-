/* =========================================================
   MY VIRTUAL DORAEMON - ENGINE (app.js)
   Child-like Cute Anime Voice, Dual JP+EN Subtitles,
   Illustrated SVG Costumes & Catch Mini-Game
   ========================================================= */

// --- 1. DORAEMON PET STATE ---
const PET_STATE = {
  happiness: 80,
  tummy: 60,
  level: 1,
  totalFed: 0,
  currentScene: 'room',
  isFlying: false,
  isPanicking: false,
  activeGadget: null,
  currentExpression: 'normal',
  voiceLang: 'hi', // 'hi' (Hindi) or 'en' (English)
  currentHat: null,
  currentDialogueObj: null,
  minigameActive: false,
  minigameScore: 0,
  minigameTimer: 20,
  minigameInterval: null,
  minigameSpawnInterval: null
};

// 22nd-Century Gadgets Library
const GADGETS_VAULT = [
  {
    id: 'anywhere_door',
    name: 'Anywhere Door (どこでもドア)',
    jp: 'どこでもドア',
    icon: '🚪',
    desc: 'Turn the brass knob and travel anywhere across the universe in 1 second!',
    hi: 'Anywhere Door! Jahan chahein wahan pahunch jao!',
    en: 'Anywhere Door! Travel anywhere in one second!'
  },
  {
    id: 'memory_bread',
    name: 'Memory Bread (アンキパン)',
    jp: 'アンキパン',
    icon: '🍞',
    desc: 'Press this bread against your book page, eat it, and instantly memorize everything for exams!',
    hi: 'Memory Bread! Exam me full marks pakke!',
    en: 'Memory Bread! Never worry about exams again!'
  },
  {
    id: 'small_light',
    name: 'Small Light (スモールライト)',
    jp: 'スモールライト',
    icon: '🔦',
    desc: 'Shine this beam to shrink any person or object down to miniature insect size!',
    hi: 'Small Light! Dekho main kitna chhota ho gaya!',
    en: 'Small Light! Look, I shrunk down tiny!'
  },
  {
    id: 'time_machine',
    name: 'Time Machine (タイムマシン)',
    jp: 'タイムマシン',
    icon: '⏳',
    desc: 'Parked right inside Nobita\'s desk drawer! Travel millions of years into the past or future!',
    hi: 'Time Machine! Chalo past aur future me ghoomne chalein!',
    en: 'Time Machine! Let\'s go on a time travel adventure!'
  },
  {
    id: 'pass_loop',
    name: 'Pass Loop (通りぬけフープ)',
    jp: '通りぬけフープ',
    icon: '⭕',
    desc: 'Place this hoop on any solid wall, and jump right through to the other side!',
    hi: 'Pass Loop! Deewar ke paar nikal jao!',
    en: 'Pass Loop! Jump right through any solid wall!'
  },
  {
    id: 'translation_gummy',
    name: 'Translation Gummy (ほんやくコンニャク)',
    jp: 'ほんやくコンニャク',
    icon: '🍬',
    desc: 'Eat this konnyaku jelly to understand and speak every alien and human language fluently!',
    hi: 'Translation Gummy! Har bhasha turant samajh aayegi!',
    en: 'Translation Gummy! Understand every language easily!'
  },
  {
    id: 'air_cannon',
    name: 'Air Cannon (空気砲)',
    jp: '空気砲',
    icon: '💨',
    desc: 'Slip onto your arm, shout "BANG!", and fire a powerful burst of pressurized air!',
    hi: 'Air Cannon! Bang! Hawa ka shaktishaali cannon!',
    en: 'Air Cannon! Powerful burst of air blast!'
  },
  {
    id: 'bamboo_copter',
    name: 'Bamboo Copter (タケコプター)',
    jp: 'タケコプター',
    icon: '🚁',
    desc: 'Stick to your head and fly freely in the blue sky up to 80 kilometers per hour!',
    hi: 'Bamboo Copter! Aasman me udne ka maza lo!',
    en: 'Bamboo Copter! Let\'s fly high in the blue sky!'
  }
];

// Rich Dialogues with Full Tri-Lingual Support
const DORA_DIALOGUES = [
  {
    hi: "Main Doraemon hoon! Mujhe meethi Dorayaki bohot pasand hai! 🍘",
    en: "I am Doraemon! My favorite sweet food is Dorayaki! 🍘",
    jp: "ぼくドラえもん！どら焼きが大好き！"
  },
  {
    hi: "Nobitaaa! Fikr mat karo, mere 4D pocket me har cheez ka gadget hai! ✨",
    en: "Nobita! Don't worry, my 4D pocket has magic gadgets for everything! ✨",
    jp: "のび太くん！心配しないで、四次元ポケットがあるよ！"
  },
  {
    hi: "Hehehe! Mujhe pet karne par bohot gudgudi hoti hai! 🥰",
    en: "Hehehe! Tickling and petting me makes me feel so happy! 🥰",
    jp: "えへへ！なでられるとくすぐったいよ！"
  },
  {
    hi: "Meri golden bell ko touch karke dekho, kitni pyari aawaz aati hai! 🔔",
    en: "Ring my golden collar bell to hear its cheerful chime! 🔔",
    jp: "ぼくの金の鈴を鳴らしてみてね！"
  },
  {
    hi: "Are baap re! Bas chuha mat lana, mujhe chuhe se bohot darr lagta hai! 🐭",
    en: "Oh no! Please keep mice away, I am terrified of mice! 🐭",
    jp: "ネズミだけは本当に苦手なんだよ〜！"
  },
  {
    hi: "Aaj hum dono milkar khoob saari games aur masti karenge! 🌸",
    en: "Let's play lots of fun games and explore the universe together! 🌸",
    jp: "きょうも一緒にたくさん遊ぼうね！"
  }
];

// --- 2. WEB AUDIO SYNTHESIZER ---
class PetAudioEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  // Cute Child-like Chirp before speaking
  playCuteChirp() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1050, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1750, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBell() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760.00, this.ctx.currentTime); // A6
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  playHonk() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playMunch() {
    this.init();
    if (!this.ctx) return;
    const notes = [550, 780, 1050, 1300];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.16);
    });
  }

  playPocketFanfare() {
    this.init();
    if (!this.ctx) return;
    const notes = [659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.35);
    });
  }

  playPanicScream() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1800, this.ctx.currentTime + 0.22);
    osc.frequency.linearRampToValueAtTime(950, this.ctx.currentTime + 0.45);
    osc.frequency.linearRampToValueAtTime(1700, this.ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }
  playWarpPortal() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  // Iconic Doraemon Anime Theme Song ("Doraemon no Uta" - ぼくドラえもん)
  playDoraemonThemeSong() {
    this.init();
    if (!this.ctx) return;

    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

    const melody = [
      // Phrase 1: "Kon-na ko-to ii na, de-ki-ta-ra ii na"
      { f: G4, d: 0.22, t: 0.0 },
      { f: G4, d: 0.22, t: 0.25 },
      { f: A4, d: 0.22, t: 0.50 },
      { f: B4, d: 0.22, t: 0.75 },
      { f: C5, d: 0.40, t: 1.00 },
      { f: B4, d: 0.22, t: 1.45 },
      { f: A4, d: 0.40, t: 1.70 },

      { f: G4, d: 0.22, t: 2.15 },
      { f: E4, d: 0.22, t: 2.40 },
      { f: G4, d: 0.22, t: 2.65 },
      { f: A4, d: 0.50, t: 2.90 },

      // Phrase 2: "An-na yu-me kon-na yu-me ip-pai a-ru ke-do"
      { f: G4, d: 0.20, t: 3.55 },
      { f: G4, d: 0.20, t: 3.80 },
      { f: A4, d: 0.20, t: 4.05 },
      { f: B4, d: 0.20, t: 4.30 },
      { f: C5, d: 0.35, t: 4.55 },
      { f: D5, d: 0.35, t: 4.95 },
      { f: E5, d: 0.50, t: 5.35 },

      // Phrase 3: "An an an, tot-te-mo dai-su-ki"
      { f: E5, d: 0.22, t: 6.00 },
      { f: E5, d: 0.22, t: 6.25 },
      { f: E5, d: 0.30, t: 6.50 },
      { f: D5, d: 0.22, t: 6.85 },
      { f: C5, d: 0.30, t: 7.10 },
      { f: D5, d: 0.22, t: 7.45 },
      { f: E5, d: 0.45, t: 7.70 },

      // Phrase 4: "DO-RA-E-MON!"
      { f: G5, d: 0.35, t: 8.25 },
      { f: E5, d: 0.30, t: 8.65 },
      { f: D5, d: 0.30, t: 9.00 },
      { f: C5, d: 0.75, t: 9.35 }
    ];

    melody.forEach(note => {
      const st = this.ctx.currentTime + note.t;

      // Melody Lead Synth (Bright Bell Triangle)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, st);

      gain.gain.setValueAtTime(0.3, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(st);
      osc.stop(st + note.d);

      // Warm Chime Harmonic (Octave up sine)
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(note.f * 2, st);
      chimeGain.gain.setValueAtTime(0.12, st);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, st + note.d * 0.8);
      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chime.start(st);
      chime.stop(st + note.d * 0.8);

      // Bass Rhythm (Warm Sine Bass)
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(note.f / 2, st);
      bassGain.gain.setValueAtTime(0.15, st);
      bassGain.gain.exponentialRampToValueAtTime(0.001, st + note.d);
      bass.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bass.start(st);
      bass.stop(st + note.d);
    });
  }

  playDanceBeat() {
    this.playDoraemonThemeSong();
  }
}

const audio = new PetAudioEngine();

// --- 3. VOICE LANGUAGE TOGGLE ---
function setVoiceLanguage(lang) {
  PET_STATE.voiceLang = lang;
  document.getElementById('lang-btn-hi').classList.toggle('active', lang === 'hi');
  document.getElementById('lang-btn-en').classList.toggle('active', lang === 'en');
  audio.playBell();

  const hi = "Main ab aapse pyaari Hindi me baat karunga!";
  const en = "I will now speak in cute English with you!";
  const jp = "言語を切り替えたよ！";

  setDoraDialogue(hi, en, jp);
  speakDoraemon(lang === 'hi' ? hi : en);
}

// --- 4. DUAL SUBTITLES & CHILD-LIKE VOICE SYNTHESIS ---
function setDoraDialogue(hiText, enText, jpText) {
  PET_STATE.currentDialogueObj = { hi: hiText, en: enText, jp: jpText };

  const bubble = document.getElementById('bubble-text');
  const jpBadge = document.getElementById('jp-text');
  const enSub = document.getElementById('en-sub-text');

  // Main text is displayed in the user's selected language
  if (bubble) {
    const main = PET_STATE.voiceLang === 'hi' ? hiText : enText;
    bubble.textContent = `"${main}"`;
  }
  // Subtitle badges display Japanese and secondary translation
  if (jpBadge && jpText) jpBadge.textContent = jpText;
  if (enSub && enText) enSub.textContent = enText;
}

function speakDoraemon(textToSpeak, onComplete = null) {
  if (!('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }
  window.speechSynthesis.cancel();

  audio.playCuteChirp();

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
  // Cutest Child-like Anime Baby Pitch:
  utterance.pitch = 2.0;  // Maximum cute high anime child pitch
  utterance.rate = 0.90;  // Gentle, adorable child pace

  const voices = window.speechSynthesis.getVoices();
  const isHi = PET_STATE.voiceLang === 'hi';

  const isMale = (name) => {
    const n = name.toLowerCase();
    return n.includes('male') || n.includes('david') || n.includes('mark') || 
           n.includes('george') || n.includes('guy') || n.includes('ravi') || 
           n.includes('stefan') || n.includes('richard') || n.includes('james') ||
           n.includes('paul') || n.includes('daniel') || n.includes('hemant');
  };

  let chosenVoice = null;
  if (isHi) {
    chosenVoice = voices.find(v => (v.lang.includes('hi') || v.lang.includes('IN')) && !isMale(v.name));
    if (!chosenVoice) {
      chosenVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Heera') || v.name.includes('Kalpana') || v.name.includes('Swara'));
    }
  } else {
    // Specifically filter OUT any male voices in English!
    chosenVoice = voices.find(v => v.lang.startsWith('en') && !isMale(v.name) && 
      (v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Aria') || 
       v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || 
       v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Natural')));
    
    if (!chosenVoice) {
      chosenVoice = voices.find(v => v.lang.startsWith('en') && !isMale(v.name));
    }
  }

  if (chosenVoice) {
    utterance.voice = chosenVoice;
    utterance.lang = chosenVoice.lang;
  } else {
    utterance.lang = isHi ? 'hi-IN' : 'en-US';
  }

  const mouth = document.getElementById('dora-mouth');
  utterance.onstart = () => { 
    if (mouth && !mouth.classList.contains('screaming')) mouth.classList.add('eating'); 
  };
  
  const handleEnd = () => {
    if (mouth && !mouth.classList.contains('screaming')) mouth.classList.remove('eating');
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  utterance.onend = handleEnd;
  utterance.onerror = handleEnd;

  window.speechSynthesis.speak(utterance);
}

function speakCurrentDialog() {
  if (PET_STATE.currentDialogueObj) {
    const text = PET_STATE.voiceLang === 'hi' ? PET_STATE.currentDialogueObj.hi : PET_STATE.currentDialogueObj.en;
    speakDoraemon(text);
  } else {
    const bubble = document.getElementById('bubble-text');
    if (bubble) speakDoraemon(bubble.textContent.replace(/^"|"$/g, ''));
  }
}

// --- 5. DYNAMIC EXPRESSIONS ENGINE ---
function setDoraExpression(expression) {
  PET_STATE.currentExpression = expression;

  const pupils = document.querySelectorAll('.pupil');
  const hearts = document.querySelectorAll('.heart-eye');
  const stars = document.querySelectorAll('.star-eye');
  const panics = document.querySelectorAll('.panic-eye');
  const squints = document.querySelectorAll('.happy-squint');
  const blushLeft = document.getElementById('blush-left');
  const blushRight = document.getElementById('blush-right');
  const sweat1 = document.getElementById('sweat-1');
  const sweat2 = document.getElementById('sweat-2');
  const mouth = document.getElementById('dora-mouth');
  const handL = document.getElementById('hand-left');
  const handR = document.getElementById('hand-right');

  // Reset all
  pupils.forEach(el => el.classList.remove('hidden'));
  hearts.forEach(el => el.classList.add('hidden'));
  stars.forEach(el => el.classList.add('hidden'));
  panics.forEach(el => el.classList.add('hidden'));
  squints.forEach(el => el.classList.add('hidden'));

  if (blushLeft) blushLeft.classList.add('hidden');
  if (blushRight) blushRight.classList.add('hidden');
  if (sweat1) sweat1.classList.add('hidden');
  if (sweat2) sweat2.classList.add('hidden');
  if (mouth) mouth.classList.remove('eating', 'screaming');
  if (handL) handL.classList.remove('panicking');
  if (handR) handR.classList.remove('panicking');

  if (expression === 'hearts') {
    pupils.forEach(el => el.classList.add('hidden'));
    hearts.forEach(el => el.classList.remove('hidden'));
    if (blushLeft) blushLeft.classList.remove('hidden');
    if (blushRight) blushRight.classList.remove('hidden');
  } else if (expression === 'stars') {
    pupils.forEach(el => el.classList.add('hidden'));
    stars.forEach(el => el.classList.remove('hidden'));
    if (blushLeft) blushLeft.classList.remove('hidden');
    if (blushRight) blushRight.classList.remove('hidden');
  } else if (expression === 'squint') {
    pupils.forEach(el => el.classList.add('hidden'));
    squints.forEach(el => el.classList.remove('hidden'));
    if (blushLeft) blushLeft.classList.remove('hidden');
    if (blushRight) blushRight.classList.remove('hidden');
  } else if (expression === 'panic') {
    pupils.forEach(el => el.classList.add('hidden'));
    panics.forEach(el => el.classList.remove('hidden'));
    if (sweat1) sweat1.classList.remove('hidden');
    if (sweat2) sweat2.classList.remove('hidden');
    if (mouth) mouth.classList.add('screaming');
    if (handL) handL.classList.add('panicking');
    if (handR) handR.classList.add('panicking');
  } else if (expression === 'eating') {
    pupils.forEach(el => el.classList.add('hidden'));
    hearts.forEach(el => el.classList.remove('hidden'));
    if (blushLeft) blushLeft.classList.remove('hidden');
    if (blushRight) blushRight.classList.remove('hidden');
    if (mouth) mouth.classList.add('eating');
  }
}

// --- 6. PET INTERACTIONS ---
function petDoraemon(e) {
  if (e && e.target && (e.target.id === 'golden-bell' || e.target.id === 'pocket-element' || e.target.classList.contains('dora-red-nose'))) {
    return;
  }
  
  audio.playBell();
  spawnParticle('❤️', e ? e.clientX : window.innerWidth / 2, e ? e.clientY : window.innerHeight / 2);
  increaseHappiness(5);
  setDoraExpression('hearts');

  setTimeout(() => {
    if (!PET_STATE.isPanicking) setDoraExpression('normal');
  }, 1600);

  const picked = DORA_DIALOGUES[Math.floor(Math.random() * DORA_DIALOGUES.length)];
  setDoraDialogue(picked.hi, picked.en, picked.jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? picked.hi : picked.en);
}

function petBell(e) {
  if (e) e.stopPropagation();
  audio.playBell();
  const bell = document.getElementById('golden-bell');
  if (bell) {
    bell.style.transform = 'translateX(-50%) scale(1.4) rotate(20deg)';
    setTimeout(() => { bell.style.transform = 'translateX(-50%) scale(1)'; }, 250);
  }
  setDoraExpression('squint');
  spawnParticle('🔔', window.innerWidth / 2, window.innerHeight / 2);

  const hi = "Ding dong! Meri golden bell bajti hai toh mujhe bohot khushi hoti hai!";
  const en = "Ding dong! My golden collar bell rings with joy!";
  const jp = "チリンチリン！金の鈴が鳴ったよ！";

  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  setTimeout(() => {
    if (!PET_STATE.isPanicking) setDoraExpression('normal');
  }, 2000);
}

function honkNose(e) {
  if (e) e.stopPropagation();
  audio.playHonk();
  setDoraExpression('squint');
  spawnParticle('🔴', window.innerWidth / 2, window.innerHeight / 2 - 50);

  const hi = "Honk! Hehehe, meri laal naak par gudgudi mat karo!";
  const en = "Honk! Hehehe, don't tickle my red round nose!";
  const jp = "プピー！赤い鼻をくすぐらないで〜！";

  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  setTimeout(() => {
    if (!PET_STATE.isPanicking) setDoraExpression('normal');
  }, 1800);
}

// --- 7. ACTION 1: FEED DORAYAKI ---
function feedDorayaki() {
  const falling = document.getElementById('falling-dorayaki');
  falling.classList.remove('hidden');
  audio.playMunch();

  setDoraExpression('eating');

  setTimeout(() => {
    spawnParticle('🍘', window.innerWidth / 2 - 40, window.innerHeight / 2);
    spawnParticle('✨', window.innerWidth / 2 + 40, window.innerHeight / 2);
  }, 600);

  setTimeout(() => {
    falling.classList.add('hidden');
    increaseTummy(25);
    increaseHappiness(15);
    PET_STATE.totalFed++;

    setDoraExpression('squint');

    const hi = "Oishii! Maza aa gaya! Kitna tasty Dorayaki hai, shukriya!";
    const en = "Yummy! That was so delicious! Thank you for the sweet Dorayaki!";
    const jp = "おいしい！どら焼き最高！ありがとう！";

    setDoraDialogue(hi, en, jp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

    checkLevelUp();

    setTimeout(() => {
      if (!PET_STATE.isPanicking) setDoraExpression('normal');
    }, 2000);
  }, 1200);
}

// --- 8. ACTION 2: 4D MAGIC POCKET ---
function pullRandomGadget(e) {
  if (e) e.stopPropagation();
  audio.playPocketFanfare();

  const pocket = document.getElementById('pocket-element');
  pocket.style.transform = 'scale(1.3)';
  setTimeout(() => { pocket.style.transform = 'scale(1)'; }, 300);

  setDoraExpression('stars');

  const picked = GADGETS_VAULT[Math.floor(Math.random() * GADGETS_VAULT.length)];
  PET_STATE.activeGadget = picked;

  document.getElementById('showcase-icon').textContent = picked.icon;
  document.getElementById('showcase-title').textContent = picked.name;
  document.getElementById('showcase-desc').textContent = picked.desc;
  document.getElementById('gadget-showcase-card').classList.remove('hidden');

  const hi = `TADA! ✨ 4D Pocket se nikla: ${picked.name}! Use dabao iska jaadu dekhne ke liye!`;
  const en = `TADA! ✨ From 4D Pocket: ${picked.name}! Click activate to see its magic power!`;
  const jp = `テレレレッテレー！${picked.jp}！`;

  setDoraDialogue(hi, en, jp);
  speakDoraemon(`TADA! ${PET_STATE.voiceLang === 'hi' ? picked.hi : picked.en}`);

  spawnParticle('✨', window.innerWidth / 2, window.innerHeight / 2);
  increaseHappiness(10);
}

function closeGadgetShowcase() {
  document.getElementById('gadget-showcase-card').classList.add('hidden');
  if (!PET_STATE.isPanicking) setDoraExpression('normal');
}

// Master Gadget Activator (Each gadget has real, dedicated interactive power!)
function useActiveGadget() {
  const g = PET_STATE.activeGadget;
  closeGadgetShowcase();
  if (!g) return;

  if (g.id === 'air_cannon') {
    activateAirCannon();
  } else if (g.id === 'memory_bread') {
    activateMemoryBread();
  } else if (g.id === 'small_light') {
    activateSmallLight();
  } else if (g.id === 'time_machine') {
    activateTimeMachine();
  } else if (g.id === 'pass_loop') {
    activatePassLoop();
  } else if (g.id === 'translation_gummy') {
    activateTranslationGummy();
  } else if (g.id === 'anywhere_door') {
    openAnywhereDoorMenu();
  } else if (g.id === 'bamboo_copter') {
    toggleTakeCopterFly();
  } else {
    activateAirCannon();
  }
}

// --- GADGET 1: AIR CANNON 5-AMMO TARGET SHOOTING ARENA (空気砲) ---
function closeGadgetActionStage() {
  const stage = document.getElementById('gadget-action-stage');
  const airStage = document.getElementById('stage-air-cannon');
  if (airStage) airStage.classList.add('hidden');
  if (stage) stage.classList.add('hidden');
  if (!PET_STATE.isPanicking) setDoraExpression('normal');
}

function activateAirCannon() {
  const stage = document.getElementById('gadget-action-stage');
  const airStage = document.getElementById('stage-air-cannon');
  const blast = document.getElementById('air-blast-wave');
  const dora = document.getElementById('doraemon-character');
  const container = document.getElementById('cannon-targets-container');
  const ammoIcons = document.getElementById('cannon-ammo-icons');
  const hitCount = document.getElementById('cannon-hit-count');
  const hint = document.getElementById('cannon-hint');

  stage.classList.remove('hidden');
  airStage.classList.remove('hidden');
  container.innerHTML = '';

  let ammo = 5;
  let targetsHit = 0;
  ammoIcons.textContent = '💥💥💥💥💥';
  hitCount.textContent = '0';
  hint.innerHTML = 'Tap on the flying targets to fire <strong>AIR CANNON BLAST!</strong>';

  setDoraExpression('stars');
  audio.playPocketFanfare();

  const targetTypes = [
    { emoji: '🛸', name: "Suneo's Drone" },
    { emoji: '📝', name: "Zero Test Paper" },
    { emoji: '🎤', name: "Gian's Speaker" },
    { emoji: '🐭', name: "Mischief Mouse" },
    { emoji: '👻', name: "Comic Phantom" }
  ];

  // Spawn 5 flying targets
  targetTypes.forEach((t, idx) => {
    const el = document.createElement('div');
    el.className = 'shooting-target-item';
    el.textContent = t.emoji;
    el.title = t.name;
    
    // Position randomly across arena
    const leftPercent = 15 + (idx * 16) + (Math.random() * 8 - 4);
    const topPercent = 20 + (Math.random() * 35);
    el.style.left = `${leftPercent}%`;
    el.style.top = `${topPercent}%`;
    el.style.animationDelay = `${idx * 0.3}s`;

    // Click on target
    el.onclick = (e) => {
      e.stopPropagation();
      if (ammo <= 0) return;
      fireShot(e.clientX, e.clientY, el);
    };

    container.appendChild(el);
  });

  function fireShot(x, y, hitTarget = null) {
    if (ammo <= 0) return;
    ammo--;
    const ammoVisuals = ['💨💨💨💨💨', '💥💨💨💨💨', '💥💥💨💨💨', '💥💥💥💨💨', '💥💥💥💥💨', '💥💥💥💥💥'];
    ammoIcons.textContent = ammoVisuals[ammo];

    audio.playPanicScream(); // Cannon Boom

    blast.classList.remove('hidden');
    blast.style.left = `${x - 60}px`;
    blast.style.top = `${y - 60}px`;
    setTimeout(() => blast.classList.add('hidden'), 500);

    dora.style.transform = 'translateY(-15px) scale(0.95)';
    setTimeout(() => { dora.style.transform = 'scale(1)'; }, 180);

    if (hitTarget) {
      targetsHit++;
      hitCount.textContent = targetsHit;
      audio.playPocketFanfare();
      spawnParticle('💥', x, y);
      spawnParticle('✨', x + 20, y);
      hitTarget.remove();
    } else {
      spawnParticle('💨', x, y);
    }

    if (targetsHit >= 5 || ammo === 0) {
      setTimeout(() => {
        hint.innerHTML = `<strong>TARGET SHOOTING COMPLETE!</strong> Hit: ${targetsHit}/5! 🏆`;
        const hi = `Shaandar Blast! Aapne ${targetsHit}/5 targets destroy kar diye!`;
        const en = `Awesome Blast! You destroyed ${targetsHit}/5 targets!`;
        const jp = `すごい！ターゲットを全部倒したよ！`;
        setDoraDialogue(hi, en, jp);
        speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
        increaseHappiness(25);

        setTimeout(() => {
          closeGadgetActionStage();
        }, 3000);
      }, 600);
    }
  }

  // Click on background canvas fires shot too
  container.onclick = (e) => {
    fireShot(e.clientX, e.clientY, null);
  };
}

// --- GADGET 2: MEMORY BREAD 100-MARKS (アンキパン) ---
function activateMemoryBread() {
  const stage = document.getElementById('gadget-action-stage');
  const breadStage = document.getElementById('stage-memory-bread');
  const scoreCard = document.getElementById('exam-score-card');
  const breadSlice = document.getElementById('memory-bread-slice');

  stage.classList.remove('hidden');
  breadStage.classList.remove('hidden');
  scoreCard.classList.add('hidden');
  breadSlice.classList.remove('hidden');

  setDoraExpression('eating');
  audio.playMunch();

  const hi = "Memory Bread khate hi saare math aur science ke formulas dimaag me chhap gaye!";
  const en = "Eating Memory Bread instantly memorized all math and science formulas!";
  const jp = "アンキパンを食べたら全部覚えちゃった！";
  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  setTimeout(() => {
    breadSlice.classList.add('hidden');
    scoreCard.classList.remove('hidden');
    audio.playPocketFanfare();
    setDoraExpression('stars');

    spawnParticle('💯', window.innerWidth / 2 - 40, window.innerHeight / 2);
    spawnParticle('⭐', window.innerWidth / 2 + 40, window.innerHeight / 2);

    const triumphHi = "100 out of 100 Marks! Nobita exam me top kar gaya!";
    const triumphEn = "100 out of 100 Marks! Nobita tops the entire class!";
    const triumphJp = "100点満点！テストでトップを取ったよ！";
    setDoraDialogue(triumphHi, triumphEn, triumphJp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? triumphHi : triumphEn);
    increaseHappiness(25);
    increaseTummy(20);
  }, 2200);

  setTimeout(() => {
    breadStage.classList.add('hidden');
    stage.classList.add('hidden');
    setDoraExpression('normal');
  }, 5000);
}

// --- GADGET 3: SMALL LIGHT & BIG LIGHT (スモールライト) ---
function activateSmallLight() {
  const stage = document.getElementById('gadget-action-stage');
  const lightStage = document.getElementById('stage-small-light');
  const tag = document.getElementById('size-status-tag');
  const dora = document.getElementById('doraemon-character');

  stage.classList.remove('hidden');
  lightStage.classList.remove('hidden');

  tag.textContent = "SHRINKING TO ANT SIZE! 🐜 (スモールライト)";
  audio.playWarpPortal();
  setDoraExpression('squint');

  // Shrink Doraemon down tiny
  dora.style.transform = 'scale(0.35)';

  const hi = "Small Light Ray! Dekho main chhota sa ant ban gaya!";
  const en = "Small Light Beam! Look, I shrunk down to a tiny ant!";
  const jp = "スモールライト！アリさんサイズになっちゃった！";
  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  // Big Light transformation after 3s
  setTimeout(() => {
    tag.textContent = "BIG LIGHT! GROWING TO GIANT SIZE! 🦖 (ビッグライト)";
    audio.playPocketFanfare();
    dora.style.transform = 'scale(1.4)';

    const bigHi = "Big Light! Ab main Giant Mega-Doraemon ban gaya!";
    const bigEn = "Big Light! Now I grew into a Giant Mega-Doraemon!";
    const bigJp = "ビッグライト！巨大ドラえもん登場！";
    setDoraDialogue(bigHi, bigEn, bigJp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? bigHi : bigEn);
  }, 3200);

  setTimeout(() => {
    dora.style.transform = 'scale(1)';
    lightStage.classList.add('hidden');
    stage.classList.add('hidden');
    setDoraExpression('normal');
    increaseHappiness(20);
  }, 6200);
}

// --- GADGET 4: TIME MACHINE HYPERSPACE (タイムマシン) ---
function activateTimeMachine() {
  const stage = document.getElementById('gadget-action-stage');
  const timeStage = document.getElementById('stage-time-machine');

  stage.classList.remove('hidden');
  timeStage.classList.remove('hidden');

  audio.playWarpPortal();
  setDoraExpression('stars');

  const hi = "Time Machine start ho gayi! 22nd Century aur Dinosaur age me time travel chal raha hai!";
  const en = "Time Machine started! Traveling through the space-time continuum to the future and dinosaurs!";
  const jp = "タイムマシン発進！時空トンネルをひとっ飛び！";
  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  setTimeout(() => {
    timeStage.classList.add('hidden');
    stage.classList.add('hidden');
    // Random teleport scene bonus
    const scenes = ['dino', 'space', 'tokyo'];
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
    changeScene(randomScene);
  }, 4000);
}

// --- GADGET 5: PASS LOOP DIMENSIONAL TUNNEL (通りぬけフープ) ---
function activatePassLoop() {
  const stage = document.getElementById('gadget-action-stage');
  const loopStage = document.getElementById('stage-pass-loop');
  const dora = document.getElementById('doraemon-character');

  stage.classList.remove('hidden');
  loopStage.classList.remove('hidden');

  audio.playWarpPortal();
  setDoraExpression('squint');

  // Doraemon phases through
  dora.style.opacity = '0.2';
  dora.style.transform = 'translateY(-40px) scale(0.6)';

  const hi = "Pass Loop! Main deewar ke paar doosri dimension me chala gaya!";
  const en = "Pass Loop! I phased right through the wall into another dimension!";
  const jp = "通りぬけフープ！壁の向こうへ通り抜け！";
  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  setTimeout(() => {
    dora.style.opacity = '1';
    dora.style.transform = 'scale(1.1)';
    audio.playPocketFanfare();
    setDoraExpression('stars');

    const outHi = "TADA! Main doosri taraf se bahar nikal aaya!";
    const outEn = "TADA! I emerged safely from the other side!";
    const outJp = "タダ！反対側から出てきたよ！";
    setDoraDialogue(outHi, outEn, outJp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? outHi : outEn);
  }, 2500);

  setTimeout(() => {
    dora.style.transform = 'scale(1)';
    loopStage.classList.add('hidden');
    stage.classList.add('hidden');
    setDoraExpression('normal');
    increaseHappiness(20);
  }, 5000);
}

// --- GADGET 6: TRANSLATION GUMMY MULTILINGUAL (ほんやくコンニャク) ---
function activateTranslationGummy() {
  const stage = document.getElementById('gadget-action-stage');
  const gummyStage = document.getElementById('stage-translation-gummy');

  stage.classList.remove('hidden');
  gummyStage.classList.remove('hidden');

  audio.playMunch();
  setDoraExpression('eating');

  const hi = "Translation Gummy khate hi main French, Japanese, Spanish aur Hindi bolne laga!";
  const en = "Eating Translation Gummy allows me to speak French, Japanese, Spanish and English fluently!";
  const jp = "ほんやくコンニャク！世界中の言葉がスラスラ話せるよ！";
  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

  setTimeout(() => {
    audio.playPocketFanfare();
    setDoraExpression('stars');
  }, 2000);

  setTimeout(() => {
    gummyStage.classList.add('hidden');
    stage.classList.add('hidden');
    setDoraExpression('normal');
    increaseHappiness(20);
  }, 4500);
}

// --- 9. ACTION 3: ANYWHERE DOOR ---
function openAnywhereDoorMenu() {
  document.getElementById('door-modal').classList.remove('hidden');
  audio.playBell();
}

function closeDoorModal() {
  document.getElementById('door-modal').classList.add('hidden');
}

function changeScene(sceneKey) {
  closeDoorModal();

  const places = {
    room: { name: "Nobita's Room", jp: "のび太の部屋" },
    beach: { name: "Sunny Beach", jp: "南の島ビーチ" },
    space: { name: "Outer Space", jp: "宇宙空間" },
    playground: { name: "Open Playground", jp: "空き地の土管" },
    tokyo: { name: "Tokyo Tower", jp: "東京タワー" },
    dino: { name: "Dinosaur Jungle", jp: "白亜紀恐竜の世界" }
  };

  const overlay = document.getElementById('warp-overlay');
  const doorPanel = document.getElementById('warp-door-panel');
  const text = document.getElementById('warp-destination-text');

  text.textContent = `Teleporting to ${places[sceneKey].name}...`;
  overlay.classList.remove('hidden');
  audio.playWarpPortal();

  setTimeout(() => { doorPanel.classList.add('open'); }, 300);

  setTimeout(() => {
    document.getElementById('scene-background').className = `scene-${sceneKey}`;
    PET_STATE.currentScene = sceneKey;

    overlay.classList.add('hidden');
    doorPanel.classList.remove('open');

    setDoraExpression('hearts');

    const hi = `Anywhere Door! Hum ${places[sceneKey].name} pahunch gaye!`;
    const en = `Anywhere Door! We arrived safely at ${places[sceneKey].name}!`;
    const jp = `どこでもドア！${places[sceneKey].jp}に到着！`;

    setDoraDialogue(hi, en, jp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
    increaseHappiness(15);

    setTimeout(() => {
      if (!PET_STATE.isPanicking) setDoraExpression('normal');
    }, 2000);
  }, 2000);
}

// --- 10. ACTION 4: DRAMATIC MOUSE PRANK (100% FULL SPEECH WITH ONCOMPLETE CALLBACK) ---
function triggerMousePrank() {
  if (PET_STATE.isPanicking) return;
  PET_STATE.isPanicking = true;

  const mouse = document.getElementById('prank-mouse');
  const dora = document.getElementById('doraemon-character');

  audio.playPanicScream();
  setDoraExpression('panic');

  mouse.classList.remove('hidden');
  dora.classList.add('panicking');

  const hiDisplay = "GYAAAAA! Chuha aa gaya! Nobita mujhe bachao! Chuhe ko door bhagao! AHHH!";
  const enDisplay = "GYAAAAA! A mouse is here! Nobita please save me! Get this mouse away!";
  const jpDisplay = "ぎゃああ！ネズミだー！のび太くん助けてー！";

  setDoraDialogue(hiDisplay, enDisplay, jpDisplay);

  spawnParticle('💦', window.innerWidth / 2 - 30, window.innerHeight / 2 - 60);
  spawnParticle('😱', window.innerWidth / 2 + 30, window.innerHeight / 2 - 60);

  // Clean phonetic spoken string so TTS engine speaks every single word fluently:
  const speechText = PET_STATE.voiceLang === 'hi' 
    ? "ग्याआआ! चूहा आ गया! नोबिता मुझे बचाओ! चूहे को दूर भगाओ!" 
    : "Gyaaa! A mouse is here! Nobita save me! Please get this mouse away!";

  // Wait until the panic speech has 100% finished before triggering relief!
  speakDoraemon(speechText, () => {
    setTimeout(() => {
      mouse.classList.add('hidden');
      dora.classList.remove('panicking');
      PET_STATE.isPanicking = false;

      setDoraExpression('squint');
      audio.playBell();

      const reliefHi = "Phew... Bach gaya! Chuha chala gaya! Please mujhe thoda pet karo!";
      const reliefEn = "Phew... Thank goodness! The mouse ran away! Please pet me gently!";
      const reliefJp = "ふう…ネズミがいなくなった！よかった〜！";

      setDoraDialogue(reliefHi, reliefEn, reliefJp);
      
      const reliefSpeech = PET_STATE.voiceLang === 'hi'
        ? "फ्यू... बच गया! चूहा चला गया! प्लीज मुझे थोड़ा प्यार करो!"
        : "Phew... Thank goodness! The mouse ran away! Please pet me gently!";

      speakDoraemon(reliefSpeech, () => {
        setTimeout(() => {
          if (!PET_STATE.isPanicking) setDoraExpression('normal');
        }, 1500);
      });
    }, 500);
  });
}

// --- 11. ACTION 5: DORAYAKI CATCH MINI-GAME (3 HEARTS + HIGH SCORE + RESULT MODAL) ---
function getMinigameHighScore() {
  return parseInt(localStorage.getItem('doraemon_highscore') || '0', 10);
}

function saveMinigameHighScore(score) {
  const current = getMinigameHighScore();
  if (score > current) {
    localStorage.setItem('doraemon_highscore', score.toString());
    return true; // new high score
  }
  return false;
}

function startMinigame() {
  PET_STATE.minigameActive = true;
  PET_STATE.minigameScore = 0;
  PET_STATE.minigameLives = 3;
  PET_STATE.minigameTimer = 30;

  const arena = document.getElementById('minigame-arena');
  const resultModal = document.getElementById('game-result-modal');
  if (resultModal) resultModal.classList.add('hidden');

  arena.classList.remove('hidden');
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-timer').textContent = '30s';
  document.getElementById('game-lives').textContent = '❤️❤️❤️';
  document.getElementById('game-high-score').textContent = getMinigameHighScore();

  const canvas = document.getElementById('game-canvas');
  const player = document.getElementById('game-player-dora');

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    player.style.left = `${Math.max(40, Math.min(rect.width - 40, x))}px`;
  };

  canvas.ontouchmove = (e) => {
    if (e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      player.style.left = `${Math.max(40, Math.min(rect.width - 40, x))}px`;
    }
  };

  PET_STATE.minigameInterval = setInterval(() => {
    PET_STATE.minigameTimer--;
    document.getElementById('game-timer').textContent = `${PET_STATE.minigameTimer}s`;

    if (PET_STATE.minigameTimer <= 0) {
      endMinigame(false); // Time up win
    }
  }, 1000);

  PET_STATE.minigameSpawnInterval = setInterval(() => {
    spawnFallingGameItem();
  }, 550);

  const hi = "Dorayaki Catch Game shuru! 🍘 aur 🌟 catch karo! Chuha lagte hi 1 Heart toot jayega!";
  const en = "Dorayaki Catch Game started! Catch 🍘 and 🌟! Avoid 🐭 or you lose a Heart!";
  const jp = "どら焼きキャッチゲームスタート！ネズミに気をつけて！";
  setDoraDialogue(hi, en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
}

function spawnFallingGameItem() {
  if (!PET_STATE.minigameActive) return;
  const canvas = document.getElementById('game-canvas');
  const item = document.createElement('div');
  item.className = 'falling-game-item';

  const types = [
    { emoji: '🍘', pts: 10, isMouse: false },
    { emoji: '🍘', pts: 10, isMouse: false },
    { emoji: '🌟', pts: 30, isMouse: false },
    { emoji: '🐭', pts: 0, isMouse: true }
  ];
  const chosen = types[Math.floor(Math.random() * types.length)];
  item.textContent = chosen.emoji;

  const rect = canvas.getBoundingClientRect();
  const startX = Math.random() * (rect.width - 60) + 30;
  item.style.left = `${startX}px`;
  item.style.top = '-50px';

  canvas.appendChild(item);

  let currentY = -50;
  const speed = 4.5 + Math.random() * 3.5;

  const fall = setInterval(() => {
    if (!PET_STATE.minigameActive) {
      clearInterval(fall);
      if (item.parentNode) canvas.removeChild(item);
      return;
    }

    currentY += speed;
    item.style.top = `${currentY}px`;

    const player = document.getElementById('game-player-dora');
    const pRect = player.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();

    if (
      iRect.bottom >= pRect.top + 20 &&
      iRect.top <= pRect.bottom &&
      iRect.left <= pRect.right &&
      iRect.right >= pRect.left
    ) {
      clearInterval(fall);
      if (item.parentNode) canvas.removeChild(item);

      if (chosen.isMouse) {
        // MOUSE HIT: LOSE 1 HEART LIFE!
        audio.playPanicScream();
        PET_STATE.minigameLives--;

        // Red Hit Flash
        canvas.classList.add('hit-flash');
        setTimeout(() => canvas.classList.remove('hit-flash'), 300);

        // Update Hearts display
        const heartsIcons = ['🖤🖤🖤', '❤️🖤🖤', '❤️❤️🖤', '❤️❤️❤️'];
        const currentHearts = heartsIcons[Math.max(0, PET_STATE.minigameLives)];
        document.getElementById('game-lives').textContent = currentHearts;

        spawnParticle('💔', iRect.left, iRect.top);
        spawnParticle('😱', iRect.left + 20, iRect.top);

        if (PET_STATE.minigameLives <= 0) {
          // OUT! 3RD HEART BROKEN
          endMinigame(true);
          return;
        }
      } else {
        // CATCH TREAT (DORAYAKI / STAR)
        if (chosen.emoji === '🌟') {
          audio.playPocketFanfare();
          spawnParticle('⭐', iRect.left, iRect.top);
        } else {
          audio.playMunch();
          spawnParticle('✨', iRect.left, iRect.top);
        }
        PET_STATE.minigameScore += chosen.pts;
        document.getElementById('game-score').textContent = PET_STATE.minigameScore;
      }
    } else if (currentY > rect.height) {
      clearInterval(fall);
      if (item.parentNode) canvas.removeChild(item);
    }
  }, 20);
}

function stopMinigame() {
  PET_STATE.minigameActive = false;
  clearInterval(PET_STATE.minigameInterval);
  clearInterval(PET_STATE.minigameSpawnInterval);
  document.getElementById('minigame-arena').classList.add('hidden');
}

function restartMinigame() {
  document.getElementById('game-result-modal').classList.add('hidden');
  startMinigame();
}

function closeGameResultModal() {
  document.getElementById('game-result-modal').classList.add('hidden');
  stopMinigame();
  if (!PET_STATE.isPanicking) setDoraExpression('normal');
}

function endMinigame(isOut = false) {
  PET_STATE.minigameActive = false;
  clearInterval(PET_STATE.minigameInterval);
  clearInterval(PET_STATE.minigameSpawnInterval);

  const isNewHigh = saveMinigameHighScore(PET_STATE.minigameScore);
  const best = getMinigameHighScore();

  const modal = document.getElementById('game-result-modal');
  const icon = document.getElementById('result-icon');
  const title = document.getElementById('result-title');
  const newHighBadge = document.getElementById('new-high-badge');
  const finalScore = document.getElementById('final-score-val');
  const finalHigh = document.getElementById('final-high-val');
  const finalHearts = document.getElementById('final-hearts-val');

  finalScore.textContent = PET_STATE.minigameScore;
  finalHigh.textContent = best;

  const heartsIcons = ['🖤🖤🖤', '❤️🖤🖤', '❤️❤️🖤', '❤️❤️❤️'];
  finalHearts.textContent = heartsIcons[Math.max(0, PET_STATE.minigameLives)];

  if (isNewHigh) {
    newHighBadge.classList.remove('hidden');
  } else {
    newHighBadge.classList.add('hidden');
  }

  if (isOut) {
    // OUT RESULT
    audio.playPanicScream();
    icon.textContent = '🐭💔';
    title.textContent = 'Game Over! (Out ho gaye!)';
    title.style.color = '#dc2626';
    setDoraExpression('panic');
  } else {
    // VICTORY RESULT
    audio.playPocketFanfare();
    icon.textContent = '🏆⭐';
    title.textContent = 'Victory! Time Completed!';
    title.style.color = '#15803d';
    setDoraExpression('stars');
    increaseHappiness(25);
    increaseTummy(30);
    checkLevelUp();
  }

  modal.classList.remove('hidden');
}

// --- 12. ACTION 6: DRESS-UP & LEVEL UNLOCK PROGRESSION ---
function openCostumeModal() {
  updateCostumeLockStatus();
  document.getElementById('costume-modal').classList.remove('hidden');
  audio.playBell();
}

function closeCostumeModal() {
  document.getElementById('costume-modal').classList.add('hidden');
}

function updateCostumeLockStatus() {
  const lvl = PET_STATE.level;

  // Level 2 Hats (Chef, Ribbon)
  const lockChef = document.getElementById('lock-chef');
  const lockRibbon = document.getElementById('lock-ribbon');
  const cardChef = document.getElementById('card-hat-chef');
  const cardRibbon = document.getElementById('card-hat-ribbon');

  if (lvl >= 2) {
    if (lockChef) lockChef.style.display = 'none';
    if (lockRibbon) lockRibbon.style.display = 'none';
    if (cardChef) cardChef.classList.remove('locked');
    if (cardRibbon) cardRibbon.classList.remove('locked');
  } else {
    if (lockChef) lockChef.style.display = 'block';
    if (lockRibbon) lockRibbon.style.display = 'block';
    if (cardChef) cardChef.classList.add('locked');
    if (cardRibbon) cardRibbon.classList.add('locked');
  }

  // Level 3 Hats (Crown, Sunglasses)
  const lockCrown = document.getElementById('lock-crown');
  const lockSun = document.getElementById('lock-sunglasses');
  const cardCrown = document.getElementById('card-hat-crown');
  const cardSun = document.getElementById('card-hat-sunglasses');

  if (lvl >= 3) {
    if (lockCrown) lockCrown.style.display = 'none';
    if (lockSun) lockSun.style.display = 'none';
    if (cardCrown) cardCrown.classList.remove('locked');
    if (cardSun) cardSun.classList.remove('locked');
  } else {
    if (lockCrown) lockCrown.style.display = 'block';
    if (lockSun) lockSun.style.display = 'block';
    if (cardCrown) cardCrown.classList.add('locked');
    if (cardSun) cardSun.classList.add('locked');
  }
}

function applyCostumeHat(hatKey) {
  const lvl = PET_STATE.level;

  // Level Requirements Check:
  if ((hatKey === 'chef' || hatKey === 'ribbon') && lvl < 2) {
    audio.playHonk();
    const hi = "Yeh Hat Level 2 par unlock hogi! Pehle Doraemon ko Dorayaki khila kar level badhao!";
    const en = "This Hat unlocks at Level 2! Feed Doraemon Dorayakis to level up!";
    setDoraDialogue(hi, en, "レベル2でアンロックされます！");
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
    return;
  }

  if ((hatKey === 'crown' || hatKey === 'sunglasses') && lvl < 3) {
    audio.playHonk();
    const hi = "Yeh Royal Hat Level 3 par unlock hogi! Thoda aur khelo aur level up karo!";
    const en = "This Royal Hat unlocks at Level 3! Play more to level up!";
    setDoraDialogue(hi, en, "レベル3でアンロックされます！");
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
    return;
  }

  closeCostumeModal();
  
  // Hide all custom SVG hats
  const allHats = document.querySelectorAll('.custom-svg-hat');
  allHats.forEach(h => h.classList.add('hidden'));

  PET_STATE.currentHat = hatKey;

  if (hatKey !== 'none') {
    const target = document.getElementById(`hat-${hatKey}`);
    if (target) target.classList.remove('hidden');
  }

  audio.playPocketFanfare();
  setDoraExpression('stars');

  const titles = {
    none: { hi: "Classic Doraemon look!", en: "Classic Doraemon look!" },
    crown: { hi: "Dekho main Golden King Crown me kaisa lag raha hoon!", en: "Look at me in this Royal Golden King Crown!" },
    detective: { hi: "Detective Doraemon case solve karne ke liye ready hai!", en: "Detective Sherlock Doraemon is ready to solve mysteries!" },
    party: { hi: "Yay! Party hat pehankar celebration shuru!", en: "Yay! Celebration started with this festive party hat!" },
    chef: { hi: "Master Chef Doraemon tasty Dorayaki bake karega!", en: "Master Chef Doraemon will bake delicious Dorayakis!" },
    ribbon: { hi: "Dekho Dorami jaisa pyara red ribbon bow!", en: "Look at this cute red ribbon bow just like Dorami!" },
    sunglasses: { hi: "Superstar Doraemon cool sunglasses me rock kar raha hai!", en: "Superstar Doraemon rocking these dark cool shades!" }
  };

  const chosen = titles[hatKey] || titles.none;
  const jp = "着せ替えカメラ！新しいスタイルだよ！";

  setDoraDialogue(chosen.hi, chosen.en, jp);
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? chosen.hi : chosen.en);

  setTimeout(() => {
    if (!PET_STATE.isPanicking) setDoraExpression('normal');
  }, 2200);
}

function closeLevelUpModal() {
  document.getElementById('level-up-modal').classList.add('hidden');
}

function checkLevelUp() {
  const newLvl = 1 + Math.floor(PET_STATE.totalFed / 4);
  if (newLvl > PET_STATE.level) {
    PET_STATE.level = newLvl;
    document.getElementById('user-level').textContent = `Level ${newLvl} Super Buddy ⭐`;
    audio.playPocketFanfare();
    setDoraExpression('stars');

    // Show Level Up Celebration Modal
    const modal = document.getElementById('level-up-modal');
    const title = document.getElementById('levelup-title');
    const desc = document.getElementById('levelup-desc');
    const rewardIcon = document.getElementById('levelup-reward-icon');
    const rewardName = document.getElementById('levelup-reward-name');

    title.textContent = `LEVEL ${newLvl} ACHIEVED! ⭐`;
    desc.textContent = `Badhaai ho! Aap Level ${newLvl} par pahunch gaye!`;

    if (newLvl === 2) {
      rewardIcon.textContent = '👨‍🍳 🎀';
      rewardName.textContent = 'Unlocked: Master Chef Hat & Dorami Ribbon!';
    } else if (newLvl >= 3) {
      rewardIcon.textContent = '👑 🕶️';
      rewardName.textContent = 'Unlocked: Royal Gem Crown & Superstar Shades!';
    }

    modal.classList.remove('hidden');
    updateCostumeLockStatus();
  }
}

// --- 13. ACTION 7: FLY WITH TAKE-COPTER (AUTHENTIC SKY FLIGHT & WIND BLOW) ---
function toggleTakeCopterFly() {
  const dora = document.getElementById('doraemon-character');
  const copter = document.getElementById('take-copter');
  const blade = document.getElementById('copter-blade');
  const floorShadow = document.getElementById('dora-floor-shadow');
  const windFx = document.getElementById('flight-wind-fx');

  PET_STATE.isFlying = !PET_STATE.isFlying;

  if (PET_STATE.isFlying) {
    // 1. Equip Bamboo Copter on head with Pop!
    if (copter) copter.classList.remove('hidden');
    if (blade) blade.classList.add('spinning');
    
    // 2. Lift Doraemon high into the air
    dora.classList.add('flying');
    if (floorShadow) floorShadow.classList.add('flying');
    if (windFx) windFx.classList.remove('hidden');

    setDoraExpression('squint');
    audio.playWarpPortal();

    // 3. Continuous wind & cloud particles
    PET_STATE.flightWindInterval = setInterval(() => {
      if (!PET_STATE.isFlying) {
        clearInterval(PET_STATE.flightWindInterval);
        return;
      }
      spawnParticle('💨', Math.random() * window.innerWidth, window.innerHeight / 2 + (Math.random() * 120 - 60));
      spawnParticle('🍃', Math.random() * window.innerWidth, window.innerHeight / 2 + (Math.random() * 120 - 60));
      spawnParticle('☁️', Math.random() * window.innerWidth, window.innerHeight / 2 - 100);
    }, 450);

    const hi = "Hai! Take-copter! 🚁 Dekho tezi se hawa chal rahi hai aur main aasman me ud raha hoon!";
    const en = "Hai! Take-copter! 🚁 Strong wind is blowing as I soar high in the sky!";
    const jp = "ハーイ！タケコプター！風を切って大空を飛んでいるよ！";

    setDoraDialogue(hi, en, jp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
  } else {
    // Land safely back on the ground
    if (blade) blade.classList.remove('spinning');
    dora.classList.remove('flying');
    if (floorShadow) floorShadow.classList.remove('flying');
    if (windFx) windFx.classList.add('hidden');
    clearInterval(PET_STATE.flightWindInterval);

    // Put Bamboo Copter back into 4D Pocket after landing
    setTimeout(() => {
      if (!PET_STATE.isFlying && copter) copter.classList.add('hidden');
    }, 400);

    setDoraExpression('normal');
    audio.playBell();

    const hi = "Safe landing! Zameen par wapas aa gaye, flight kitni mazedaar thi!";
    const en = "Safe landing! We are back on the ground, that flight was so thrilling!";
    const jp = "無事に着地！風が気持ちよかったね！";

    setDoraDialogue(hi, en, jp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
  }
}

const HINDI_SONG_LYRICS = [
  { start: 0, end: 4.5, hi: "🎵 [Intro Music 🎺🥁] Doraemon Song Shuru! 🎶", en: "🎵 [Intro Music 🎺🥁] Doraemon Song Started! 🎶", jp: "🎵 ドラえもんのうた 🎵" },
  { start: 4.5, end: 12.5, hi: "🎵 Zindagi sawar doon, ik nayi bahaar doon, duniya hi badal doon main toh pyara sa chamatkaar hoon! ✨", en: "🎵 Zindagi sawar doon, ik nayi bahaar doon, duniya hi badal doon main toh pyara sa chamatkaar hoon! ✨", jp: "🎵 心を込めて歌おう！ 🎵" },
  { start: 12.5, end: 20.0, hi: "🎵 Main kisi ka sapna hoon jo aaj ban chuka hoon sach, ab ye mera sapna hai ki sabke sapne sach main karoon! 🌟", en: "🎵 Main kisi ka sapna hoon jo aaj ban chuka hoon sach, ab ye mera sapna hai ki sabke sapne sach main karoon! 🌟", jp: "🎵 みんなの夢をかなえよう！ 🎵" },
  { start: 20.0, end: 27.5, hi: "🎵 Aasman ko chhoo loon titli ban udoon... (Hai! Take-copter!) 🚁", en: "🎵 Aasman ko chhoo loon titli ban udoon... (Hai! Take-copter!) 🚁", jp: "🎵 空を飛ぼう！タケコプター！ 🎵" },
  { start: 27.5, end: 37.0, hi: "🎵 An-an-an, main hoon ek udta robo, Doraemon! ❤️", en: "🎵 An-an-an, main hoon ek udta robo, Doraemon! ❤️", jp: "🎵 アンアンアン とっても大好き ドラえもん 🎵" },
  { start: 37.0, end: 48.0, hi: "🎵 Doko demo doaa... Main hoon Doraemon! 🚪✨", en: "🎵 Doko demo doaa... Main hoon Doraemon! 🚪✨", jp: "🎵 どこでもドア！ドラえもん！ 🎵" },
  { start: 48.0, end: 146.0, hi: "🎵 Yay! Doraemon ke saath dosti sada amar rahegi! 🎉✨", en: "🎵 Yay! Friendship with Doraemon will last forever! 🎉✨", jp: "🎵 ドラえもんとずっと友達！ 🎵" }
];

// --- 14. ACTION 8: FLOATING MUSIC PLAYER & REAL SONG MP3 ---
function toggleSongPlayback() {
  const hindiSong = document.getElementById('doraemon-hindi-song');
  const jpSong = document.getElementById('doraemon-japanese-song');
  const currentSong = hindiSong || jpSong;
  const playBtn = document.getElementById('music-play-pause-btn');

  if (currentSong.paused) {
    currentSong.play();
    PET_STATE.isPlayingSong = true;
    if (playBtn) playBtn.textContent = '⏸';
    document.getElementById('doraemon-character').classList.add('dancing');
    document.getElementById('disco-overlay').classList.remove('hidden');
  } else {
    currentSong.pause();
    PET_STATE.isPlayingSong = false;
    if (playBtn) playBtn.textContent = '▶';
    document.getElementById('doraemon-character').classList.remove('dancing');
    document.getElementById('disco-overlay').classList.add('hidden');
  }
}

function stopMusicPlayer() {
  const hindiSong = document.getElementById('doraemon-hindi-song');
  const jpSong = document.getElementById('doraemon-japanese-song');
  if (hindiSong) { hindiSong.pause(); hindiSong.currentTime = 0; }
  if (jpSong) { jpSong.pause(); jpSong.currentTime = 0; }
  PET_STATE.isPlayingSong = false;
  document.getElementById('floating-music-bar').classList.add('hidden');
  document.getElementById('doraemon-character').classList.remove('dancing');
  document.getElementById('disco-overlay').classList.add('hidden');
  if (!PET_STATE.isPanicking) setDoraExpression('normal');
}

function triggerHappyDance() {
  const dora = document.getElementById('doraemon-character');
  const disco = document.getElementById('disco-overlay');
  const musicBar = document.getElementById('floating-music-bar');
  const playBtn = document.getElementById('music-play-pause-btn');

  // Cancel ANY speech synthesis voice immediately
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const hindiSong = document.getElementById('doraemon-hindi-song');
  const jpSong = document.getElementById('doraemon-japanese-song');
  const currentSong = (PET_STATE.voiceLang === 'hi') ? (hindiSong || jpSong) : (jpSong || hindiSong);

  // Toggle Pause/Stop if song is already playing
  if (PET_STATE.isPlayingSong) {
    stopMusicPlayer();
    setDoraDialogue("Song paused! 🎶", "Song paused! 🎶", "一時停止！");
    return;
  }

  PET_STATE.isPlayingSong = true;
  dora.classList.add('dancing');
  disco.classList.remove('hidden');
  musicBar.classList.remove('hidden');
  if (playBtn) playBtn.textContent = '⏸';
  setDoraExpression('squint');

  // Play the authentic studio MP3 track
  if (currentSong) {
    currentSong.currentTime = 0;
    currentSong.play().catch(e => console.warn("Song play:", e));

    currentSong.onended = () => {
      stopMusicPlayer();
      setDoraDialogue("Doraemon Song complete! 👏 Kitna shaandar gaana tha!", "Doraemon Song complete! 👏 What a wonderful song!", "大好きな曲でした！ありがとう！");
    };
  }

  // Floating continuous music particles
  const particleLoop = setInterval(() => {
    if (!PET_STATE.isPlayingSong) {
      clearInterval(particleLoop);
      return;
    }
    spawnParticle('🎵', window.innerWidth / 2 + (Math.random() * 160 - 80), window.innerHeight / 2 - 30);
    spawnParticle('✨', window.innerWidth / 2 + (Math.random() * 160 - 80), window.innerHeight / 2);
    spawnParticle('⭐', window.innerWidth / 2 + (Math.random() * 160 - 80), window.innerHeight / 2 - 60);
  }, 1000);

  // Clean Festive Banner (No dynamic lyrics lines - Pure Song Experience)
  if (PET_STATE.lyricsInterval) clearInterval(PET_STATE.lyricsInterval);
  setDoraDialogue("🎵 Doraemon Theme Song Playing! 🎶 Enjoy the music!", "🎵 Doraemon Theme Song Playing! 🎶 Enjoy the music!", "🎵 ドラえもんのうた 🎵");

  increaseHappiness(30);
}

// --- 15. STAT METERS & HELPERS ---
function increaseHappiness(val) {
  PET_STATE.happiness = Math.min(100, PET_STATE.happiness + val);
  updateMetersUI();
}

function increaseTummy(val) {
  PET_STATE.tummy = Math.min(100, PET_STATE.tummy + val);
  updateMetersUI();
}

function updateMetersUI() {
  document.getElementById('love-bar').style.width = `${PET_STATE.happiness}%`;
  document.getElementById('love-percent').textContent = `${PET_STATE.happiness}%`;

  document.getElementById('tummy-bar').style.width = `${PET_STATE.tummy}%`;
  document.getElementById('tummy-percent').textContent = `${PET_STATE.tummy}%`;
}

function checkLevelUp() {
  const newLvl = 1 + Math.floor(PET_STATE.totalFed / 3);
  if (newLvl > PET_STATE.level) {
    PET_STATE.level = newLvl;
    document.getElementById('user-level').textContent = `Level ${newLvl} Super Buddy ⭐`;
    audio.playPocketFanfare();
    setDoraExpression('stars');

    const hi = `LEVEL UP! Hum ab Level ${newLvl} ke super best friends ban gaye!`;
    const en = `LEVEL UP! We are now Level ${newLvl} best buddies!`;
    const jp = `レベルアップ！大親友レベル${newLvl}になったよ！`;

    setDoraDialogue(hi, en, jp);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);

    setTimeout(() => {
      if (!PET_STATE.isPanicking) setDoraExpression('normal');
    }, 2500);
  }
}

function spawnParticle(emoji, x, y) {
  const p = document.createElement('div');
  p.className = 'particle-item';
  p.textContent = emoji;
  p.style.left = `${x || window.innerWidth / 2}px`;
  p.style.top = `${y || window.innerHeight / 2}px`;

  document.body.appendChild(p);
  setTimeout(() => {
    if (p.parentNode) p.parentNode.removeChild(p);
  }, 1400);
}

// Gentle tummy decay
setInterval(() => {
  if (PET_STATE.tummy > 10) {
    PET_STATE.tummy = Math.max(0, PET_STATE.tummy - 1);
    updateMetersUI();
  }
}, 8000);

/* =========================================================
   ADULT FEATURES 1: MOSHI-MOSHI BOX (WHAT-IF LIFE SIMULATOR)
   ========================================================= */
const WHATIF_SCENARIOS = [
  {
    title: "Mondays Banned & 2-Day Workweeks Worldwide",
    headline: "Global Mandate: 5-Day Weekends Declared Human Right!",
    economy: "Employee happiness reaches 99.8%! Coffee stocks dip, but gaming servers crash from joyful overload!",
    review: "Nobita is still waking up late at 2 PM, but now he is legally on schedule! 😴✨",
    hi: "Moshi-Moshi Box activated! Ab se duniya me Monday ban hai aur hafte me sirf 2 din office hoga!",
    en: "Moshi-Moshi Box activated! Mondays are officially banned and work is only 2 days a week!"
  },
  {
    title: "0% Taxes & Dorayaki Pancake Currency",
    headline: "Reserve Banks Announce: All Salaries Paid in Hot Red-Bean Dorayakis!",
    economy: "Inflation plummets to zero because everyone just eats their savings! Gold replaced by extra honey glaze!",
    review: "My 4D pocket is now worth 500 Trillion Dorayakis! I am officially the happiest robot in history! 🍘👑",
    hi: "Kamaal ho gaya! Ab 0% tax hai aur saari currency Dorayaki ban chuki hai!",
    en: "Incredible! 0% tax worldwide and everyone gets paid in warm Dorayakis!"
  },
  {
    title: "Paid Nap Promotions During Board Meetings",
    headline: "Corporate Revolution: Loudest Snorers Promoted Directly to Executive Vice President!",
    economy: "Mattress and pillow companies become the most valuable conglomerates on Earth!",
    review: "Nobita just got promoted to Senior Managing Director in 3 minutes of deep slumber! 🏆💤",
    hi: "Board meetings me sone par promotion mil rahi hai! Nobita ab CEO ban gaya hai!",
    en: "Sleeping during meetings now earns executive bonuses! Nobita is the top performer!"
  },
  {
    title: "1 Cup Coffee Gives Instant Teleportation Powers",
    headline: "Airlines & Traffic Jams Go Extinct: Commuters Sip Espresso & Teleport to Tokyo in 0.1s!",
    economy: "Zero carbon emissions achieved in 24 hours! Baristas become the most respected aerospace scientists!",
    review: "Now nobody needs my Anywhere Door anymore, but the coffee smells fantastic! ☕🚀",
    hi: "1 cup coffee peete hi instant teleportation! Ab traffic jam hamesha ke liye khatam!",
    en: "Drink 1 coffee and teleport anywhere instantly! Zero morning commute traffic!"
  },
  {
    title: "Negative Calorie Pizza & Cheese Burn Fat",
    headline: "Dieticians Rejoice: Extra Cheese Stuffed Crust Burns 800 Calories per Slice!",
    economy: "Gyms convert into 24/7 Italian Pizzerias. Global fitness scores hit all-time highs!",
    review: "Gian tried to eat 50 pizzas and accidentally became an Olympic sprint champion! 🍕💪",
    hi: "Pizza khane se fat burn ho raha hai! Jitna cheese khaoge utni fitness badhegi!",
    en: "Pizza now has negative calories! Eating double cheese gives you instant six-pack abs!"
  },
  {
    title: "Nobita Becomes Fortune 500 Billionaire Tech CEO",
    headline: "Nobita Industries Valuation Crosses $10 Trillion with Revolutionary Nap-AI Gadgets!",
    economy: "Suneo applies for an internship, and Gian asks Nobita for his autograph on TV!",
    review: "He still asks me to do his primary school homework, but at least he pays in premium Dorayakis now! 🕶️💼",
    hi: "Nobita duniya ka sabse ameer tech CEO ban gaya! Suneo usse autograph maang raha hai!",
    en: "Nobita is now a $10 Trillion tech mogul! Even Gian is lining up for his autograph!"
  }
];

function openWhatIfModal() {
  document.getElementById('whatif-modal').classList.remove('hidden');
  audio.playBell();
}

function closeWhatIfModal() {
  document.getElementById('whatif-modal').classList.add('hidden');
}

function simulateScenario(idx) {
  const s = WHATIF_SCENARIOS[idx];
  executeWhatIfSimulation(s.title, s.headline, s.economy, s.review, s.hi, s.en);
}

function simulateCustomScenario() {
  const input = document.getElementById('custom-scenario-input');
  const query = input.value.trim();
  if (!query) return;

  const headline = `Alternate Timeline Generated: "${query}"`;
  const economy = "Global timeline restructured with unexpected comic ripples across spacetime!";
  const review = "Whatever happens, as long as we have Dorayakis and good friends, life is great!";
  const hi = `Moshi-Moshi Box ne aapka custom scenario universe me implement kar diya: ${query}!`;
  const en = `Moshi-Moshi Box has restructured reality to fit your wish: ${query}!`;

  executeWhatIfSimulation(query, headline, economy, review, hi, en);
  input.value = '';
}

function executeWhatIfSimulation(title, headline, economy, review, hi, en) {
  audio.playWarpPortal();
  setDoraExpression('squint');

  const report = document.getElementById('alternate-universe-report');
  document.getElementById('report-title').textContent = `📰 BREAKING: ${title}`;
  document.getElementById('report-headline').textContent = headline;
  document.getElementById('report-economy').textContent = economy;
  document.getElementById('report-review').textContent = review;

  report.classList.remove('hidden');
  report.scrollIntoView({ behavior: 'smooth' });

  setDoraDialogue(hi, en, "もしもボックス！新しい世界が誕生したよ！");
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
  increaseHappiness(20);
}

function resetDimension() {
  audio.playPocketFanfare();
  document.getElementById('alternate-universe-report').classList.add('hidden');
  setDoraExpression('normal');

  const hi = "Timeline restored! Wapas normal reality me aa gaye!";
  const en = "Timeline restored! Back to normal cozy reality!";
  setDoraDialogue(hi, en, "元の世界に戻ったよ！");
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
}

/* =========================================================
   ADULT FEATURES 2: GIAN CONCERT SURVIVAL RHYTHM DEFENSE
   ========================================================= */
const GIAN_STATE = {
  active: false,
  sanity: 100,
  timer: 30,
  shields: 3,
  interval: null,
  spawnInterval: null
};

function startGianConcertGame() {
  GIAN_STATE.active = true;
  GIAN_STATE.sanity = 100;
  GIAN_STATE.timer = 30;
  GIAN_STATE.shields = 3;

  const arena = document.getElementById('gian-concert-arena');
  const result = document.getElementById('gian-result-modal');
  if (result) result.classList.add('hidden');

  arena.classList.remove('hidden');
  document.getElementById('gian-sanity-val').textContent = '100%';
  document.getElementById('gian-timer-val').textContent = '30s';
  document.getElementById('gian-shields-count').textContent = '3';

  const stage = document.getElementById('gian-stage-area');
  const player = document.getElementById('gian-player-dora');

  stage.onmousemove = (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    player.style.left = `${Math.max(40, Math.min(rect.width - 40, x))}px`;
  };

  stage.ontouchmove = (e) => {
    if (e.touches[0]) {
      const rect = stage.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      player.style.left = `${Math.max(40, Math.min(rect.width - 40, x))}px`;
    }
  };

  audio.playPanicScream();

  GIAN_STATE.interval = setInterval(() => {
    GIAN_STATE.timer--;
    document.getElementById('gian-timer-val').textContent = `${GIAN_STATE.timer}s`;

    if (GIAN_STATE.timer <= 0) {
      endGianConcertGame(true); // Victory survival!
    }
  }, 1000);

  GIAN_STATE.spawnInterval = setInterval(() => {
    spawnGianSonicItem();
  }, 480);

  const hi = "Gian ka concert shuru! 🎧 Earplugs aur 🛡️ Shields pakdo! Sonic blasts 💥 se bacho!";
  const en = "Gian's concert started! Catch 🎧 Earplugs & 🛡️ Shields! Dodge deafening blasts!";
  setDoraDialogue(hi, en, "ジャイアンのリサイタルだ！耳をふさごう！");
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
}

function spawnGianSonicItem() {
  if (!GIAN_STATE.active) return;
  const stage = document.getElementById('gian-stage-area');
  const item = document.createElement('div');
  item.className = 'falling-sonic-item';

  const types = [
    { emoji: '⚡', dmg: 25, isHelp: false },
    { emoji: '💣', dmg: 35, isHelp: false },
    { emoji: '📢', dmg: 20, isHelp: false },
    { emoji: '💔', dmg: 15, isHelp: false },
    { emoji: '🎧', heal: 20, isHelp: true, isEarplug: true },
    { emoji: '🛡️', heal: 30, isHelp: true, isShield: true },
    { emoji: '🍘', heal: 15, isHelp: true }
  ];

  const chosen = types[Math.floor(Math.random() * types.length)];
  item.textContent = chosen.emoji;

  const rect = stage.getBoundingClientRect();
  const startX = Math.random() * (rect.width - 60) + 30;
  item.style.left = `${startX}px`;
  item.style.top = '120px';

  stage.appendChild(item);

  let currentY = 120;
  const speed = 5.0 + Math.random() * 4.0;

  const fall = setInterval(() => {
    if (!GIAN_STATE.active) {
      clearInterval(fall);
      if (item.parentNode) stage.removeChild(item);
      return;
    }

    currentY += speed;
    item.style.top = `${currentY}px`;

    const player = document.getElementById('gian-player-dora');
    const pRect = player.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();

    if (
      iRect.bottom >= pRect.top + 20 &&
      iRect.top <= pRect.bottom &&
      iRect.left <= pRect.right &&
      iRect.right >= pRect.left
    ) {
      clearInterval(fall);
      if (item.parentNode) stage.removeChild(item);

      if (chosen.isHelp) {
        // Heal / Shield Catch
        audio.playPocketFanfare();
        GIAN_STATE.sanity = Math.min(100, GIAN_STATE.sanity + chosen.heal);
        document.getElementById('gian-sanity-val').textContent = `${GIAN_STATE.sanity}%`;
        spawnParticle('✨', iRect.left, iRect.top);
      } else {
        // Sonic Blast Damage
        audio.playHonk();
        GIAN_STATE.sanity = Math.max(0, GIAN_STATE.sanity - chosen.dmg);
        document.getElementById('gian-sanity-val').textContent = `${GIAN_STATE.sanity}%`;
        spawnParticle('💥', iRect.left, iRect.top);

        if (GIAN_STATE.sanity <= 0) {
          endGianConcertGame(false); // Sanity popped OUT
        }
      }
    } else if (currentY > rect.height) {
      clearInterval(fall);
      if (item.parentNode) stage.removeChild(item);
    }
  }, 20);
}

function stopGianConcertGame() {
  GIAN_STATE.active = false;
  clearInterval(GIAN_STATE.interval);
  clearInterval(GIAN_STATE.spawnInterval);
  document.getElementById('gian-concert-arena').classList.add('hidden');
}

function closeGianConcertModal() {
  document.getElementById('gian-result-modal').classList.add('hidden');
  stopGianConcertGame();
}

function endGianConcertGame(isVictory) {
  GIAN_STATE.active = false;
  clearInterval(GIAN_STATE.interval);
  clearInterval(GIAN_STATE.spawnInterval);

  const modal = document.getElementById('gian-result-modal');
  const icon = document.getElementById('gian-result-icon');
  const title = document.getElementById('gian-result-title');
  const desc = document.getElementById('gian-result-desc');

  if (isVictory) {
    audio.playPocketFanfare();
    icon.textContent = '🏆 🎧 🌟';
    title.textContent = 'Auditory Survivor Champion!';
    title.style.color = '#22c55e';
    desc.textContent = 'You withstood 30 seconds of Gian\'s ear-shattering vocals!';
    increaseHappiness(35);
    increaseTummy(20);
    checkLevelUp();
  } else {
    audio.playPanicScream();
    icon.textContent = '📢 💥 😵';
    title.textContent = 'Eardrums Overwhelmed!';
    title.style.color = '#ef4444';
    desc.textContent = 'Gian\'s decibels were too immense! Grab more Earplugs next time!';
  }

  modal.classList.remove('hidden');
}

/* =========================================================
   ADULT FEATURES 3: 22ND-CENTURY TRIVIA & BRAIN SHOW (EXPANDED)
   ========================================================= */
const TRIVIA_DATABASE = {
  anime: [
    {
      q: "Doraemon ki favorite food Dorayaki me kaunsi authentic sweet filling hoti hai?",
      correct: "Azuki (Sweet Red Bean Paste)",
      wrong: ["Chocolate Ganache", "Vanilla Custard Cream", "Peanut Butter & Honey"],
      fact: "Dorayaki ek authentic traditional Japanese dessert pancake hai jiske andar sweet boiled Azuki red-bean paste bhara hota hai!"
    },
    {
      q: "Doraemon ke yellow ears kisne chabaye the jisse uska original yellow paint dhul gaya?",
      correct: "Robot Mice (22nd-Century चूहे)",
      wrong: ["Gian ka Dog Muku", "Nobita by Mistake", "Sewashi's Pet Cat"],
      fact: "22nd-century ke robot chuhe ne Doraemon ke kaan chabaye the, aur darr ke aansuon ke shock se uska yellow color blue ho gaya!"
    },
    {
      q: "Doraemon kis century se Nobita ki future life theek karne aaya hai?",
      correct: "22nd Century (Birth: 2112)",
      wrong: ["21st Century (2050)", "25th Century", "30th Century"],
      fact: "Doraemon ka janm 3 September 2112 ko Tokyo ki Matsushiba Robot Factory me hua tha!"
    },
    {
      q: "Doraemon ki choti sister Dorami ke sir par ears ki jagah kya laga hota hai?",
      correct: "Cute Flower Bow Attachment",
      wrong: ["Red Beret Cap", "Golden Antenna", "Mini Bamboo Copter"],
      fact: "Dorami Doraemon ki choti behen hai aur uske kaano ki jagah ek stylish red-yellow ribbon bow laga hai!"
    },
    {
      q: "Anywhere Door ka authentic Japanese anime naam kya hai?",
      correct: "Dokodemo Door (どこでもドア)",
      wrong: ["Take-Copter", "Anki-Pan", "Moshi-Moshi Box"],
      fact: "Dokodemo Door 10 light years ke radius me universe me kisi bhi location par 1 second me teleport karta hai!"
    },
    {
      q: "Shinchan ke cute white pet dog ka kya naam hai?",
      correct: "Shiro (シロ)",
      wrong: ["Kuro", "Pochi", "Tama"],
      fact: "Shiro ek super-smart white fluffy dog hai jo Shinchan ke ghar ka sabse sensible member maana jata hai!"
    },
    {
      q: "Pokemon anime me Ash Ketchum ka pehla Starter Pokemon kaunsa tha?",
      correct: "Pikachu ⚡",
      wrong: ["Charmander 🔥", "Squirtle 💧", "Bulbasaur 🍃"],
      fact: "Ash late utha tha isliye use Professor Oak ke paas bacha hua stubborn Pikachu mila jo uska lifelong best buddy bana!"
    },
    {
      q: "Dragon Ball Z me Goku ki signature energy attack wave ka kya naam hai?",
      correct: "Kamehameha! 💥",
      wrong: ["Rasengan", "Spirit Gun", "Final Flash"],
      fact: "Master Roshi ne Kamehameha invent kiya tha jise Goku ne pehli hi baar dekh kar master kar liya tha!"
    },
    {
      q: "Ninja Hattori ka signature dialogue aur catchphrase kya hai?",
      correct: "Nin Nin! (निन निन!)",
      wrong: ["Dattebayo!", "Pika Pika!", "Moshi Moshi!"],
      fact: "Kanzo Hattori Iga Ninja clan ka prodigy hai jo har task complete karke 'Nin Nin' bolta hai!"
    },
    {
      q: "Beyblade original anime me Tyson Granger ke Bit-Beast ka kya naam tha?",
      correct: "Dragoon 🐉",
      wrong: ["Dranzer 🦅", "Driger 🐯", "Draciel 🐢"],
      fact: "Tyson ka Dragoon storm power air bit-beast hai jo Bladebreakers ka team captain bit-beast tha!"
    },
    {
      q: "Death Note anime me Shinigami Ryuk ko human world ki kaunsi cheez sabse zyada pasand hai?",
      correct: "Juicy Red Apples 🍎",
      wrong: ["Chocolate Bars", "Dorayaki", "Pizza"],
      fact: "Ryuk kehta hai ki human world ke apples Shinigami realm ke sukhe apples se 100 guna zyada juicy hote hain!"
    },
    {
      q: "Kochikame anime ke hilarious police inspector lead character ka kya naam hai?",
      correct: "Kankichi Ryotsu 👮",
      wrong: ["Nakagawa", "Reiko", "Ohara"],
      fact: "Ryotsu Kameari police station ka multi-talented lekin get-rich-quick schemes me fasne wala comedy icon inspector hai!"
    },
    {
      q: "Doraemon ke Bamboo-Copter (Take-Copter) ki maximum battery flight speed kitni hoti hai?",
      correct: "80 km/h (Continuous 8 Hours Flight)",
      wrong: ["300 km/h", "20 km/h", "Unlimited Speed"],
      fact: "Take-Copter maximum 80 km/h ki speed se 8 ghante lagataar ud sakta hai jiske baad battery recharge karni padti hai!"
    },
    {
      q: "Naruto anime me Hidden Leaf Village ke Ninja Chief ko kya kehte hain?",
      correct: "Hokage (火影)",
      wrong: ["Kazekage", "Mizukage", "Raikage"],
      fact: "Hokage Konohagakure village ka supreme leader aur protector hota hai!"
    },
    {
      q: "Doraemon anime me Gian ka original Japanese naam kya hai?",
      correct: "Takeshi Goda (剛田 武)",
      wrong: ["Suneo Honekawa", "Hidetoshi Dekisugi", "Nobisuke Nobi"],
      fact: "Gian ka real naam Takeshi Goda hai, aur uski choti behen ka naam Jaiko Goda hai!"
    }
  ],
  logic: [
    {
      q: "What has keys but can't open locks, has space but no rooms, and allows you to enter but not exit?",
      correct: "A Computer Keyboard ⌨️",
      wrong: ["A Grand Piano", "A Magic Door", "A Space Shuttle"],
      fact: "Keyboard me character keys, Spacebar, aur Enter key hoti hai lekin koi door nahi hota!"
    },
    {
      q: "Nobita takes 10 minutes to walk to school. If he doubles his speed, how long does he take?",
      correct: "5 Minutes",
      wrong: ["20 Minutes", "10 Minutes", "0 Minutes"],
      fact: "Speed double karne par distance cover karne ka time exact aadha (10 / 2 = 5 min) ho jata hai!"
    },
    {
      q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      correct: "An Echo 🗣️",
      wrong: ["A Cloud", "A Take-Copter", "A Shadow"],
      fact: "Echo soundwave vibration ki wajah se hawa aur pahado me goonjti hai bina kisi physical body ke!"
    },
    {
      q: "What can travel around the world while staying in a single corner?",
      correct: "A Postage Stamp ✉️",
      wrong: ["Anywhere Door", "An Airplane Pilot", "A Magnetic Compass"],
      fact: "Postage stamp envelope ke ek corner par chipka rehta hai aur pure worldwide deliver hota hai!"
    },
    {
      q: "If you have 3 Dorayakis and you take away 2, how many Dorayakis do YOU have?",
      correct: "2 Dorayakis (The ones you took!)",
      wrong: ["1 Dorayaki", "0 Dorayakis", "3 Dorayakis"],
      fact: "Lateral thinking trick! Kyunki aapne 2 Dorayaki uthaye hain, isliye aapke haath me 2 Dorayaki hain!"
    },
    {
      q: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      correct: "$0.05 (5 Cents)",
      wrong: ["$0.10 (10 Cents)", "$0.01 (1 Cent)", "$0.00"],
      fact: "Math logic: Ball = $0.05, Bat = $1.05. Total = $1.05 + $0.05 = $1.10!"
    },
    {
      q: "What gets wetter the more it dries?",
      correct: "A Bath Towel 🛁",
      wrong: ["A Sponge", "The Sun", "A Hairdryer"],
      fact: "Towel jitna zyada dusri cheezon ko dry karta hai, utna hi zyada khud paani absorb karke wet ho jata hai!"
    },
    {
      q: "If an electric train is traveling North at 100 km/h and the wind is blowing West at 20 km/h, which way does the smoke blow?",
      correct: "No Smoke (Electric trains have no smoke!) 🚆⚡",
      wrong: ["South-West", "East", "West"],
      fact: "Electric train electricity par chalti hai, isme se koi dhuwa (smoke) nahi nikalta!"
    },
    {
      q: "Forward I am heavy, but backward I am NOT. What am I?",
      correct: "The word 'TON' ⚖️",
      wrong: ["A Lead Weight", "An Elephant", "An Anchor"],
      fact: "The word 'TON' forward padhne par heavy weight hai, backward spell karne par 'NOT' ban jata hai!"
    },
    {
      q: "How many months in a year have 28 days?",
      correct: "All 12 Months! 🗓️",
      wrong: ["Only 1 (February)", "Only Leap Years", "6 Months"],
      fact: "Saal ke sabhi 12 months me kam se kam 28 days toh hote hi hain!"
    },
    {
      q: "What has a head and a tail but no body?",
      correct: "A Coin 🪙",
      wrong: ["A Snake", "A Kite", "A Needle"],
      fact: "Coin (sikka) ke paas Heads aur Tails do sides hote hain lekin koi torso body nahi hoti!"
    },
    {
      q: "What can you catch but not throw?",
      correct: "A Cold / Sneeze 🤧",
      wrong: ["A Dorayaki", "A Baseball", "A Frisbee"],
      fact: "You 'catch a cold', lekin aap sardi ko physical ball ki tarah phek nahi sakte!"
    },
    {
      q: "The person who makes it doesn't need it. The person who buys it doesn't use it. The person who uses it doesn't know it. What is it?",
      correct: "A Coffin ⚰️",
      wrong: ["A Baby Cradle", "A Diamond Ring", "A Smartphone"],
      fact: "Classic mystery riddle! Coffin bananey wala use nahi karta, khareedne wala use nahi karta, aur jo use karta hai wo unconscious/deceased hota hai."
    },
    {
      q: "Which word in the dictionary is spelled incorrectly?",
      correct: "The word 'Incorrectly' 📖",
      wrong: ["Supercalifragilistic", "Pneumonoultramicroscopicsilicovolcanoconiosis", "Misspelled"],
      fact: "Dictionary me 'Incorrectly' word ko 'I-n-c-o-r-r-e-c-t-l-y' hi spell kiya jata hai!"
    },
    {
      q: "What belongs to you, but everyone else uses it much more than you do?",
      correct: "Your Name 🏷️",
      wrong: ["Your Smartphone", "Your Money", "Your Shoes"],
      fact: "Aapka naam aapka hai, lekin dusre log aapko bulane ke liye use aapse 100 guna zyada use karte hain!"
    }
  ],
  commerce: [
    {
      q: "If you invest in a stock and it drops by 50%, what percentage gain is required just to break even?",
      correct: "+100% Gain 📈",
      wrong: ["+50% Gain", "+75% Gain", "+200% Gain"],
      fact: "Agar $100 ka stock $50 (-50%) ho jaye, toh $50 se wapas $100 aane ke liye 100% profit ($50 on $50) banana padta hai!"
    },
    {
      q: "Personal finance me 'Rule of 72' kis calculation ke liye use hota hai?",
      correct: "Estimating years to double your money 💰",
      wrong: ["Calculating Income Tax brackets", "Retirement pension age", "Credit card score formula"],
      fact: "72 ko annual interest rate se divide karke pata lagta hai ki aapka paisa kitne saal me double ho jayega (e.g. 72 / 12% = 6 years)!"
    },
    {
      q: "Accounting me 'Accounts Payable' balance sheet me kis category me aata hai?",
      correct: "Current Liabilities (देनदारियां)",
      wrong: ["Current Assets", "Fixed Assets", "Owner's Equity"],
      fact: "Accounts Payable short-term company debts hote hain jo suppliers ko unke goods/services ke badle chukane hote hain!"
    },
    {
      q: "Machinery aur laptops ki value time ke sath ghisne/wear-and-tear se kam hone ko kya kehte hain?",
      correct: "Depreciation (मूल्यह्रास) 📉",
      wrong: ["Appreciation", "Inflation", "Amortization"],
      fact: "Depreciation accounting entry physical assets ki wear and tear aur technology purani hone par book value ghatata hai!"
    },
    {
      q: "Agar inflation rate 8% hai aur bank savings account 3% interest de raha hai, toh real return kya hai?",
      correct: "-5% Real Loss of Purchasing Power 📉",
      wrong: ["+5% Profit", "+11% Gain", "0% No Change"],
      fact: "Real Return = Interest (3%) - Inflation (8%) = -5%. Paisa bank me pade-pade har saal 5% value kho raha hai!"
    },
    {
      q: "Stock Market me 'BULL Market' aur 'BEAR Market' ka kya matlab hota hai?",
      correct: "Bull = Rising Prices 🐂 | Bear = Falling Prices 🐻",
      wrong: ["Bull = Tech Stocks | Bear = Real Estate", "Bull = High Tax | Bear = Low Tax", "Bull = Losses | Bear = Profits"],
      fact: "Bull apne horns se upar attack karta hai (Rising Market), jabki Bear apne panje se niche swipe karta hai (Falling Market)!"
    },
    {
      q: "Economics me 'Opportunity Cost' ka kya arth hota hai?",
      correct: "The value of the next best alternative given up 🎯",
      wrong: ["The actual monetary price paid", "Government subsidy discount", "Stock brokerage fee"],
      fact: "Ek option choose karne ke chakkar me jo doosra best fayda aapne chhod diya, wahi Opportunity Cost kehlata hai!"
    },
    {
      q: "Warren Buffett ka famous Rule No. 1 of Investing kya hai?",
      correct: "Never Lose Money 🛡️",
      wrong: ["Always Buy Tech Stocks", "Take Maximum Risk", "Trade Every Day"],
      fact: "Warren Buffett's Rule #1: 'Never lose money.' Rule #2: 'Never forget rule No. 1!'"
    },
    {
      q: "Company ke Total Revenue me se Cost of Goods Sold (COGS) minus karne par kya milta hai?",
      correct: "Gross Profit (सकल लाभ) 💵",
      wrong: ["Net Profit After Tax", "Operating Cash Flow", "EBITDA"],
      fact: "Revenue - Direct Production Cost = Gross Profit. Isme se operating expenses minus karne par Net Profit banta hai!"
    },
    {
      q: "Personal finance me 'Emergency Fund' me kam se kam kitne mahino ka kharcha rakhna chahiye?",
      correct: "3 to 6 Months of Living Expenses 🏦",
      wrong: ["1 Week", "10 Years", "50 Years"],
      fact: "Financial planners recommend karte hain ki job loss ya medical emergency ke liye 3-6 months ka liquid cash backup zaroor ho!"
    },
    {
      q: "World me sabse zyada widely traded fiat currency kaunsi hai?",
      correct: "US Dollar (USD - $) 💵",
      wrong: ["Euro (EUR - €)", "Japanese Yen (JPY - ¥)", "British Pound (GBP - £)"],
      fact: "US Dollar global foreign exchange transactions ke lagbhag 88% hisse me shamil rehta hai!"
    },
    {
      q: "Compounding Interest ko kis scientist ne 'Eighth Wonder of the World' kaha tha?",
      correct: "Albert Einstein 🧠",
      wrong: ["Isaac Newton", "Adam Smith", "Thomas Edison"],
      fact: "Einstein's quote: 'Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it!'"
    },
    {
      q: "Business me 'B2B' aur 'B2C' ka full form kya hota hai?",
      correct: "Business-to-Business & Business-to-Consumer 🤝",
      wrong: ["Brand-to-Buyer & Bank-to-Customer", "Buy-to-Build & Build-to-Cash", "Back-to-Base & Base-to-Client"],
      fact: "B2B companies doosri businesses ko bechti hain, jabki B2C direct end consumers/public ko sell karti hain!"
    },
    {
      q: "Stock market me 'Blue Chip Companies' kinhe kaha jata hai?",
      correct: "Large, financially stable, industry-leading giants 💎",
      wrong: ["Brand new penny startups", "Crypto meme tokens", "Bankrupt businesses"],
      fact: "Blue Chip naam poker game ki highest-value blue chips se aaya hai, jo reliable multinational corporate market leaders ko darshata hai!"
    },
    {
      q: "GST (Goods and Services Tax) kis type ka tax hota hai?",
      correct: "Indirect Consumption Tax (अप्रत्यक्ष कर) 🧾",
      wrong: ["Direct Income Tax", "Wealth Tax", "Property Capital Gains Tax"],
      fact: "GST ek indirect consumption-based destination tax hai jo goods aur services ke consumption par lagta hai!"
    }
  ]
};

const TRIVIA_STATE = {
  category: 'anime',
  queue: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  timer: 15,
  timerInterval: null
};

// Fisher-Yates Array Shuffler
function shuffleDeck(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function openTriviaModal() {
  document.getElementById('trivia-modal').classList.remove('hidden');
  audio.playBell();
  initTriviaQueue('anime');
}

function closeTriviaModal() {
  document.getElementById('trivia-modal').classList.add('hidden');
  clearInterval(TRIVIA_STATE.timerInterval);
}

function selectTriviaCategory(cat) {
  TRIVIA_STATE.category = cat;
  document.getElementById('tab-anime').classList.toggle('active', cat === 'anime');
  document.getElementById('tab-logic').classList.toggle('active', cat === 'logic');
  document.getElementById('tab-commerce').classList.toggle('active', cat === 'commerce');

  initTriviaQueue(cat);
}

function initTriviaQueue(cat) {
  const pool = TRIVIA_DATABASE[cat] || TRIVIA_DATABASE.anime;
  TRIVIA_STATE.queue = shuffleDeck(pool);
  TRIVIA_STATE.currentIndex = 0;
  loadTriviaQuestion();
}

function loadTriviaQuestion() {
  clearInterval(TRIVIA_STATE.timerInterval);
  document.getElementById('trivia-explanation').classList.add('hidden');

  // If entire pool finished, re-shuffle for endless non-repeating fun!
  if (TRIVIA_STATE.currentIndex >= TRIVIA_STATE.queue.length) {
    TRIVIA_STATE.queue = shuffleDeck(TRIVIA_DATABASE[TRIVIA_STATE.category]);
    TRIVIA_STATE.currentIndex = 0;
  }

  const q = TRIVIA_STATE.queue[TRIVIA_STATE.currentIndex];

  // Randomize the 4 options so correct answer is unpredictably distributed between A, B, C, D
  const allOpts = shuffleDeck([
    { text: q.correct, isCorrect: true },
    ...q.wrong.map(w => ({ text: w, isCorrect: false }))
  ]);

  const progress = `[Q: ${TRIVIA_STATE.currentIndex + 1}/${TRIVIA_STATE.queue.length}]`;
  document.getElementById('trivia-question-text').textContent = `${progress} ${q.q}`;
  document.getElementById('trivia-score').textContent = TRIVIA_STATE.score;
  document.getElementById('trivia-streak').textContent = `${TRIVIA_STATE.streak}x`;

  const container = document.getElementById('trivia-options-grid');
  container.innerHTML = '';

  allOpts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 't-option-btn';
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt.text}`;
    btn.onclick = () => handleTriviaAnswer(opt.isCorrect, q.fact, allOpts);
    container.appendChild(btn);
  });

  TRIVIA_STATE.timer = 15;
  document.getElementById('trivia-timer').textContent = '15s';

  TRIVIA_STATE.timerInterval = setInterval(() => {
    TRIVIA_STATE.timer--;
    document.getElementById('trivia-timer').textContent = `${TRIVIA_STATE.timer}s`;

    if (TRIVIA_STATE.timer <= 0) {
      clearInterval(TRIVIA_STATE.timerInterval);
      handleTriviaAnswer(false, q.fact, allOpts, true); // Timeout
    }
  }, 1000);
}

function handleTriviaAnswer(isCorrect, fact, allOpts, isTimeout = false) {
  clearInterval(TRIVIA_STATE.timerInterval);

  const container = document.getElementById('trivia-options-grid');
  const buttons = container.querySelectorAll('.t-option-btn');
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (allOpts[idx] && allOpts[idx].isCorrect) {
      b.classList.add('correct');
    }
  });

  const exp = document.getElementById('trivia-explanation');
  const verdict = document.getElementById('trivia-verdict');
  const factText = document.getElementById('trivia-fact');

  if (isCorrect) {
    audio.playPocketFanfare();
    TRIVIA_STATE.streak++;
    const pts = 50 + (TRIVIA_STATE.streak * 10);
    TRIVIA_STATE.score += pts;

    verdict.textContent = `Correct! +${pts} Points! 🎉`;
    verdict.className = 'verdict-tag win';
    increaseHappiness(15);
    spawnParticle('⭐', window.innerWidth / 2, window.innerHeight / 2);
  } else {
    audio.playHonk();
    TRIVIA_STATE.streak = 0;

    verdict.textContent = isTimeout ? 'Time Is Up! ⌛' : 'Oops! Incorrect! ❌';
    verdict.className = 'verdict-tag loss';
  }

  factText.textContent = fact;
  exp.classList.remove('hidden');

  document.getElementById('trivia-score').textContent = TRIVIA_STATE.score;
  document.getElementById('trivia-streak').textContent = `${TRIVIA_STATE.streak}x`;
}

function nextTriviaQuestion() {
  TRIVIA_STATE.currentIndex++;
  loadTriviaQuestion();
}

/* =========================================================
   ADULT FEATURES 4: 🎙️ VOICE COMMAND AI RECOGNITION
   ========================================================= */
const VOICE_STATE = {
  recognition: null,
  isListening: false
};

function toggleVoiceRecognition() {
  if (VOICE_STATE.isListening) {
    stopVoiceRecognition();
  } else {
    startVoiceRecognition();
  }
}

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition is not supported on this browser. Please use Google Chrome or Edge!");
    return;
  }

  VOICE_STATE.recognition = new SpeechRecognition();
  VOICE_STATE.recognition.lang = (PET_STATE.voiceLang === 'hi') ? 'hi-IN' : 'en-US';
  VOICE_STATE.recognition.interimResults = false;
  VOICE_STATE.recognition.maxAlternatives = 1;

  const toast = document.getElementById('voice-listening-toast');
  const btn = document.getElementById('voice-mic-btn');

  VOICE_STATE.recognition.onstart = () => {
    VOICE_STATE.isListening = true;
    if (toast) toast.classList.remove('hidden');
    if (btn) {
      btn.classList.add('listening');
      btn.querySelector('span').textContent = 'Listening...';
    }
    audio.playBell();
  };

  VOICE_STATE.recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.toLowerCase();
    console.log("Voice Transcript:", transcript);
    handleVoiceCommand(transcript);
    stopVoiceRecognition();
  };

  VOICE_STATE.recognition.onerror = (e) => {
    console.warn("Speech recognition error:", e);
    stopVoiceRecognition();
  };

  VOICE_STATE.recognition.onend = () => {
    stopVoiceRecognition();
  };

  try {
    VOICE_STATE.recognition.start();
  } catch (err) {
    console.warn("Recognition start err:", err);
  }
}

function stopVoiceRecognition() {
  VOICE_STATE.isListening = false;
  const toast = document.getElementById('voice-listening-toast');
  const btn = document.getElementById('voice-mic-btn');
  if (toast) toast.classList.add('hidden');
  if (btn) {
    btn.classList.remove('listening');
    btn.querySelector('span').textContent = 'Mic Talk';
  }
  if (VOICE_STATE.recognition) {
    try { VOICE_STATE.recognition.stop(); } catch(e){}
  }
}

function handleVoiceCommand(cmd) {
  console.log("Processing Voice Command:", cmd);

  if (cmd.includes('fly') || cmd.includes('udo') || cmd.includes('sky') || cmd.includes('udna') || cmd.includes('helicopter') || cmd.includes('copter')) {
    toggleTakeCopterFly();
  } else if (cmd.includes('dorayaki') || cmd.includes('khao') || cmd.includes('eat') || cmd.includes('feed') || cmd.includes('food') || cmd.includes('bhuk')) {
    feedDorayaki();
  } else if (cmd.includes('dance') || cmd.includes('song') || cmd.includes('gaana') || cmd.includes('music') || cmd.includes('party')) {
    triggerHappyDance();
  } else if (cmd.includes('mouse') || cmd.includes('chuha') || cmd.includes('ch चूहा') || cmd.includes('prank') || cmd.includes('darr')) {
    triggerMousePrank();
  } else if (cmd.includes('pocket') || cmd.includes('gadget') || cmd.includes('jhadu') || cmd.includes('magic')) {
    pullRandomGadget();
  } else if (cmd.includes('door') || cmd.includes('darwaza') || cmd.includes('anywhere') || cmd.includes('beach') || cmd.includes('space') || cmd.includes('room')) {
    openAnywhereDoorMenu();
  } else if (cmd.includes('trivia') || cmd.includes('quiz') || cmd.includes('question') || cmd.includes('sawal')) {
    openTriviaModal();
  } else if (cmd.includes('market') || cmd.includes('stock') || cmd.includes('share') || cmd.includes('crypto') || cmd.includes('paisa')) {
    openMarketModal();
  } else if (cmd.includes('time cloth') || cmd.includes('furoshiki') || cmd.includes('chadar') || cmd.includes('evolution')) {
    openTimeClothModal();
  } else if (cmd.includes('what if') || cmd.includes('phone') || cmd.includes('booth') || cmd.includes('moshi')) {
    openWhatIfModal();
  } else if (cmd.includes('photo') || cmd.includes('snap') || cmd.includes('camera') || cmd.includes('picture')) {
    openPhotoBoothModal();
  } else if (cmd.includes('dress') || cmd.includes('costume') || cmd.includes('hat') || cmd.includes('crown') || cmd.includes('kapde')) {
    openCostumeModal();
  } else if (cmd.includes('gian') || cmd.includes('concert') || cmd.includes('sing')) {
    startGianConcertGame();
  } else {
    // General friendly conversational reply
    const hi = `Maine suna: "${cmd}"! Chalo thoda Dorayaki khate hain ya dance karte hain!`;
    const en = `I heard: "${cmd}"! Let's eat some delicious Dorayaki or dance together!`;
    setDoraDialogue(hi, en, `「${cmd}」って言ったね！楽しく遊ぼう！`);
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
  }
}

/* =========================================================
   ADULT FEATURES 5: 📈 22ND-CENTURY STOCK & CRYPTO MARKET
   ========================================================= */
const MARKET_STATE = {
  cash: 1000,
  stocks: [
    { id: 'DORA', name: 'Dorayaki Central Reserve', symbol: '$DORA', price: 50.0, owned: 0, delta: +2.5, history: [] },
    { id: 'FLIGHT', name: 'Take-Copter Aero Logistics', symbol: '$FLIGHT', price: 120.0, owned: 0, delta: +5.8, history: [] },
    { id: 'DOOR', name: 'Anywhere Door Hyper-Warp Corp', symbol: '$DOOR', price: 340.0, owned: 0, delta: -1.2, history: [] },
    { id: 'NOBI', name: 'Nobita Nap Technologies AI', symbol: '$NOBI', price: 15.0, owned: 0, delta: +18.4, history: [] },
    { id: 'GIAN', name: 'Gian Loudspeaker Records (Meme)', symbol: '$GIAN', price: 85.0, owned: 0, delta: -12.6, history: [] }
  ],
  marketInterval: null
};

function openMarketModal() {
  document.getElementById('market-modal').classList.remove('hidden');
  audio.playBell();
  renderMarketUI();

  if (!MARKET_STATE.marketInterval) {
    MARKET_STATE.marketInterval = setInterval(updateMarketPrices, 2500);
  }
}

function closeMarketModal() {
  document.getElementById('market-modal').classList.add('hidden');
}

function renderMarketUI() {
  const container = document.getElementById('stocks-container');
  if (!container) return;
  container.innerHTML = '';

  let portfolioVal = 0;

  MARKET_STATE.stocks.forEach(stock => {
    const stockTotal = stock.owned * stock.price;
    portfolioVal += stockTotal;

    const card = document.createElement('div');
    card.className = 'stock-row-card';

    const isUp = stock.delta >= 0;
    const deltaClass = isUp ? 'up' : 'down';
    const deltaSign = isUp ? '▲ +' : '▼ ';

    card.innerHTML = `
      <div class="stock-info">
        <div>
          <span class="stock-symbol">${stock.symbol}</span>
          <span class="stock-name">${stock.name}</span>
        </div>
      </div>
      <div class="stock-price-col">
        <div class="stock-curr-price">${stock.price.toFixed(1)} 🪙</div>
        <div class="stock-delta ${deltaClass}">${deltaSign}${Math.abs(stock.delta).toFixed(1)}%</div>
      </div>
      <div style="text-align: center; font-size: 0.85rem;">
        <span style="color: #94a3b8;">Owned</span><br>
        <strong style="color: #f8fafc;">${stock.owned}</strong>
      </div>
      <div class="stock-actions">
        <button class="trade-btn trade-buy-btn" onclick="buyStock('${stock.id}', 1)">Buy 1</button>
        <button class="trade-btn trade-sell-btn" onclick="sellStock('${stock.id}', 1)">Sell 1</button>
      </div>
    `;

    container.appendChild(card);
  });

  const netWorth = MARKET_STATE.cash + portfolioVal;
  document.getElementById('market-cash-val').textContent = MARKET_STATE.cash.toLocaleString();
  document.getElementById('market-portfolio-val').textContent = portfolioVal.toFixed(0).toLocaleString();
  document.getElementById('market-networth-val').textContent = netWorth.toFixed(0).toLocaleString();
}

function updateMarketPrices() {
  MARKET_STATE.stocks.forEach(s => {
    // Random fluctuation percentage between -8% and +10%
    const change = (Math.random() * 18 - 8);
    s.delta = change;
    s.price = Math.max(1.0, +(s.price * (1 + change / 100)).toFixed(1));
  });

  // Only re-render if modal is currently visible
  if (!document.getElementById('market-modal').classList.contains('hidden')) {
    renderMarketUI();
  }
}

function buyStock(id, qty) {
  const stock = MARKET_STATE.stocks.find(s => s.id === id);
  if (!stock) return;

  const cost = stock.price * qty;
  if (MARKET_STATE.cash >= cost) {
    MARKET_STATE.cash -= cost;
    stock.owned += qty;
    audio.playPocketFanfare();
    renderMarketUI();
    spawnParticle('🪙', window.innerWidth / 2, window.innerHeight / 2);
  } else {
    audio.playHonk();
    alert("Insufficient $DORA Cash! Play Trivia or Catch Game to earn more coins!");
  }
}

function sellStock(id, qty) {
  const stock = MARKET_STATE.stocks.find(s => s.id === id);
  if (!stock || stock.owned < qty) {
    audio.playHonk();
    return;
  }

  const revenue = stock.price * qty;
  MARKET_STATE.cash += revenue;
  stock.owned -= qty;
  audio.playBell();
  renderMarketUI();
  spawnParticle('💰', window.innerWidth / 2, window.innerHeight / 2);
}

/* =========================================================
   ADULT FEATURES 6: ⏳ TIME CLOTH (TIME FUROSHIKI) LAB
   ========================================================= */
const TIMECLOTH_ITEMS = [
  {
    name: "0-Mark Exam Paper",
    icon: "📄",
    mode: "future",
    transIcon: "📜 🏆",
    title: "Valuation Unicorn Certificate!",
    desc: "Wrapped in Future Red Cloth ⏩: Nobita's zero-mark test paper transformed into a $10 Billion Silicon Valley Tech Founder Certificate!",
    hi: "Kamaal ho gaya! Time Cloth ne 0-mark test paper ko $10 Billion Founder Certificate me badal diya!",
    en: "Incredible! Time Cloth evolved the test paper into a $10B Unicorn Valuation Degree!"
  },
  {
    name: "Vintage Keypad Mobile",
    icon: "📱",
    mode: "future",
    transIcon: "🤖 🌐",
    title: "22nd-Cent Quantum Brain Hologram!",
    desc: "Wrapped in Future Red Cloth ⏩: Outdated 2005 phone evolved into a 6D Telepathic Quantum AI Matrix!",
    hi: "Purana keypad phone 22nd-century ke Quantum Holographic AI me evolve ho gaya!",
    en: "Old vintage mobile evolved into a 22nd-century Quantum Telepathic AI matrix!"
  },
  {
    name: "Ancient Dinosaur Bone Fossil",
    icon: "🦴",
    mode: "past",
    transIcon: "🦖 ✨",
    title: "Living Baby Pterodactyl Dinosaur!",
    desc: "Wrapped in Past Blue Cloth ⏪: 65,000,000-year-old fossil bone restored into a playful living baby dinosaur pet!",
    hi: "Time Cloth ke Blue Past wrap ne fossil bone ko zinda Baby Dinosaur pet me badal diya!",
    en: "Time Cloth rewound 65 million years to resurrect a cute living Baby Dinosaur pet!"
  },
  {
    name: "Burnt Hard Stale Dorayaki",
    icon: "🍘",
    mode: "past",
    transIcon: "🥞 🍯",
    title: "Fresh Gold-Glazed 3-Tier Dorayaki!",
    desc: "Wrapped in Past Blue Cloth ⏪: Burnt rock-hard pancake restored into steaming hot, honey-glazed gourmet Dorayaki!",
    hi: "Jala hua Dorayaki wapas taaza, hot aur honey-glazed gourmet Dorayaki ban gaya!",
    en: "Burnt stale pancake restored into warm, steaming, honey-glazed gourmet Dorayaki!"
  },
  {
    name: "Broken Mini Toy Car",
    icon: "🚗",
    mode: "future",
    transIcon: "🚀 ⚡",
    title: "Anti-Gravity Cyber-Hovercraft!",
    desc: "Wrapped in Future Red Cloth ⏩: Suneo's broken plastic toy evolved into a Mach-5 anti-gravity cybernetic hyper-car!",
    hi: "Tooti hui toy car Mach-5 Anti-Gravity Cyber Hovercraft me badal gayi!",
    en: "Broken plastic toy evolved into a real Mach-5 anti-gravity flying cybercar!"
  }
];

function openTimeClothModal() {
  document.getElementById('timecloth-modal').classList.remove('hidden');
  audio.playBell();
  renderTimeClothItems();
  resetEvolutionLab();
}

function closeTimeClothModal() {
  document.getElementById('timecloth-modal').classList.add('hidden');
}

function renderTimeClothItems() {
  const grid = document.getElementById('timecloth-items-grid');
  if (!grid) return;
  grid.innerHTML = '';

  TIMECLOTH_ITEMS.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'evolution-item-card';
    const modeTag = item.mode === 'future' ? '⏩ Future Wrap' : '⏪ Past Rewind';

    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="evo-icon">${item.icon}</span>
        <div class="evo-details">
          <strong>${item.name}</strong>
          <small>${item.title}</small>
        </div>
      </div>
      <span class="evo-btn-tag">${modeTag}</span>
    `;

    card.onclick = () => runTimeClothEvolution(idx);
    grid.appendChild(card);
  });
}

function runTimeClothEvolution(idx) {
  const item = TIMECLOTH_ITEMS[idx];
  const chamber = document.getElementById('evolution-chamber');
  const result = document.getElementById('chamber-result');
  const itemIcon = document.getElementById('chamber-item-icon');

  chamber.classList.remove('hidden');
  result.classList.add('hidden');
  itemIcon.textContent = item.icon;

  audio.playWarpPortal();
  setDoraExpression('squint');

  setTimeout(() => {
    audio.playPocketFanfare();
    result.classList.remove('hidden');
    document.getElementById('chamber-result-title').textContent = item.title;
    document.getElementById('chamber-transformed-icon').textContent = item.transIcon;
    document.getElementById('chamber-result-desc').textContent = item.desc;

    setDoraDialogue(item.hi, item.en, "タイムふろしき！大成功だ！");
    speakDoraemon(PET_STATE.voiceLang === 'hi' ? item.hi : item.en);
    increaseHappiness(25);
    spawnParticle('⏳', window.innerWidth / 2, window.innerHeight / 2);
  }, 1400);
}

function resetEvolutionLab() {
  document.getElementById('evolution-chamber').classList.add('hidden');
}

/* =========================================================
   ADULT FEATURES 7: 📸 22ND-CENTURY POLAROID PHOTO BOOTH
   ========================================================= */
function openPhotoBoothModal() {
  document.getElementById('photobooth-modal').classList.remove('hidden');
  audio.playBell();
  snapNewPhoto();
}

function closePhotoBoothModal() {
  document.getElementById('photobooth-modal').classList.add('hidden');
}

function snapNewPhoto() {
  audio.playBell();
  const avatar = document.getElementById('polaroid-dora-avatar');
  const bg = document.getElementById('polaroid-scene-bg');
  const dateTag = document.getElementById('polaroid-date');

  const expressions = ['🐱✨', '🐱🕶️', '🐱👑', '🐱🎩', '🐱💖', '🐱🍘'];
  avatar.textContent = expressions[Math.floor(Math.random() * expressions.length)];

  const now = new Date();
  dateTag.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  spawnParticle('📸', window.innerWidth / 2, window.innerHeight / 2);
}

function downloadPolaroidPhoto() {
  audio.playPocketFanfare();

  // Create an offscreen HTML5 Canvas to render the authentic Polaroid Souvenir
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  // 1. Polaroid White Paper Border
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 720);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 600, 720);

  // 2. Photo Scene Area
  const grad = ctx.createLinearGradient(0, 30, 600, 520);
  grad.addColorStop(0, '#38bdf8');
  grad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grad;
  ctx.fillRect(30, 30, 540, 500);

  // 3. Cute Doraemon Character & Sparkles
  ctx.font = '110px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐱✨', 300, 260);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('⭐ Best Buddies in 2112 ⭐', 300, 440);

  // 4. Handwritten Polaroid Caption
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('My Virtual Doraemon 🐱❤️', 300, 590);

  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#64748b';
  const nowStr = new Date().toDateString();
  ctx.fillText(`Tokyo 2112 Souvenir • ${nowStr}`, 300, 640);

  // 5. Trigger download
  const link = document.createElement('a');
  link.download = 'My_Virtual_Doraemon_Polaroid.png';
  link.href = canvas.toDataURL('image/png');
  link.click();

  const hi = "Photo download ho gayi! Ek yaadgaar souvenir photo aapke paas hai!";
  const en = "Photo downloaded! You now have a precious souvenir Polaroid photo!";
  setDoraDialogue(hi, en, "記念写真が保存されたよ！");
  speakDoraemon(PET_STATE.voiceLang === 'hi' ? hi : en);
}



