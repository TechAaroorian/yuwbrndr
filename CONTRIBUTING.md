# Contributing to Yuwbrndr

Thank you for your interest in contributing to **Yuwbrndr**! 🎉

Yuwbrndr is an open-source, browser-native visual studio built by developers for developers under the philosophy: **"Design by Code · Design to All"**.

We welcome contributions of all sizes: bug fixes, documentation improvements, new templates/presets, responsive design enhancements, and new feature proposals.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and kind in all issues, pull requests, and discussions.

---

## How Can You Contribute?

### 1. Adding New Templates & Presets
One of the easiest and most impactful ways to contribute is by adding a new design template!
- Templates live in [`src/utils/codePresets.ts`](src/utils/codePresets.ts).
- Each preset requires:
  - `id`: Unique kebab-case identifier (e.g. `auth-flow-matrix`).
  - `name`: Human-readable name.
  - `category`: `'Infographic' | '3D & Canvas' | 'Vector & SVG' | 'Meme & Social' | 'Starter'`.
  - `type`: `'html' | 'canvas'`.
  - `description`: 1-2 sentence description.
  - `code`: The HTML/Tailwind or Canvas JavaScript snippet.

### 2. Adding Open-Source Typography & Stickers
- Fonts catalog: [`src/utils/fontsCatalog.ts`](src/utils/fontsCatalog.ts) (must be OFL or Apache 2.0 licensed).
- Stickers & vectors: [`src/utils/stickersCatalog.ts`](src/utils/stickersCatalog.ts) (must be MIT/CC0 open-source SVG).

### 3. Core Engine & UI Improvements
- Canvas scaling and responsive auto-fit: [`src/components/CanvasViewport.tsx`](src/components/CanvasViewport.tsx).
- Multi-slide carousel strip: [`src/components/SlideStrip.tsx`](src/components/SlideStrip.tsx).
- Rough.js sandbox integration: [`src/components/templates/custom/CustomCodeCanvas.tsx`](src/components/templates/custom/CustomCodeCanvas.tsx).
- Real-time syntax linter: [`src/utils/codeLinter.ts`](src/utils/codeLinter.ts).

---

## Local Development Workflow

### Prerequisites
- **Node.js**: v20 or newer
- **npm**: v9 or newer

### Setup

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/yuwbrndr.git
   cd yuwbrndr
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## Testing & Quality Checks

Before submitting a Pull Request, please ensure all automated tests and builds pass:

```bash
# Run Vitest unit tests (must pass with 0 errors)
npm test

# Run Oxlint for code quality
npm run lint

# Verify TypeScript compilation and production bundle build
npm run build
```

---

## Pull Request Guidelines

1. **Branch Naming**:
   - `feat/feature-name` (e.g. `feat/roughjs-hatching-preset`)
   - `fix/bug-description` (e.g. `fix/mobile-tab-drawer-clipping`)
   - `docs/documentation-update` (e.g. `docs/add-contributing-guide`)

2. **Commit Messages**:
   - Use clear, descriptive commit messages following the Conventional Commits style:
     - `feat: add new bento metrics template`
     - `fix: prevent zoom overflow on mobile safari`
     - `docs: update screenshot instructions in README`

3. **Open a Pull Request**:
   - Clearly describe what changes you made and link any related issues.
   - Include before/after screenshots or GIFs if you modified UI components.

---

## Questions or Need Help?

Feel free to open an issue or start a GitHub Discussion on the repository. Thank you for making developer visuals better for everyone! 🚀
