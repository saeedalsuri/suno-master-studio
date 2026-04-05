# Suno Master Studio V6

A **SUNO V5 compliant** music prompt generator built with Electron + React + Vite.

Generate professional music prompts with proper SUNO AI V5 formatting, regional genre templates, and V5 compliance checking.

## Features

- **Prompt Forge** - Generate V5-compliant style anchors and song structures
- **Lyric Studio** - Write and validate lyrics with structure templates
- **V5 Template Engine** - Browse, validate, and manage 57+ regional templates
- **V5 Compliance Checking** - Automatic validation of prompts against SUNO V5 rules

## SUNO V5 Compliance

This app enforces SUNO V5 compliance:

- Singular instruments only ("Guitar" not "Guitars")
- BPM format with suffix ("128 BPM")
- No spam words ("High Quality", "Radio-Ready", "Polished")
- Genre-first style prompts
- Extended solos ("[Extended Guitar Solo]" not "[Guitar Solo]")
- Pink Elephant Paradox fixes ("No Drums" → "Acoustic, Ambient")

## Regional Templates

Includes templates for:
- Arabic (Lebanese, Khaleeji, Egyptian, Maghreb)
- Persian/Iranian (Traditional & Modern)
- Turkish & Ottoman
- South Asian (Qawwali, Ghazal, Bollywood)
- Latin, Rock, Electronic, and more

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- Electron 33
- React 19
- Vite 6
- electron-builder

## License

MIT License
