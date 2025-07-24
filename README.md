<div align="center">

# 🚀 DrawOnElon.xyz 🎨  
### *The Ultimate Interactive Elon Musk Drawing Experience*

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🌟_Live_Demo-Visit_Site-FF6B9D?style=for-the-badge)](https://drawonelon.xyz)
[![Twitter](https://img.shields.io/badge/🐦_Share-Twitter-1DA1F2?style=for-the-badge)](https://twitter.com)

---

*Click, Draw, Share, Repeat!* 🔄  
**A progressive clicking game where your perseverance unlocks the power to create digital art on Elon Musk's iconic face!**

<img width="1919" height="1079" alt="image (12)" src="https://github.com/user-attachments/assets/ba24b5dc-efa6-43ad-82a8-18d5f53bd20b" />

</div>

---

## 🎮 Gameplay Overview

### 👆 Click Phase
- Click Elon's face to earn drawing credits.
- Each round doubles the required number of clicks:
  - Round 1: 10 clicks → Round 2: 20 → 40 → 80 → ...

### 🎨 Draw Phase
- Unlock 5 brush strokes per round.
- Choose colors, adjust brush size, and create.
- Undo mistakes or clear the canvas.
- Auto-saves progress for the next round.

---

## ✨ Features

- **Drawing Tools**: HSL slider, 24 preset colors, 1–20px brush size, real-time preview.
- **Progression**: Exponential click-to-unlock system with session tracking.
- **Export & Share**: Download PNGs (500x500), tweet with pre-filled tags, smart filenames.
- **Responsive UX**: Works on desktop, mobile, and touch devices. Includes undo/reset.

---

## 🛠️ Tech Stack

| Tech        | Tools Used |
|-------------|------------|
| Framework   | Next.js 15.2.4, React 19, TypeScript 5 |
| UI & Styling| Tailwind CSS, shadcn/ui, Radix UI, Geist Fonts, Lucide Icons |
| Canvas      | HTML5 Canvas API |
| State       | React `useState`, `useRef` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) / npm / yarn

### Setup

```bash
git clone https://github.com/yourusername/DrawOnElon.git
cd DrawOnElon
pnpm install
pnpm dev
````

Visit `http://localhost:3000`

### Production

```bash
pnpm build
pnpm start
```

---

## 🖌️ Drawing Controls

| Feature       | Description                   |
| ------------- | ----------------------------- |
| Hue Slider    | 0–360° full spectrum          |
| Preset Colors | 24 colors including grayscale |
| Brush Size    | Adjustable (1–20px)           |
| Undo          | Revert last stroke            |
| Clear Canvas  | Wipe all drawings             |

---

## 📱 Device Support

* Desktop: Full-feature layout
* Mobile & Tablet: Responsive, touch/stylus ready

---

## 🥚 Fun Extras

* Smart cursor previews
* Artwork persists between rounds
* Twitter-ready share links
* Exponential progression system

---

## 🤝 Contributing

### How to Contribute

```bash
git clone https://github.com/yourusername/DrawOnElon.git
git checkout -b feature/your-feature-name
pnpm dev
pnpm lint
```

Then submit a pull request!

### Ideas to Contribute:

* UI/UX enhancements
* Gameplay tweaks
* Bug fixes
* Touch/gesture improvements
* Accessibility

---

## 🗺️ Roadmap

* [ ] Sound Effects
* [ ] Leaderboards
* [ ] More Characters to Draw On
* [ ] Cloud Save
* [ ] Advanced Drawing Tools (e.g., gradients, layers)
* [ ] PWA Support
* [ ] AI Drawing Suggestions

---

Enjoy drawing on Elon! 🖌️
