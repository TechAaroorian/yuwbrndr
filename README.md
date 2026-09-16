# YuwBrndr

YuwBrndr is a browser-based studio for creating social graphics from HTML, CSS, Tailwind-compatible utilities, and Canvas JavaScript. It combines a live code editor, platform-sized canvases, reusable templates, image assets, and PNG export in one workspace.

## Features

- Live HTML/CSS and sandboxed Canvas preview
- Runtime Tailwind-compatible utilities powered by UnoCSS Wind4
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

HTML previews run with scripts disabled. Canvas JavaScript runs in an origin-isolated preview and communicates with the application through a narrow message protocol. Users should still only run code they understand and trust.

## Usage and content responsibility

Anyone may use the deployed application to create and export graphics without an account, watermark, or usage limit. Users remain responsible for the legality, licensing, accuracy, and suitability of the code, text, images, fonts, trademarks, personal data, and other assets they use or publish. Users should confirm that they have the necessary rights and follow the rules of the platforms where they publish their output.

## Repository status

This repository is publicly available as a portfolio and educational reference project. It is not currently offered as an open-source project or reusable starter template. All rights are reserved unless otherwise stated.
