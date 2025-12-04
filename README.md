# 🌍 WildSphere — Interactive 3D Wildlife Discovery Globe

WildSphere is an immersive, interactive 3D globe experience that lets users explore animals from around the world. Click anywhere on Earth and reveal species native to that region — complete with facts, images, animations, and a polished UI built with React + Three.js.

## ✨ Features

- 🗺️ **Interactive 3D Globe** — Rotate, zoom, and click to explore wildlife.
- 🦁 **Region‑Based Animal Discovery** — Automatically detects the country or ocean you click and reveals the nearest matching animal.  
- 🎴 **Dynamic Fact Cards** — Beautiful card animations featuring species info, scientific names, and imagery.
- 🌌 **Starfield Background** — Atmospheric animated starfield for an immersive feel.
- 🎛️ **Day / Night / Heatmap Globe Styles** — Switch between globe styles to change the experience.
- 📱 **Responsive UI** — Mobile menu, desktop HUD, and smooth transitions.
- 🎯 **Smart Random Discovery** — Prioritizes unvisited animals to encourage exploration.
- 🧠 **Progress Tracking** — Tracks which animals you've already discovered.
- 🧪 **Vitest + React Testing Library** — Integration tests validate interactions across the app.

## 🚀 Tech Stack

- **React + TypeScript**
- **Three.js / react‑three‑fiber** (via custom `GlobeView`)
- **Framer Motion** for animations
- **TailwindCSS** & custom glassmorphism UI
- **Vitest** for testing
- **which‑country**, **iso‑3166‑1** for geographic mapping
- Custom modules:
  - `/lib/spatial` for nearest‑animal logic  
  - `/lib/oceanDetector` for ocean region detection  
  - `useProgress` hook for exploration tracking  

---

## 🧭 How It Works

### 🔍 1. Detect location type  
When the user clicks the globe, the app determines whether the location is a **country** or an **ocean**.

### 🐾 2. Find matching wildlife  
It filters all animals tagged with that region and selects the **nearest** one using geographic distance calculations.

### 🎬 3. Animate & reveal  
The globe animates to the clicked coordinates, pauses rotation, and displays a **Fact Card**.

### 🎲 4. Random discovery  
The “Random” button selects from unvisited animals first — ensuring a sense of progression.

---

## 📂 Project Structure (Core Files)

```
App.tsx  
 ├─ components/
 │   ├─ GlobeView
 │   ├─ FactCard
 │   ├─ HUD
 │   ├─ OrbMenu
 │   ├─ MobileMenu
 │   ├─ WelcomeOverlay
 │   └─ GlobeControls
 ├─ lib/
 │   ├─ spatial.ts
 │   ├─ oceanDetector.ts
 │   └─ clustering.ts
 ├─ data/
 │   └─ animals.json
 ├─ hooks/
 │   └─ useProgress.ts
 └─ styles/
     ├─ App.css
     ├─ index.css
```

---

## 🧪 Testing

The project includes integration tests with **Vitest**, verifying:

- Globe loads correctly  
- Clicking a location fetches and shows the correct animal  
- FactCard closes and triggers globe zoom‑out  
- Random discovery prioritizes unvisited species  

Run tests:

```bash
npm run test
```

---

## 🛠️ Installation & Development

### Clone the repository

```bash
git clone https://github.com/<your-username>/wildsphere.git
cd wildsphere
```

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 🎨 Theme & Style

The UI uses:

- A dark, atmospheric **space‑themed gradient**
- Glassmorphism UI panels (`glass-panel`, `glass-button`)
- Smooth animations powered by Framer Motion
- Minimalistic iconography and typography (`Inter`, `Outfit`)

---

## 🧭 Roadmap

- 📌 Add ocean‑specific animals  
- 📌 Add achievement system  
- 📌 Add sound design & ambient audio  
- 📌 Add ability to “bookmark” discovered species  

---

## ❤️ Acknowledgments

Inspired by the beauty of wildlife and the wonder of global exploration.  
Built to spark curiosity — one click at a time.

---

## 📜 License

MIT License — free for personal and commercial use.

