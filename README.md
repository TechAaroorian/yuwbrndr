<p align="center">
  <a href="https://techaaroorian.github.io/yuwbrndr/">
    <img src="public/yuwbrndr-logo.svg" alt="Yuwbrndr Logo" width="96" height="96" />
  </a>
</p>

<h1 align="center">Yuwbrndr</h1>

<p align="center">
  <strong>Design by Code · Design to All</strong><br />
  An open-source, browser-native studio for turning HTML, Tailwind CSS, and Rough.js into high-resolution social graphics and multi-slide LinkedIn carousels.
</p>

<p align="center">
  <a href="https://techaaroorian.github.io/yuwbrndr/"><img src="https://img.shields.io/badge/Live%20Studio-Try%20Now-6366f1?style=flat-square" alt="Live Demo" /></a>
  <a href="https://github.com/TechAaroorian/yuwbrndr/stargazers"><img src="https://img.shields.io/github/stars/TechAaroorian/yuwbrndr?style=flat-square&logo=github&color=eab308" alt="GitHub Stars" /></a>
  <a href="https://github.com/TechAaroorian/yuwbrndr/network/members"><img src="https://img.shields.io/github/forks/TechAaroorian/yuwbrndr?style=flat-square&logo=github&color=8b5cf6" alt="GitHub Forks" /></a>
  <a href="https://github.com/TechAaroorian/yuwbrndr/issues"><img src="https://img.shields.io/github/issues/TechAaroorian/yuwbrndr?style=flat-square&logo=github" alt="Open Issues" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Tests-29%20Passed%20(Vitest)-10b981?style=flat-square" alt="Tests: Vitest" />
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
</p>

---

<p align="center">
  <img src="public/demo.gif" alt="Yuwbrndr Studio - Interactive Demo" width="100%" />
</p>

## Why Yuwbrndr?

Every developer who posts technical tutorials, system designs, or architecture diagrams on LinkedIn and X faces the same headaches with traditional tools and AI image generators:

1. **AI Hallucinations & Unfixable Typos**: When an AI generator misspells a word or scrambles an API route, you can't just edit the text—you have to re-roll the entire prompt slot machine. With Yuwbrndr, you edit the string in CodeMirror and the canvas updates in **16 milliseconds**.
2. **Moving Beyond the "Typical AI Slop" Look**: Built-in [Rough.js](https://roughjs.com/) integration lets you create organic, hand-drawn whiteboard diagrams with sketchy hatched fills that feel human and authentic.
3. **Multi-Slide Carousels in 1 Click**: Social platforms like LinkedIn reward multi-slide document carousels with 2.5x higher engagement. Yuwbrndr lets you design up to 6 structured slides and export them directly to a **multi-page high-DPI PDF** or a ZIP of numbered PNGs.
4. **Zero-Server URL Sharing**: When you click "Share", your entire design (code, aspect ratio, theme) is compressed client-side into the URL hash using native `CompressionStream` (`#share=v1z...`). No database, no accounts, and no data tracking.
5. **No Token Limits or Quotas**: Runs 100% in your browser. Generate as many graphics as you want without subscription paywalls or credit meters.

---

## Key Features

- **🎨 Dual Engine**: Live HTML/CSS with Tailwind-compatible utilities (UnoCSS Wind4) or sandboxed 2D Canvas JavaScript.
- **✏️ Hand-Drawn Whiteboard Art (Rough.js)**: Declarative `<svg data-rough-rect="...">` attributes or inline scripts with open-source fonts like Comic Neue, Caveat, and Patrick Hand.
- **📄 Multi-Slide Carousel Generator**: Dedicated slide deck strip supporting up to 6 slides with instant **Export PDF** (for LinkedIn carousels) and **Export ZIP** (for X/Twitter threads).
- **📱 Mobile-First Typography**: Aspect ratio presets (LinkedIn 1200×627, X/Twitter 1200×675, Instagram 1080×1080) with built-in font size guardrails so diagrams stay sharp on mobile feeds.
- **⚡ Instant 1x / 2x / 4x Retina PNG Export**: High-DPI rasterization powered by `html-to-image` and clipboard copy.
- **🔍 Real-Time Syntax Linter**: Tag-balance validator and JavaScript syntax checker built right into CodeMirror 6.
- **🌗 Responsive Dark & Light Studio**: Comfortable workspace on desktop, tablet, and mobile.

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js**: v20 or newer
- **npm**: v9 or newer

### Installation

```bash
# Clone the repository
git clone https://github.com/TechAaroorian/yuwbrndr.git
cd yuwbrndr

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## Testing & Quality Assurance

Yuwbrndr features an automated test suite powered by **Vitest**:

```bash
# Run Vitest unit tests
npm test

# Run code linter
npm run lint

# Build production bundle
npm run build
```

---

## Security & Privacy First

- **Isolated Sandbox**: HTML previews run inside an isolated iframe sandbox (`sandbox="allow-scripts allow-same-origin"`).
- **Your Code Stays in Your Browser**: All HTML, Tailwind CSS, JavaScript canvas code, and exports execute 100% locally in browser memory. Your designs and code are **never** uploaded to an external server.
- **Zero Cookies & Zero Tracking**: Yuwbrndr uses [GoatCounter](https://www.goatcounter.com/) strictly for aggregate, anonymous page visit counts. No cookies, no session tokens, and no invasive telemetry.

---

## Contributing & Git Workflow

Contributions make the open-source community an amazing place to learn, inspire, and create! Any contributions you make are **greatly appreciated**.

### Git Contributor Workflow

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/yuwbrndr.git
cd yuwbrndr

# 2. Add upstream remote to stay synced with main
git remote add upstream https://github.com/TechAaroorian/yuwbrndr.git

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Make changes, run tests and build
npm test
npm run build

# 5. Commit with conventional commit message
git add .
git commit -m "feat(templates): add system architecture visual preset"

# 6. Push to your fork and create a Pull Request
git push origin feat/your-feature-name
```

Please check out our full [**Contributing Guidelines (CONTRIBUTING.md)**](CONTRIBUTING.md) for details on code architecture, testing, and PR reviews.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

Built with ❤️ by [**Janarthanan Soundararajan (@TechAaroorian)**](https://github.com/TechAaroorian).
