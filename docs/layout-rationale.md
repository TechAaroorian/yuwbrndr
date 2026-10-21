# Yuwbrndr layout rationale

The design follows Aar Loom's task hierarchy and adaptive composition, not the previous three-column editor. The guiding rule is: **paper groups content, ink communicates, motion explains change**. A framework class provides presentation; the application owns document state, keyboard behavior and panel visibility.

| Part | Design decision | Why | Tradeoff / review criterion |
| --- | --- | --- | --- |
| Task header | Identity, Graphic/Slides, Tools, Studio actions and primary Export | Document mode changes the work being created; Export completes it. Preferences and help should not compete with either. | Sharing and appearance take one extra menu opening. They remain keyboard-accessible. |
| Canvas region | First in DOM order; larger column on wide workspaces | The result is the task. Evaluate its composition before focusing on implementation. At 1440px the initial canvas region is about 976px while the dock is 416px. | Code has less width by default; Focus code provides deliberate expansion. |
| Preview toolbar | Format, zoom, fit, type scale and specs beside the output | Commands belong near the object they affect. They should not be confused with application appearance. | Groups wrap when space is limited; long format names belong in a native select. |
| One supporting dock | Code, Templates and Assets share paper tabs | These are alternate ways of changing one document, not three competing primary regions. This releases space otherwise consumed by two persistent sidebars. | Switching tools costs one selection. Document and asset state remain shared. |
| Template and asset content | Canvas palette lives with templates; upload, fonts and stickers live with assets | Context makes a setting's effect easier to predict. Changing the studio to Dark must not recolor exported content. | No generic all-settings sidebar. Further workflow learning may change grouping. |
| Wide layout | Content plus one inspector region above 72rem | Aar Loom groups the task and support without giving equal visual weight to every panel. | The dock is bounded; commands and long labels wrap. |
| Tablet layout | Dock stacks below canvas between 48rem and 72rem | Keep a usable preview and readable tools instead of squeezing two narrow columns. The workspace body scrolls; tools are not discarded. | Reaching tools may require scrolling. Public workspace primitives supply stacking; the two-region specificity correction now lives in Aar Loom. |
| Phone layout | Canvas/Tools task views at 48rem and below | One meaningful working region is more useful than a compressed desktop. The bottom view switch keeps both reachable. | Canvas and tools are not simultaneous. Their state is preserved between views. |
| Focus and collapse | Tools can close; Code can explicitly occupy the working region | Long code edits and output reviews need different proportions. Give the user control over that choice. | Closing restores focus to Edit code. Ctrl+B toggles the dock; phone Tools reopens it. |
| Empty workspace | Guidance and start actions outside the scaled export canvas | Instructions are interface content, not authored output. They must remain readable at phone zoom levels. | Empty canvas cannot be exported; add a design first. |
| Surfaces and boundaries | Purpose-specific sage, lavender, clay and ochre sheets; warm task background; borders on controls and menus | Fill and spacing express grouping. Repeated nested outlines would compete with the actual canvas. | Region color never carries meaning alone: headings, labels and selection remain explicit. |
| State and motion | Native menus/selects, keyboard-operable tabs, persistent editor, reduced-motion support | Interaction should be predictable while changing the view. Motion explains a transition without becoming the task. | This is an alpha application integration, not a complete accessibility certification. |
| Rationale access | Why this layout? in the footer and Studio actions | Design decisions should be inspectable without filling the work area with implementation explanations. | The native dialog temporarily interrupts work and restores focus on dismissal. |

## Implementation boundaries

Aar Loom supplies `aar-workspace`, the studio body and typed regions, paper sheets, toolbar groups, paper tabs, native menus, dialog, controls and status bar. Yuwbrndr's small geometry layer specifies mobile view selection, explicit code focus, panel height and CodeMirror containment. Existing legacy utility classes still remain in editor and catalog interiors; the task shell is no longer the old Tailwind three-column composition.

Authored templates, generated font/image snippets, preview HTML and export behavior stay independent. The iframe continues to isolate authored HTML. Neither the CSS framework nor this layout creates upload, sharing or export state automatically.

## Verification

Review wide, stacked and phone compositions; long format labels; keyboard tab navigation; closing/reopening tools; focused code; all start actions; asset validation and preview lifetimes; theme/custom content separation; and a real PNG export. Run `npm run build`, `npm test` and `npm run lint`. Open Why this layout? in the application for the shorter decision guide.

The studio uses small (sm) controls and a compact header consistently. Icons describe their command: Bot for AI, LayoutTemplate for templates, FileCode2 for a starter, Info for guidance, and Download for export. Regional paper colors identify purpose, while semantic success/error colors remain separate.
