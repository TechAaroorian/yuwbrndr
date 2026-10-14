# Aar Loom studio migration

The studio uses the published `@techaaroorian-ui/aar-loom@0.2.0-alpha.3` CSS package, pinned in package.json and the lockfile. No sibling repository import is required.

Paper groups content, ink communicates, and motion explains change. Warm neutral workspace surfaces and a sage template section replace dark decorative panels. Borders identify controls and overlaps; routine content groups rely on fill and spacing. Light, Dark and System are the appearance options. Authored canvas palettes stay independent.

## Integration

The Tailwind v3-compatible Aar Loom entry supplies public tokens, native selects, buttons, paper sheets, segmented controls, file intake, slide thumbnails, tool groups and status bars. Tailwind preflight is disabled so its reset cannot override layered framework controls. Existing Tailwind utilities still provide legacy composition and authored-template styling; this migration does not claim that Tailwind has been completely removed.

Studio-specific CSS is limited to viewport/dock geometry and CodeMirror integration. It does not duplicate theme palettes, dropdown skins or button designs. The native select uses Aar Loom's supported option reveal and the platform fallback. CodeMirror reads appearance tokens, and upload controls accept keyboard activation.

Authored presets, template renderers and generated snippets retain their styles. HTML preview runs in its existing iframe; export rendering and processing remain application behavior. No new headless package adoption is included in this visual migration.

## Review

Run `npm run dev` and inspect the Vite URL. Check at 320, 768 and 1440px; open mobile tools and file intake; switch to Code; toggle Light/Dark/System; inspect slide selection and wrapped commands. Check that studio theme changes leave iframe srcdoc unchanged. Run `npm run build`, `npm test` and `npm run lint`.

Browser review covered those widths, studio appearance, upload focus, mobile code access, slide controls, preview HTML isolation and a real sample PNG download. Review screenshots live locally in the ignored .cache directory. Existing lint warnings and the large editor/export bundle warning remain; neither is introduced as an alpha framework guarantee.

The task shell now uses a canvas-first two-region composition and one tabbed supporting dock. See [layout rationale](./layout-rationale.md) for each decision and its tradeoffs.
