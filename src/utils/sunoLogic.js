import { ARTIST_BYPASS } from '../data/options.js';

// ==========================================
// SUNO V5 LOGIC CORE (V6 - V5 COMPLIANT)
// ==========================================

// SUNO V5 SPAM WORDS - Must be removed
const JUNK_TOKENS = [
  "good", "nice", "beautiful", "amazing", "cool", "best", "perfect",
  "masterpiece", "trending", "stunning", "great", "polished", "high quality",
  "radio-ready", "mastered for radio", "high fidelity", "2026 production",
  "polished pop vocals", "autotuned", "no adlibs", "no vocal runs",
  "no vibrato", "no electronic elements", "no bollywood", "no pop", "no ghazal",
  "raw and steady", "clean vocal", "straightforward folk vocals"
];

// SUNO V5 PLURAL → SINGULAR MAPPINGS
const PLURAL_TO_SINGULAR = {
  "Male Vocals": "Male vocal",
  "Female Vocals": "Female vocal",
  "Electric Oud Riffs": "Electric Oud riff",
  "Electric Oud riff": "Electric Oud riff",
  "String Sections": "String section",
  "Orchestral Strings": "Orchestral string",
  "String section": "String section",
  "808 Bass": "808 bass",
  "808 bass": "808 bass",
  "War Drums": "War Drum",
  "War Drum": "War Drum",
  "hi-hats": "hi-hat",
  "Hi-Hats": "hi-hat",
  "Vocal Harmonies": "Vocal harmony",
  "Synth Strings": "Synth string",
  "Synth string": "Synth string",
  "Guitar Solos": "Guitar Solo",
  "Guitar Solo": "Guitar Solo",
  "Bass Guitar": "Bass Guitar",
  "Heavy Bass": "Heavy bass",
  "Heavy bass": "Heavy bass",
  "Hi-Hat": "hi-hat",
  "Synths": "Synth",
  "Analog Synths": "Analog Synth",
  "Distorted Bass": "Distorted bass",
  "Electric Guitars": "Electric Guitar",
  "Drums": "Drum",
  "Hi-hat": "hi-hat",
  "Slap Bass": "Slap bass",
  "Clean Bass": "Clean bass",
  "Melodic Bass": "Melodic bass",
  "Deep Bass": "Deep bass",
  "Sub Bass": "Sub bass",
  "Sub-bass": "Sub bass",
  "Mijwiz riffs": "Mijwiz riff",
  "Mijwiz riff": "Mijwiz riff",
  "Darbuka Rolls": "Darbuka roll",
  "Darbuka roll": "Darbuka roll",
  "Fast Darbuka": "Fast Darbuka",
  "Tar strikes": "Tar strike",
  "Tar strike": "Tar strike",
  "Rhythmic Hand-claps": "Rhythmic Hand-claps",
  "Hand-claps": "Hand-claps",
  "Hand Claps": "Hand Claps",
  "Vocal chops": "Vocal chop",
  "Vocal Chops": "Vocal Chop",
  "Electric Guitar riffs": "Electric Guitar riff",
  "Guitar riffs": "Guitar riff",
  "Saxophone solos": "Saxophone Solo",
  "Saxophone solo": "Saxophone Solo",
  "String solos": "String Solo",
  "String Solo": "String Solo",
  "Congo rolls": "Congo roll",
  "Congo roll": "Congo roll",
  "Congas": "Conga",
  "Tremolos": "Tremolo",
  "Qanoon Tremolos": "Qanoon Tremolo",
  "Mirwas accents": "Mirwas accent",
  "Mirwas accent": "Mirwas accent",
  "BPM": "BPM",
  "Accents": "Accent",
  "Rhythms": "Rhythm",
  "Melodies": "Melody",
  "Riffs": "Riff",
  "Basslines": "Bassline",
  "Bassline": "Bassline",
  "Ensembles": "Ensemble",
  "Sections": "Section"
};

// SUNO V5 GENRE KNOWLEDGE BASE (Corrected - Singular instruments)
const GENRE_KNOWLEDGE = {
  "ghazal": {
    moods: ["Intimate", "Soulful", "Romantic", "Melancholic", "Poetic", "Breezy", "Indie-Fusion"],
    instruments: ["Harmonium", "Tabla", "Sarangi", "Acoustic Guitar", "Violin", "London Rain FX", "Matka (Clay Pot)", "Funky Electric bass"],
    leadInstruments: ["Sarangi", "Harmonium", "Violin", "Acoustic Guitar", "Clean Electric Guitar", "Piano"],
    vocals: ["Velvety vocal", "Urdu Poetry Delivery", "Emotive Vocal Performance", "Soft & Breathy", "Male and Female Duet"],
    bpmRange: [60, 102],
    structureType: "ghazal"
  },
  "qawwali": {
    moods: ["Spiritual", "High-Energy", "Trance-inducing", "Devotional", "Ecstatic", "Raw", "Punjabi"],
    instruments: ["Aggressive Harmonium", "Fast Tabla", "Rhythmic Hand-claps", "Dholak", "Indian Banjo (Bulbul Tarang)"],
    leadInstruments: ["Harmonium", "Vocal Improvisation", "Tabla", "Indian Banjo"],
    vocals: ["Ensemble Chorus", "Sufi Chanting", "Powerful Lead Vocals", "Antiphonal Call-and-Response", "Group Shout"],
    bpmRange: [105, 165],
    structureType: "qawwali"
  },
  "dabke": {
    moods: ["Celebratory", "High-Energy", "Danceable", "Festive", "Powerful", "Urban Beirut", "Mijwiz-heavy"],
    instruments: ["Mijwiz (Reed Flute)", "Zurna (Shawm)", "Davul (Deep Drum)", "Electric Oud", "Synth bass", "Darbuka", "Synth string", "Zaghrouta FX"],
    leadInstruments: ["Mijwiz (Reed Flute)", "Zurna", "Electric Oud", "Nay", "Arghul (Reed)", "Rababa", "Accordion"],
    vocals: ["Powerful vocal", "Group Chants", "Zaghrouta (Ululation)", "High-Energy Delivery", "Melismatic"],
    bpmRange: [115, 130],
    structureType: "dance"
  },
  "khaleeji": {
    moods: ["Rhythmic", "Romantic", "Warm", "Groovy", "Khabbaiti (6/8)", "Dosari", "Gulf Pop", "Samri"],
    instruments: ["Oud", "Qanoon", "Ney Flute", "Middle Eastern string", "Frame Drum (Daf)", "Rhythmic Hand-claps", "Accordion", "Synth Keyboard", "Electric Oud", "808 Sub-bass"],
    leadInstruments: ["Oud", "Violin", "Qanoon", "Ney Flute", "Accordion", "Synthesizer", "Mizmar", "Rababa", "Electric Guitar", "Cello"],
    vocals: ["Saudi Dialect Delivery", "Warm vocal", "Melismatic Style", "Emotive Performance", "Bedouin accent", "Group Clapping"],
    bpmRange: [80, 112],
    structureType: "pop"
  },
  "maghreb": {
    moods: ["Funky", "Urban", "Celebratory", "Hypnotic", "Gnawa-Fusion", "Rai Pop"],
    instruments: ["Electric Oud", "Bendir", "Darbuka", "Taarija", "Accordion", "808 bass", "Guembri (bass)", "Iron Castanets (Qraqeb)", "Synth Lead", "Mizmar"],
    leadInstruments: ["Electric Oud", "Accordion", "Ghaita (Oboe)", "Loutar", "Guembri", "Synthesizer"],
    vocals: ["Autotuned Oran vocal", "Rai Hook", "Group Chanting", "Rap Flow", "Cheb Style"],
    bpmRange: [105, 145],
    structureType: "dance"
  },
  "latin": {
    moods: ["Passionate", "Fiery", "Groovy", "Summer", "Danceable", "Psychedelic"],
    instruments: ["Nylon String Guitar", "Conga", "Timbales", "Hammond B3 Organ", "Brass Section", "Guiro", "Hand Claps", "Singing Electric Guitar (Sustain)"],
    leadInstruments: ["Overdriven Electric Guitar (Santana Style)", "Nylon String Guitar", "Trumpet", "Hammond B3 Organ"],
    vocals: ["Passionate vocal", "Group Chorus", "Staccato Delivery", "Soulful Male"],
    bpmRange: [110, 128],
    structureType: "standard"
  },
  "drill": {
    moods: ["Dark", "Aggressive", "Cinematic", "Urban", "Gritty"],
    instruments: ["Stuttering hi-hat", "Aggressive 808 Slides", "Dark Cinematic string", "Bell Melody", "Deep Kick"],
    leadInstruments: ["Filtered Synth", "Dark Piano", "Distorted 808"],
    vocals: ["Aggressive Flow", "Autotuned Ad-libs", "Fast Paced"],
    bpmRange: [135, 145],
    structureType: "electronic"
  },
  "afrobeat": {
    moods: ["Groovy", "Chill", "Summer", "Infectious", "Danceable", "Mid-African", "Polyrhythmic"],
    instruments: ["Slap bass", "High-Life Guitar", "Shaker", "Talking Drum", "Log Drum", "Brass Section", "Kalimba", "Balafon"],
    leadInstruments: ["Saxophone", "High-Life Guitar", "Synth Solo", "Brass Section", "Kalimba"],
    vocals: ["Relaxed Delivery", "Catchy Chorus", "Multi-layered Harmony", "Chanting"],
    bpmRange: [100, 118],
    structureType: "pop"
  },
  "ottoman": {
    moods: ["Majestic", "Classical", "Melancholic", "Grand", "Traditional"],
    instruments: ["Acoustic Qanoon", "Ney Flute", "Oud", "Tanbur (Lute)", "Kemençe (Violin)", "Bendir", "Kudum"],
    leadInstruments: ["Qanoon", "Ney", "Tanbur", "Kemençe", "Oud"],
    vocals: ["Classical Choire", "Melismatic Solo", "Muwashah Style"],
    bpmRange: [70, 90],
    structureType: "ghazal"
  },
  "techno": {
    moods: ["Hypnotic", "Dark", "Industrial", "Driving", "Futuristic", "Cyberpunk", "Neon"],
    instruments: ["909 Kick", "Acid bass", "Modular Synths", "hi-hat", "Arpeggiators", "Glitch Textures"],
    leadInstruments: ["Acid 303 Line", "Modular Synth", "Sawtooth Lead", "Distorted bass"],
    vocals: ["Minimalist Chants", "Spoken Word", "Processed Vocals", "No Vocals", "Robotic"],
    bpmRange: [124, 140],
    structureType: "electronic"
  },
  "rock": {
    moods: ["Aggressive", "Anthemic", "Gritty", "Powerful", "Rebellious", "Stadium"],
    instruments: ["Distorted Electric Guitar", "Bass Guitar", "Drum Kit", "Overdrive", "Crash Cymbals"],
    leadInstruments: ["Electric Guitar", "Distorted Guitar", "Bass Guitar"],
    vocals: ["Gritty vocal", "Power Ballad Style", "Screamed Accents", "Raw Emotion"],
    bpmRange: [110, 150],
    structureType: "standard"
  },
  "synthwave": {
    moods: ["Nostalgic", "Neon", "Cinematic", "Retro-Future", "Dreamy"],
    instruments: ["Analog Synth", "Drum Machine", "Arpeggiators", "Gated Reverb Snare", "DX7 Keys"],
    leadInstruments: ["Analog Synth", "Keytar", "Saxophone", "Electric Guitar"],
    vocals: ["Processed Vocals", "Robotic", "Reverb-heavy", "Dreamy Delivery"],
    bpmRange: [100, 120],
    structureType: "electronic"
  },
  "orchestral": {
    moods: ["Heroic", "Triumphant", "Majestic", "Military", "Epic", "Patriotic", "Cinematic"],
    instruments: ["Marching Snare", "Heavy Bass Drum", "Marching Toms", "Timpani", "Brass Section", "Tuba", "French Horn", "Woodwinds", "Violin Section"],
    leadInstruments: ["Trumpet", "French Horn", "Flute", "Piccolo", "Brass Section", "Solo Violin", "Cello"],
    vocals: ["Choir Ensemble", "Group Chant", "Strong Vocal Projection", "No Vocals (Instrumental)"],
    bpmRange: [108, 120],
    structureType: "march"
  },
  "country": {
    moods: ["Storytelling", "Heartfelt", "Sincere", "Acoustic", "Nostalgic"],
    instruments: ["Acoustic Guitar", "Pedal Steel", "Fiddle", "Banjo", "Brush Drums", "Upright Bass"],
    leadInstruments: ["Fiddle", "Pedal Steel", "Harmonica", "Acoustic Guitar"],
    vocals: ["Twangy Vocals", "Deep Baritone", "Storyteller Style"],
    bpmRange: [70, 110],
    structureType: "standard"
  },
  "turkish": {
    moods: ["Tragic", "Romantic", "Melancholic", "Longing", "Modern Arabesque", "Neo-Tarab"],
    instruments: ["Bowed string Section", "Emotional Accordion", "G-Clarinet", "Rhythmic Darbuka", "Violin Section", "Piano"],
    leadInstruments: ["Haunting Ney Flute", "Plucked Electric Oud", "G-Clarinet", "Emotional Accordion", "Electric Oud"],
    vocals: ["Emotive male vocal", "Heavy melisma", "Charismatic delivery", "Male and Female Duet"],
    bpmRange: [68, 85],
    structureType: "ghazal"
  },
  "farsi": {
    moods: ["Poetic", "Melancholic", "Sophisticated", "Romantic", "Modern Iranian Pop", "1970s Retro Drama", "Cinematic Exile", "Tehran Cosmopolitan", "Pastoral Folk", "Dastgah Classical", "Psychedelic Fusion"],
    instruments: ["Tar", "Setar", "Santur", "Kamancheh", "Piano", "Violin Section", "Tombak", "Cello", "Deep Melodic Electric bass", "Solo Flute", "Farfisa Organ", "Fuzzy Electric Guitar", "Dotar", "Dayereh"],
    leadInstruments: ["Tar", "Setar", "Santur", "Kamancheh", "Violin", "Piano", "Cello", "Deep Melodic Electric bass", "Farfisa Organ", "Dotar"],
    vocals: ["Classical Persian Vocals", "Tahrir (Vocal ornamentation)", "Soft Pop Dual Vocals", "Deep Emotive Female Mezzo", "Poetic Delivery", "Vintage Rasp", "Breathy Delivery", "Avaz-style Vocals"],
    bpmRange: [75, 115],
    structureType: "ghazal"
  },
  "afghan": {
    moods: ["Folk", "Nostalgic", "Rhythmic", "Traditional Kabul Style", "Happy", "Pashtun Folk", "Kabuli Classical", "Northern Folk", "Herati Style"],
    instruments: ["Afghan Rubab", "Harmonium", "Zerbaghali (Goblet Drum)", "Tabla", "Dambura", "Ghaychak (Bowed Fiddle)", "Tula (Wooden Flute)", "Dutar"],
    leadInstruments: ["Afghan Rubab", "Harmonium", "Dambura", "Ghaychak"],
    vocals: ["High-pitched vocals", "Passionate delivery", "Male and Female Duet"],
    bpmRange: [85, 145],
    structureType: "standard"
  },
  "pashto": {
    moods: ["Tribal", "High-Energy", "Attan Rhythm", "Folk", "Celebratory"],
    instruments: ["Pashto Rubab", "Dhol", "Harmonium", "High-pitched Flute", "Mangai (Pitcher)"],
    leadInstruments: ["Pashto Rubab", "High-pitched Flute", "Harmonium"],
    vocals: ["High-pitched female vocal", "Powerful male vocals", "Group Chants"],
    bpmRange: [95, 140],
    structureType: "dance"
  },
  "bollywood": {
    moods: ["Filmi", "Item Number", "Romantic Playback", "Sufi-Fusion", "Grand Orchestral", "Nostalgic 90s", "Desi Hip-Hop"],
    instruments: ["Cinematic string", "Dhol", "Tabla", "Synthesizer", "Harmonium", "Shehnai (Wedding Oboe)", "Electric Guitar", "Sarangi", "Bansuri (Flute)"],
    leadInstruments: ["Bansuri", "Sarangi", "Electric Guitar", "Synthesizer", "Violin Section"],
    vocals: ["Playback Singer", "Melismatic", "Shruti-bending", "High-Pitched Female", "Deep Male Baritone"],
    bpmRange: [90, 135],
    structureType: "standard"
  },
  "lebanese": {
    moods: ["Beirut Nightlife", "Romantic", "Sentimental", "High-Energy", "Nostalgic 90s", "Celebratory", "East-meets-West Fusion", "Clear Melodic"],
    instruments: ["Mijwiz (Reed Flute)", "Accordion", "Lush Synth-string", "Electronic Drums", "Darbuka Accents", "Vintage Synth-string", "Mijwiz-style synth"],
    leadInstruments: ["Accordion", "Mijwiz", "Synth-string"],
    vocals: ["Lebanese Dialect (Beirut Sound)", "Softer Pronunciation", "Clear Emotive Vocals", "Superstar Pop Style", "Romantic Persona"],
    bpmRange: [110, 125],
    structureType: "dance"
  }
};

const DEFAULT_TRAITS = {
  moods: ["Cinematic", "Atmospheric"],
  instruments: ["Piano", "Synth", "Drum Machine", "Strings"],
  leadInstruments: ["Piano", "Cello", "Violin", "Synth"],
  vocals: ["Clean vocal"],
  bpmRange: [90, 120],
  structureType: "standard"
};

// ==========================================
// SUNO V5 INSTRUMENT ADHERENCE ENGINE
// ==========================================

const InstrumentAdherence = {
  forceHeroInstrument: (instr) => `prominent ${instr}, ${instr}-led melodic theme`,
  
  generateSoloTag: (instr, desc = "Technical solo") => `[Extended ${instr} Solo | ${desc}]`,
  
  rhythmAnchor: (tag) => `${tag} . . ! !! . !`
};

// ==========================================
// REGIONAL IDENTITY ENGINES
// ==========================================

const AfghanIdentity = {
  forceRubab: () => "prominent Afghan Rubab, plucked mulberry wood lute, percussive strings",
  percussionLogic: (style) => style.includes("classical") || style.includes("kabuli") 
    ? "Afghan Tablah pair" 
    : "Zerbaghali goblet drum"
};

const LebaneseIdentity = {
  getAnchor: (input) => {
    const lower = input.toLowerCase();
    if (lower.includes("dabke")) return "Lebanese Dabke-Pop, Mijwiz lead, driving electronic beat, energetic clapping";
    if (lower.includes("ballad") || lower.includes("romantic")) return "Lebanese Pop Ballad, lush synth-string, melodic accordion, sentimental";
    if (lower.includes("90s") || lower.includes("vintage")) return "90s Lebanese Superstar style, catchy pop hooks";
    if (lower.includes("dialect") || lower.includes("beirut")) return "Lebanese dialect, Beirut articulation, clear emotive vocals";
    return "Lebanese Pop, Levantine musical profile, Bayati and Rast Maqams mixed with Western harmonies";
  },
  tashkeelHack: " [Pro-Hack: Use Tashkeel (diacritics) on Arabic text to lock in Beirut vowels]"
};

const PersianIdentity = {
  getAnchor: (input) => {
    const lower = input.toLowerCase();
    if (lower.includes("googoosh") || lower.includes("hejrat") || lower.includes("1970s") || lower.includes("varoujan")) {
      return "1970s Iranian Pop, Googoosh style, Varoujan-inspired orchestration, 82 BPM. Features a deep melodic electric bass and dramatic cinematic string section.";
    }
    if (lower.includes("classical") || lower.includes("dastgah") || lower.includes("avaz")) {
      return "Persian Traditional Classical, Dastgah system, soulful and spiritual. Features prominent Tar, Santur, and Kamancheh.";
    }
    if (lower.includes("folk") || lower.includes("pastoral")) {
      return "Local Iranian Folk music, pastoral atmosphere. Features Dotar and earthy percussion.";
    }
    return "Modern Iranian Pop, Tehran cosmopolitan style, melodic and atmospheric.";
  },
  natureMetaphor: " Poetic Persian lyrics, metaphors of nature, sea, and forest.",
  vocalTrick: (input) => {
    const lower = input.toLowerCase();
    if (lower.includes("classical") || lower.includes("avaz")) return "Authentic Avaz vocals, Classical Tahrir ornamentation.";
    if (lower.includes("googoosh") || lower.includes("1970s")) return "Emotive female vocals with a slight vintage rasp, breathy and intimate.";
    return "Authentic Farsi articulation, Tahrir technique, clear melodic delivery.";
  }
};

const UKGhazalIdentity = {
  getAnchor: () => "Authentic UK Studio Ghazal, Traditional Urdu Poetic Soul, 78 BPM. Features a deep emotive Sarangi melody and soft resonant Harmonium. Steady heartbeat Tabla rhythm with British-Asian studio production.",
  vibe: "Intimate and soulful atmospheric textures, subtle London rain field recordings, clean professional acoustic production."
};

// ==========================================
// SUNO V5 ORCHESTRA & BLEND LOGIC
// ==========================================

const OrchestraLogic = {
  hollywood: "Hollywood cinematic orchestra, lush string section, swept violins",
  bollywood: "Bollywood playback orchestra, melodic strings, dramatic ney flute, rhythmic dholak foundation",
  lush: "Lush strings only, slow attack, high sustain, ethereal orchestral pads"
};

const SoftBlendLogic = {
  bridgeKeywords: ["Atmospheric", "Lush", "Spacious", "Minimalist", "Soft pads", "Warm"],
  positiveBlend: ["Spacious", "Airy mix", "High clarity", "Gentle and smooth", "Warm saturation"],
  
  getGlobalSuffix: () => " Spacious, airy mix, high clarity, gentle and smooth.",
  
  applySafety: (style) => {
    const negatives = ["Distorted", "Heavy", "Aggressive", "Electronic Lead", "Hard", "Fast-paced"];
    let safeStyle = style;
    negatives.forEach(word => { 
      safeStyle = safeStyle.replace(new RegExp(`\\b${word}\\b`, 'gi'), ""); 
    });
    return safeStyle;
  }
};

// ==========================================
// SUNO V5 TEMPLATE ENGINE (V6)
// ==========================================

const TemplateEngine = {
  loadTemplates: () => {
    try {
      const templates = require('../data/templates.json');
      return templates;
    } catch (e) {
      console.error('Failed to load templates:', e);
      return [];
    }
  },

  fixPlurals: (text) => {
    let fixed = text;
    Object.entries(PLURAL_TO_SINGULAR).forEach(([plural, singular]) => {
      const regex = new RegExp(`\\b${plural}\\b`, 'gi');
      fixed = fixed.replace(regex, singular);
    });
    return fixed;
  },

  removeSpam: (text) => {
    let clean = text;
    JUNK_TOKENS.forEach(token => {
      const regex = new RegExp(`\\b${token}\\b`, 'gi');
      clean = clean.replace(regex, "");
    });
    clean = clean.replace(/,\s*,/g, ",").replace(/^\s*,\s*/, "").replace(/\s*,\s*$/, "").trim();
    return clean;
  },

  fixBPMFormat: (bpm) => {
    const num = parseInt(bpm);
    return isNaN(num) ? bpm : `${num} BPM`;
  },

  enforceExtendedSolo: (structure) => {
    return structure.replace(/\[(Extended )?([\w\s]+) Solo\]/gi, (match, extended, instrument) => {
      if (extended) return match;
      return `[Extended ${instrument.trim()} Solo]`;
    });
  },

  validateAndFix: (template) => {
    return {
      ...template,
      style: TemplateEngine.removeSpam(TemplateEngine.fixPlurals(template.style || "")),
      bpm: TemplateEngine.fixBPMFormat(template.bpm || "120"),
      structure: TemplateEngine.enforceExtendedSolo(template.structure || "")
    };
  },

  topLoadStyle: (style, bpm) => {
    const genre = style.split(",")[0].trim();
    return `${genre}, ${bpm}, ${style}`;
  }
};

// ==========================================
// SUNO V5 LOGIC HIERARCHY
// ==========================================

const LogicHierarchy = {
  sanitize: (text) => {
    let clean = text.toLowerCase();
    JUNK_TOKENS.forEach(token => { 
      clean = clean.replace(new RegExp(`\\b${token}\\b`, 'gi'), ""); 
    });
    clean = clean.replace(/\bghostly\b/g, "spacious reverb with slow attack");
    clean = clean.replace(/\bneon\b/g, "warm analog synth pads");
    clean = clean.replace(/\becho\b/g, "clean delay tail");
    return clean.trim();
  },

  // SUNO V5: Natural Language Assembly (not tag soup)
  assembleDNA: (data) => {
    const { genre, era, instruments, vocals, mood, bpm } = data;
    const parts = [genre, era, bpm, instruments, vocals, mood].filter(p => p && p.trim());
    return parts.join(". ").replace(/\.\s*\./g, ".").trim();
  },

  // Detect Pink Elephant Paradox (negative prompts)
  detectNegativePrompts: (text) => {
    const negatives = ["no drums", "no bass", "no piano", "no guitar", "no vocals", "no synth"];
    const found = negatives.filter(n => text.toLowerCase().includes(n));
    return found.length > 0 ? found : null;
  },

  // Convert negative to positive
  pinkElephantFix: (text) => {
    const conversions = {
      "no drums": "Acoustic, Ambient, Percussion-free",
      "no bass": "Clean, Light, High-frequency focus",
      "no piano": "Synth-focused, Electronic texture",
      "no guitar": "Piano-centric, Orchestral arrangement",
      "no vocals": "Instrumental",
      "no synth": "Acoustic, Organic texture"
    };
    let fixed = text;
    Object.entries(conversions).forEach(([neg, pos]) => {
      if (fixed.toLowerCase().includes(neg)) {
        fixed = fixed.replace(new RegExp(neg, 'gi'), pos);
      }
    });
    return fixed;
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMultiple = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length)).join(", ");
};

// ==========================================
// SUNO LOGIC CORE EXPORTS (V6)
// ==========================================

export const SunoLogicCore = {
  // Artist Descriptor Bypass
  getArtistDescriptor: (artistName) => {
    const normalizedName = artistName.toLowerCase();
    const match = Object.keys(ARTIST_BYPASS).find(key => key.toLowerCase() === normalizedName);
    if (match) {
      const desc = ARTIST_BYPASS[match];
      return LogicHierarchy.sanitize(desc);
    }
    if (normalizedName.includes("hans zimmer")) return "Epic Orchestral, Cinematic, Big Drum, Suspense";
    if (normalizedName.includes("nusrat")) return "Powerful Qawwali, Harmonium, Tabla, Sufi Chant";
    return null;
  },

  // Attribute Detection
  detectAttributes: (inputString) => {
    const lowerInput = inputString.toLowerCase();
    let detectedGenreKey = null;

    for (const key of Object.keys(GENRE_KNOWLEDGE)) {
      if (lowerInput.includes(key)) {
        detectedGenreKey = key;
        break;
      }
    }
    
    if (!detectedGenreKey) {
      if (lowerInput.includes("afghan") || lowerInput.includes("kabul")) detectedGenreKey = "afghan";
      else if (lowerInput.includes("pashto") || lowerInput.includes("attan")) detectedGenreKey = "pashto";
      else if (lowerInput.includes("turkish")) detectedGenreKey = "turkish";
      else if (lowerInput.includes("persian") || lowerInput.includes("iranian")) detectedGenreKey = "farsi";
      else if (lowerInput.includes("sufi") || lowerInput.includes("qawwali")) detectedGenreKey = "qawwali";
      else if (lowerInput.includes("khaleeji")) detectedGenreKey = "khaleeji";
      else if (lowerInput.includes("lebanese")) detectedGenreKey = "lebanese";
      else if (lowerInput.includes("dabke")) detectedGenreKey = "dabke";
      else if (lowerInput.includes("maghreb")) detectedGenreKey = "maghreb";
      else if (lowerInput.includes("bollywood")) detectedGenreKey = "bollywood";
      else if (lowerInput.includes("trap") || lowerInput.includes("drill")) detectedGenreKey = "drill";
      else if (lowerInput.includes("synthwave")) detectedGenreKey = "synthwave";
      else if (lowerInput.includes("rock")) detectedGenreKey = "rock";
      else if (lowerInput.includes("marching")) detectedGenreKey = "orchestral";
      else if (lowerInput.includes("latin") || lowerInput.includes("santana")) detectedGenreKey = "latin";
    }

    return {
      key: detectedGenreKey,
      knowledge: detectedGenreKey ? GENRE_KNOWLEDGE[detectedGenreKey] : DEFAULT_TRAITS,
      originalInput: inputString
    };
  },

  // BPM Modulation Calculator
  calculateModulation: (baseBpm, tuplet) => {
    if (!baseBpm || !tuplet) return { bpm: 0, description: '' };
    const modulated = Math.round((baseBpm / tuplet) * 4);
    return { 
      bpm: modulated, 
      description: `Tempo ${modulated} BPM. Metric Modulation: derived from ${baseBpm} BPM by ${tuplet}:4 Modulation.` 
    };
  },

  // V5 Creative Prompt Generator
  generateCreativePrompt: (userInput, isDuet = false, isSoftBlend = false) => {
    const { key, knowledge, originalInput } = SunoLogicCore.detectAttributes(userInput);
    const lowerInput = userInput.toLowerCase();

    // Check for negative prompts (Pink Elephant)
    const negativePrompts = LogicHierarchy.detectNegativePrompts(userInput);
    let safeInput = negativePrompts 
      ? LogicHierarchy.pinkElephantFix(userInput) 
      : userInput;

    // Soft Blend Mode
    if (isSoftBlend || lowerInput.includes("soft blend")) {
      if (key === "ghazal" || lowerInput.includes("ghazal")) {
        return {
          name: "Ethereal Urdu Ghazal [Soft Blend]",
          bpm: "72 BPM",
          style: "Traditional Urdu Ghazal, Ethereal Ambient. Harmonium and minimal Tabla. Soft synth pads. Intimate male vocal. Gentle and smooth.",
          structure: "[Intro] [Solo Harmonium in wide reverb]\n\n[Verse 1]\n{V1}\n\n[Chorus] [Subtle warm pads]\n{CHORUS}\n\n[Outro] [Harmonium fade]\n[End]"
        };
      }
      if (key === "farsi" || lowerInput.includes("persian")) {
        return {
          name: "Persian Silk Chillout [Soft Blend]",
          bpm: "85 BPM",
          style: "Sophisticated Persian Pop, Soft Chillout. Santur arpeggios, gentle downtempo beat. Elegant strings. Soft breathy female vocal. Smooth.",
          structure: "[Intro] [Santur and soft brushes]\n\n[Verse 1]\n{V1}\n\n[Chorus] [Smooth string swell]\n{CHORUS}\n\n[Outro] [Fading Santur]\n[End]"
        };
      }
    }

    // UK Ghazal Special Handler
    if (lowerInput.includes("uk ghazal") || (lowerInput.includes("london") && lowerInput.includes("ghazal"))) {
      const ukStyle = UKGhazalIdentity.getAnchor();
      return {
        name: `${LogicHierarchy.sanitize(originalInput)} (UK Studio Ghazal)`,
        bpm: "78 BPM",
        style: LogicHierarchy.sanitize(ukStyle),
        structure: `[Intro | Soft London rain textures | Soulful Sarangi Taksim | Melodic Harmonium drone]\n\n[Verse 1 | Intimate & Soulful]\n{V1}\n\n[Pre-Chorus | Subtle Harmonic Swells]\n{VPRE}\n\n[Verse 2 | Building Emotional Depth]\n{V2}\n\n[Chorus | The Matla | Heartbeat Tabla]\n{CHORUS}\n\n[Instrumental Solo | Technical Sarangi and Tabla conversation]\n[Extended Sarangi Solo | UK Studio Clarity]\n\n[Verse 3 | Emotional Peak]\n{V3}\n\n[Breakdown | Minimalist Harmonium | Focus on Poetic Diction]\n{V4}\n\n[Bridge | Atmospheric Cello & Sarangi Rise]\n{BRIDGE}\n\n[Chorus | Balanced Grandeur | Full Acoustic Ensemble]\n{CHORUS}\n\n[Outro | Fading Sarangi melody | Gentle rain sounds fade out]\n[End]`
      };
    }

    // BPM Selection
    const bpmMatch = userInput.match(/(\d+)\s*bpm/i);
    const bpm = bpmMatch 
      ? `${parseInt(bpmMatch[1])} BPM` 
      : `${Math.floor(Math.random() * (knowledge.bpmRange[1] - knowledge.bpmRange[0] + 1)) + knowledge.bpmRange[0]} BPM`;
    
    const selectedMood = pickRandom(knowledge.moods);
    const leadInstr = pickRandom(knowledge.leadInstruments || knowledge.instruments);
    const instrList = pickMultiple(knowledge.instruments, 3);
    const vocals = pickRandom(knowledge.vocals);

    const artistDesc = SunoLogicCore.getArtistDescriptor(safeInput);
    const cleanIn = LogicHierarchy.sanitize(safeInput.replace(/^(a|an)\s+/i, ""));
    const spine = artistDesc || cleanIn;

    let era = "";
    if (lowerInput.includes("70s")) era = "1970s analog style";
    else if (lowerInput.includes("90s")) era = "90s superstar production";
    else if (lowerInput.includes("60s")) era = "1960s vintage";

    let vocalDesc = isDuet 
      ? "Male and Female Duet, Stacked Harmonies" 
      : `Features ${vocals}, Clear Articulation`;
    
    let activeGenre = spine;
    let lang = "";

    if (key === "turkish") { 
      activeGenre = `Turkish ${activeGenre}`; 
      lang = " Turkish lyrics."; 
    }
    if (key === "khaleeji") { 
      activeGenre = `Oriental Arabesque, ${activeGenre}`; 
      lang = " Arabic lyrics, Melismatic."; 
    }
    if (key === "lebanese") { 
      activeGenre = `Oriental, ${LebaneseIdentity.getAnchor(cleanIn)}`; 
      lang = ` Lebanese dialect.`; 
    }
    if (key === "farsi") { 
      activeGenre = PersianIdentity.getAnchor(cleanIn); 
      lang = ` Farsi lyrics.${PersianIdentity.natureMetaphor}`; 
    }

    // V5 Natural Language Assembly
    let style = LogicHierarchy.assembleDNA({
      genre: activeGenre,
      era: era,
      instruments: `${InstrumentAdherence.forceHeroInstrument(leadInstr)}, ${instrList}`,
      vocals: vocalDesc,
      mood: `${selectedMood} energy`,
      bpm: bpm
    });

    if (lang) style += ` ${lang}`;
    if (isSoftBlend) style = SoftBlendLogic.applySafety(style) + SoftBlendLogic.getGlobalSuffix();
    
    style = LogicHierarchy.sanitize(style);
    style = TemplateEngine.fixPlurals(style);

    return {
      name: `${cleanIn} ${key || 'Custom'}${isSoftBlend ? ' [Soft Blend]' : ''}`,
      bpm: bpm,
      style: style,
      structure: SunoLogicCore.generateLyricsSkeleton(knowledge.structureType, leadInstr, vocals, isDuet)
    };
  },

  // Lyrics Skeleton Generator
  generateLyricsSkeleton: (type, leadInstr = "Instrument", vocalType = "Vocal", isDuet = false) => {
    const intro = `[Intro | Atmospheric build-up | ${leadInstr} solo]`;
    const outro = `[Outro | Fade out | ${leadInstr} melody]`;
    const chorus = isDuet 
      ? "[Chorus | Duet Harmony | Explosive | High Energy]" 
      : `[Chorus | ${vocalType} | Anthemic | High Energy]`;

    if (type === "ghazal" || type === "ottoman") {
      return `${intro}

[Verse 1 | ${isDuet ? "Male" : "Intimate"}]
{V1}

[Verse 2 | ${isDuet ? "Female" : "Building"}]
{V2}

${chorus}
{CHORUS}

[Instrumental Solo | [Extended ${leadInstr} Solo]]
${InstrumentAdherence.rhythmAnchor("!")}

[Verse 3 | Emotional Peak]
{V3}

${chorus}
{CHORUS}

${outro}
[End]`;
    }

    return `${intro}

[Verse 1]
{V1}

[Pre-Chorus | Add Tension]
{VPRE}

${chorus}
{CHORUS}

[Instrumental Solo | [Extended ${leadInstr} Solo]]
${InstrumentAdherence.rhythmAnchor("!!")}

[Verse 2 | Medium Energy]
{V2}

${chorus}
{CHORUS}

${outro}
[End]`;
  },

  // Prompt Filter
  filterPrompt: (prompt) => {
    let clean = prompt.toLowerCase().trim();
    if (clean.includes("no vocals")) return "[Instrumental]";
    return LogicHierarchy.sanitize(clean);
  },

  // V5 Compliance Checker
  checkV5Compliance: (template) => {
    const issues = [];
    
    // Check for plurals
    Object.entries(PLURAL_TO_SINGULAR).forEach(([plural, singular]) => {
      if (template.style && template.style.toLowerCase().includes(plural.toLowerCase())) {
        issues.push(`Plural found: "${plural}" should be "${singular}"`);
      }
    });

    // Check for spam words
    JUNK_TOKENS.forEach(token => {
      if (template.style && template.style.toLowerCase().includes(token.toLowerCase())) {
        issues.push(`Spam word found: "${token}"`);
      }
    });

    // Check BPM format
    if (template.bpm && !template.bpm.includes("BPM")) {
      issues.push(`BPM should include "BPM" suffix: "${template.bpm}"`);
    }

    // Check for negative prompts
    const negatives = LogicHierarchy.detectNegativePrompts(template.style || "");
    if (negatives) {
      issues.push(`Negative prompt detected (Pink Elephant): ${negatives.join(", ")}`);
    }

    // Check for extended solos
    if (!template.structure || !template.structure.includes("[Extended")) {
      issues.push("Structure should use [Extended Instrument Solo] format");
    }

    return {
      compliant: issues.length === 0,
      issues: issues
    };
  },

  // Apply V5 compliance fixes
  applyV5Fixes: (template) => {
    return TemplateEngine.validateAndFix(template);
  },

  // Export engine for external use
  engine: {
    fixPlurals: TemplateEngine.fixPlurals,
    removeSpam: TemplateEngine.removeSpam,
    fixBPM: TemplateEngine.fixBPMFormat,
    enforceExtendedSolo: TemplateEngine.enforceExtendedSolo,
    detectNegativePrompts: LogicHierarchy.detectNegativePrompts,
    pinkElephantFix: LogicHierarchy.pinkElephantFix
  }
};
