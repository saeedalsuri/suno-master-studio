/* 
  SUNO V6 - V5 COMPLIANT OPTIONS
  Data source for Suno Prompt Maker
  All terms corrected: singular instruments, no spam words
*/

// ==========================================
// ARTIST BYPASS DESCRIPTORS (Corrected)
// ==========================================
export const ARTIST_BYPASS = {
  "Drake": "Melodic trap, moody, deep 808 bass, reverb-heavy",
  "Billie Eilish": "Minimal pop, whispery female vocal, dark bass, ethereal",
  "Taylor Swift": "Modern country-pop, heartfelt storytelling, female soprano, acoustic guitars",
  "Johnny Cash": "Deep raspy baritone, outlaw country, boom-chicka rhythm",
  "Santana": "Latin Rock, soulful overdriven electric guitar, conga, organ",
  "Queen": "Rock, Operatic, Theatrical, Male vocal",
  "The Weeknd": "RnB, Dark, Cinematic, male vocal",
  "Metallica": "Thrash metal, aggressive riff, pounding drum, male vocal",
  "Eminem": "Rapid-fire rap, deep bass beat, aggressive delivery in a minor key",
  "Green Day": "Punk Rock, Aggressive, Youthful",
  "Daft Punk": "Electronic, Dance, Futuristic",
  "Lana Del Rey": "Pop, Sadcore, Cinematic, female vocal",
  "Googoosh": "1970s Iranian Pop, Melancholic, Lush Orchestral production, deep bass-heavy drama, Female Mezzo-Soprano"
};

// ==========================================
// GENRES (V5 Compliant)
// ==========================================
export const GENRES = [
  "Indie Pop", "Melodic Techno", "Spaghetti Western", "Baroque Pop", "Delta Blues", 
  "Liquid DnB", "Synthwave", "Chicago House", "Trap", "Hip Hop", "Dubstep", "Rock", 
  "Pop", "Metal", "Country", "Jazz", "Classical", "Folk", "RnB", "Soul", "Funk", "Disco", "Reggae",
  // Regional
  "Khaleeji", "Lebanese", "Dabke", "Maghreb", "Qawwali", "Ghazal", "Bollywood",
  "Persian", "Afghan", "Turkish", "Ottoman"
];

// ==========================================
// MOODS (V5 Compliant)
// ==========================================
export const MOODS = [
  "Aggressive", "Anthemic", "Atmospheric", "Bittersweet", "Breezy", "Bright", "Chill", 
  "Cinematic", "Dark", "Dreamy", "Emotional", "Energetic", "Ethereal", "Euphoric", 
  "Funky", "Gloomy", "Groovy", "Happy", "Haunting", "Heavy", "Hopeful", "Hypnotic", 
  "Intense", "Intimate", "Joyful", "Laid-back", "Melancholic", "Mellow", "Minimal", 
  "Moody", "Mysterious", "Nostalgic", "Optimistic", "Peaceful", "Playful", "Powerful", 
  "Psychedelic", "Quirky", "Raw", "Relaxing", "Romantic", "Sentimental", 
  "Sexy", "Smooth", "Somber", "Soothing", "Sophisticated", "Soulful", 
  "Spooky", "Suspenseful", "Tense", "Trippy", "Upbeat", "Uplifting", "Warm", "Whimsical"
];

// ==========================================
// INSTRUMENTS (Singular Form - V5)
// ==========================================
export const INSTRUMENTS = [
  // Bass
  "808 Sub-bass", "Bass Guitar", "Slap bass", "Deep bass", "Sub bass",
  // Guitars
  "Acoustic Guitar", "Electric Guitar", "Distorted Electric Guitar", "Nylon String Guitar",
  "Fingerstyle Guitar", "Slide Guitar",
  // Keys
  "Grand Piano", "Felt Piano", "Hammond B3 Organ", "Harpsichord", "Wurlitzer",
  // Strings
  "Violin", "Cello", "Viola", "String Section", "Orchestral string",
  // Winds
  "Flute", "Ney Flute", "Saxophone", "Clarinet", "Trumpet", "French Horn",
  // Traditional/Middle Eastern
  "Oud", "Qanoon", "Santur", "Tar", "Dutar", "Harmonium", "Tabla", "Darbuka",
  "Bendir", "Dhol", "Mijwiz", "Accordion", "Rababa",
  // Electronic
  "Synthesizer", "Drum Machine", "808", "Analog Synth", "Modular Synth",
  // Percussion
  "Percussion", "Drum", "Conga", "Timbales", "Shaker", "Cymbal",
  // Other
  "Harp", "Xylophone", "Kalimba", "Balafon", "Horn Section", "Mandolin", "Ukulele",
  "Fiddle", "Pedal Steel", "Banjo", "Vocoder"
];

// ==========================================
// VOCAL TYPES (Singular - V5)
// ==========================================
export const VOCAL_TYPES = [
  "Male", "Female", "Duet", "Choir", "Instrumental (No Vocals)"
];

// ==========================================
// VOCAL STYLES (Corrected - V5)
// ==========================================
export const VOCAL_STYLES = [
  "Anthemic", "Autotuned", "Baritone", "Belted", "Breathy", "Chanted", "Clean", 
  "Deep", "Distorted", "Emotional", "Ethereal", "Falsetto", "Fry Scream", "Gang vocal", 
  "Gospel", "Growled", "Guttural", "Harmony", "High-pitched", "Husky", "Lounge", 
  "Melismatic", "Operatic", "Pop", "Rap", "Raspy", "Raw", "Reverb-heavy", "Robot", 
  "Screamed", "Shouted", "Smooth", "Soft", "Soulful", "Spoken Word", "Soprano", 
  "Strained", "Tenor", "Whispered", "Melismatic"
];

// ==========================================
// PRODUCTION STYLES (No spam - V5)
// ==========================================
export const PRODUCTION_STYLES = [
  "Lo-fi", "Wide Stereo", "Tape Saturation", "Vinyl Crackle", 
  "Clean Mix", "Dry vocal", "Reverb-soaked", "Wall of Sound", "Close-mic", "Live Recording",
  "Spacious", "Airy mix", "High clarity", "Warm saturation"
];

// ==========================================
// SONG STRUCTURES (Extended Solo Format - V5)
// ==========================================
export const SONG_STRUCTURES = [
  {
    name: "Standard Pop (Verse-Chorus)",
    structure: "[Intro]\n[Verse 1]\n[Pre-Chorus]\n[Chorus]\n[Verse 2]\n[Pre-Chorus]\n[Chorus]\n[Bridge]\n[Chorus]\n[Outro]"
  },
  {
    name: "EDM / Dance (Build-Drop)",
    structure: "[Intro]\n[Verse 1]\n[Build-Up]\n[Drop]\n[Verse 2]\n[Build-Up]\n[Drop]\n[Bridge]\n[Outro]"
  },
  {
    name: "Rap / Hip-Hop (Hook-Verse)",
    structure: "[Intro]\n[Hook]\n[Verse 1]\n[Hook]\n[Verse 2]\n[Hook]\n[Outro]"
  },
  {
    name: "Rock / Metal (Solo Focus)",
    structure: "[Intro]\n[Verse 1]\n[Chorus]\n[Verse 2]\n[Chorus]\n[Extended Guitar Solo]\n[Bridge]\n[Chorus]\n[Outro]"
  },
  {
    name: "Folk / Ballad (Storytelling)",
    structure: "[Intro]\n[Verse 1]\n[Verse 2]\n[Chorus]\n[Verse 3]\n[Chorus]\n[Outro]"
  },
  {
    name: "Arabic / Oriental (Mawal-Chorus)",
    structure: "[Intro | Mawal - Instrumental Taksim]\n[Verse 1]\n[Chorus]\n[Verse 2]\n[Chorus]\n[Extended Instrument Solo]\n[Bridge]\n[Chorus]\n[Outro | Final Mawal]"
  },
  {
    name: "Qawwali (Muqabla)",
    structure: "[Intro | Harmonium and Tabla]\n[Verse 1 | Lead vocal]\n[Chorus | Ensemble]\n[Verse 2 | Lead vocal]\n[Chorus | Ensemble]\n[Extended Harmonium Solo]\n[Muqabla | Call and Response]\n[Chorus | Full Ensemble]\n[Outro]"
  }
];

// ==========================================
// BPM RANGES BY GENRE (V5)
// ==========================================
export const BPM_RANGES = {
  "Ghazal": [60, 102],
  "Qawwali": [105, 165],
  "Dabke": [115, 130],
  "Khaleeji": [80, 112],
  "Maghreb": [105, 145],
  "Latin": [110, 128],
  "Drill": [135, 145],
  "Afrobeat": [100, 118],
  "Ottoman": [70, 90],
  "Techno": [124, 140],
  "Rock": [110, 150],
  "Synthwave": [100, 120],
  "Orchestral": [108, 120],
  "Country": [70, 110],
  "Turkish": [68, 85],
  "Persian": [75, 115],
  "Afghan": [85, 145],
  "Bollywood": [90, 135],
  "Lebanese": [110, 125]
};

// ==========================================
// V5 COMPLIANCE RULES (Export for UI)
// ==========================================
export const V5_RULES = {
  plurals: [
    "Male Vocals → Male vocal",
    "Female Vocals → Female vocal",
    "Electric Oud Riffs → Electric Oud riff",
    "String Sections → String section",
    "Orchestral Strings → Orchestral string",
    "808 Bass → 808 bass",
    "War Drums → War Drum",
    "hi-hats → hi-hat"
  ],
  spamWords: [
    "High Quality", "Polished", "Radio-Ready", "Mastered for Radio",
    "High Fidelity", "2026 Production", "Polished Pop Vocals",
    "No Bollywood", "No Pop", "No Ghazal", "No Adlibs",
    "No Vocal Runs", "No Vibrato"
  ],
  soloFormat: "Use [Extended Instrument Solo] instead of [Instrument Solo]",
  bpmFormat: "Include 'BPM' suffix: '128 BPM' not just '128'",
  pinkElephant: "Convert 'No [Instrument]' to positive descriptors"
};
