# Work with the local Aar Loom checkout

The saved dependency remains an exact npm version. Temporary development installs change node_modules only.

```sh
npm run loom:local
npm run loom:status
npm run dev
```

`loom:local` defaults to `../techaaroorian-ui`; pass another source directory with `npm run loom:local -- <source-directory>`. It builds and packs Aar Loom, verifies the tarball hash, installs in an isolated cache folder and copies only Aar Loom into node_modules without saving manifests or the lockfile, and records a local marker in ignored .cache. Rerun it after each framework change and restart Vite. Normal application edits hot reload.

Zoom, type scale and editor font-size controls now use the public `aar-button-group` family. Tablet stacking is supplied by Aar Loom, so the local layout-specificity workaround has been removed. No framework source alias or private sibling stylesheet is used at runtime.

Before release, publish the framework changes, install and pin the new npm version, then run:

```sh
npm run loom:published
npm run release:check
```

`loom:published` restores node_modules using npm ci, verifies saved dependency files are unchanged, then clears the local marker. The release/deploy guard rejects local specs and non-registry framework lockfile entries. The build requires the button-group export, so the current published 0.2.0-alpha.3 cannot satisfy this branch's new API requirement. Publish and pin the next alpha before merging the consumer.

Local packs can carry the old manifest version; their hash and marker identify development content. Do not treat that version as proof the changes are published. If npm ci is run manually, use loom:published to reset the marker too.

Stop the application Vite server before `loom:published` on Windows so native build binaries are not locked. The isolated local install does not re-resolve the application's unrelated dependencies. Packed filenames include a content hash, so changed CSS is not confused with a cached tarball carrying the same base version.
