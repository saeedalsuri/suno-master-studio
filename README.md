# Suno Master Studio V6

![Version](https://img.shields.io/badge/version-6.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows-blueviolet)
![Electron](https://img.shields.io/badge/Electron-33-black)
![React](https://img.shields.io/badge/React-19-61dafb)

**A SUNO V5 compliant music prompt generator for professional music production.**

Generate industry-standard music prompts with automatic V5 compliance checking, 57+ regional templates, and intelligent genre matching.

## Overview

Suno Master Studio V6 is a desktop application that helps music producers create SUNO AI-compatible prompts that follow the latest V5 format requirements. It features automatic validation, regional genre templates, and a powerful prompt engine.

## Key Features

- **Prompt Forge** - Generate V5-compliant style anchors and song structures
- **Lyric Studio** - Write and validate lyrics with structure templates  
- **V5 Template Engine** - Browse, validate, and manage 57+ regional templates
- **V5 Compliance Checking** - Automatic validation against SUNO V5 rules
- **Regional Templates** - Support for Arabic, Persian, Turkish, South Asian, Latin, and more

## SUNO V5 Compliance

This app enforces strict SUNO V5 compliance:

| Rule | Correct | Incorrect |
|------|---------|-----------|
| Singular instruments | `Guitar` | `Guitars` |
| BPM format | `128 BPM` | `128` |
| Extended solos | `[Extended Guitar Solo]` | `[Guitar Solo]` |
| Genre first | `Arabic Pop, 125 BPM...` | `125 BPM, Arabic Pop...` |
| No spam words | (removed) | `High Quality, Radio-Ready` |
| Pink Elephant fix | `Acoustic, Ambient` | `No Drums` |

## Regional Templates

### Arabic
- Lebanese (Dabke-Pop, Ballads, Jazz)
- Khaleeji/Saudi (Romance, Dance, 6/8 Khabbaiti)
- Egyptian (Shaabi, Folk Ballad, Jazz Fusion)
- Maghreb (Rai, Gnawa, Moroccan Fusion)

### Persian/Iranian
- Traditional (Dastgah, Avaz)
- Modern Iranian Pop (1970s Retro, Tehran Style)

### Turkish & Ottoman
- Classical Turkish Makam
- Neo-Tarab Fusion

### South Asian
- Qawwali (Traditional, Muqabla)
- Ghazal (Urdu, Mohani Style)
- Bollywood
- Punjabi

### Other
- Latin, Rock, Electronic, Country, Orchestral

## Installation

### From Release
Download the latest release from the [Releases page](https://github.com/saeedalsuri/suno-master-studio/releases).

### Build from Source

```bash
# Clone the repository
git clone https://github.com/saeedalsuri/suno-master-studio.git
cd suno-master-studio

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Usage

### Prompt Forge
1. Enter a genre or musical description (e.g., "1970s Googoosh style", "Lebanese Dabke")
2. Toggle Duet Mode or Soft Blend if needed
3. Click "Forge Style" to generate
4. Copy the Style Anchor to SUNO

### Lyric Studio
1. Navigate to Lyric Studio tab
2. Import structure from Prompt Forge or start fresh
3. Add verses using placeholders: `{V1}`, `{CHORUS}`, `{BRIDGE}`
4. Validate BPM format

### V5 Template Engine
1. Browse 57+ pre-built templates
2. Filter by genre or BPM
3. Validate templates for V5 compliance
4. Copy validated templates

## Tech Stack

- **Framework:** Electron 33
- **Frontend:** React 19 + Vite 6
- **Build Tool:** electron-builder
- **Styling:** CSS3 with glassmorphism UI

## Project Structure

```
SunoMasterStudio_V6/
├── src/
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # Main styles
│   ├── utils/
│   │   └── sunoLogic.js           # V5 Logic Core
│   ├── data/
│   │   ├── options.js             # Genre knowledge base
│   │   └── templates.json         # 57+ regional templates
│   └── components/
│       ├── LyricStudio.jsx        # Lyric editor
│       └── V5TemplateEngine.jsx   # Template browser
├── build/
│   └── icon.ico                   # App icon
├── electron-main.js               # Electron main process
└── package.json
```

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Contributions welcome! Please submit issues and pull requests.

## Repository

**GitHub:** https://github.com/saeedalsuri/suno-master-studio

---

*Built for music producers who demand V5 compliance.*
