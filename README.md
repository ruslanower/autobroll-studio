# 🎬 AutoB-Roll Studio
> **An AI Cadence-Aware B-Roll Timeline Generator by [Video VanzaLabs](https://github.com/ruslanower)**  
> *Automatically cuts, directs, and synchronizes dynamic B-Roll footage to the author's voiceover cadence.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ruslanower/autobroll-studio)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-emerald)

---

## ⚡ What is AutoB-Roll Studio?

Talking head videos and pure voiceover tracks suffer from high drop-off rates if visual scenes don't change every 2–4 seconds. **AutoB-Roll Studio** analyzes the speaker's **words per minute (WPM), speech cadence, and natural breathing pauses** to assemble a synchronized multi-track B-Roll timeline.

Unlike primitive keyword searchers, AutoB-Roll Studio resolves **semantic metaphors** (e.g. *“our revenue skyrocketed”* $\rightarrow$ dynamic night hyperlapse or rocket launch, not a boring dollar coin) and generates **Pro NLE files (.xml, .fcpxml, .edl)** ready to open inside Adobe Premiere Pro, Final Cut Pro, or DaVinci Resolve.

---

## 🌟 Key Features

1. **🎙️ Cadence-Aware Voice Sync:**
   - Word-level alignment and silence detection.
   - Dynamic pacing adaptation: High-Energy Reels (2.4s per cut) vs. Narrative Documentaries (3.6s per cut).

2. **🎞️ Multi-Track NLE Timeline:**
   - Track `V1`: B-Roll Video blocks with thumbnails, in/out points, and camera motions (Ken Burns).
   - Track `TXT`: Kinetic karaoke subtitles (Alex Hormozi, Vox, Cyberpunk neon styles).
   - Track `A1`: Voiceover audio waveform synchronized with playhead scrubber.
   - Track `A2`: Sound design markers (Whooshes, Risers, Sub-drops).

3. **✦ Hybrid Footage Sourcing:**
   - **Curated Stock:** Pexels, Storyblocks, Pixabay.
   - **GenAI Synthesis:** Runway Gen-3, Luma Dream Machine, Kling AI.
   - **Instant Swap:** Click any scene on the timeline to swap footage or re-prompt AI in 1 click.

4. **📁 Zero-Loss Pro NLE Export:**
   - **Adobe Premiere Pro XML** (`.xml` compliant with Premiere / FCP7 sequence specifications).
   - **Final Cut Pro X** (`.fcpxml` v1.9).
   - **DaVinci Resolve EDL** (CMX 3600 standard EDL for colorists).
   - **Direct MP4 Render** with burned-in subtitles and sound effects.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/ruslanower/autobroll-studio.git
cd autobroll-studio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy on Vercel

### Method 1: One-Click Deploy via Vercel Button
Click the **Deploy with Vercel** button at the top of this README.

### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Timeline & XML Specs:** OpenTimelineIO compliant XML / FCPXML / EDL generators
- **Effects:** Canvas Confetti

---

## 📄 License

MIT License © 2026 **Video VanzaLabs**. Created by [ruslanower](https://github.com/ruslanower).
