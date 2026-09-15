# YuwBrndr

YuwBrndr is a browser-based studio for creating social graphics from HTML, Tailwind CSS, and Canvas JavaScript. It combines a live code editor, platform-sized canvases, reusable templates, image assets, and PNG export in one workspace.

## Features

- Live HTML/Tailwind and Canvas preview
- Presets for social posts, thumbnails, banners, and article covers
- Templates, fonts, stickers, and uploaded image assets
- Syntax highlighting, formatting, and lint feedback
- PNG export at 1x, 2x, or 4x and clipboard copy
- Responsive, focused dark workspace

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and run the linter with `npm run lint`.

## Security note

Canvas JavaScript entered in the editor currently executes in the browser page. Only run code you wrote or fully trust. Do not paste unknown templates or scripts. Preview sandboxing is planned before this project is positioned for broader third-party use.

## Repository status

This repository is publicly available as a portfolio and educational reference project. It is not currently offered as an open-source project or reusable starter template. All rights are reserved unless otherwise stated.
