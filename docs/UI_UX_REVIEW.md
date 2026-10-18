# img0 UI/UX review and enhancement plan

Reviewed October 17, 2026 against the local repository.

## Recommendation

Keep the restrained typography, light surfaces, and privacy positioning. Shift the experience toward completing an image task quickly: find a tool, choose a file, see the result, download confidently. Fix result correctness and confusing states before expanding the visual design.

This is an expert inspection, not user research or a conversion study. Priority reflects task impact and implementation evidence; revenue and conversion effects have not been measured.

## Scope and evidence

- Read the landing page, tool directory, shared tool page, navigation, footer, uploader, all 12 tool implementations powering 16 routes, privacy copy, and offline implementation.
- Ran the local Next.js development app. Inspected desktop layouts at 1280/1440 px and responsive layouts at 390 × 844 px using browser snapshots and DOM measurements.
- Uploaded a generated 640 × 480 PNG to compression and ICO conversion. Confirmed the directory's search result for `favicon`.
- Initial preview snapshots timed out; a newly opened tab with explicit tab IDs worked. Browser inspection then continued successfully.
- Did not perform a full export matrix, assistive technology audit, real phone testing, AI model processing, production performance benchmarking, or production offline validation. These remain release checks.

## What to retain

1. A useful, differentiated promise: image processing on the user's device.
2. A readable visual foundation: Geist, slate typography, rounded panels, and consistent icons.
3. Search, multi-file PDF ordering, compression comparisons, social presets, and mobile download bars already provide useful building blocks.
4. The tool registry and shared page make improvements reusable across all routes. Implement a common workspace rather than redesigning 16 pages independently.

## 1. Discovery and navigation — P1

**Current experience:** The homepage offers a generic “Explore the Tools” CTA. Only background removal, PDF, and Base64 receive featured treatment. The directory shows 16 large cards, starting with Base64, and categories appear as codes such as `ENC-01` rather than usable filters.

**Evidence:** At 390 px, the homepage's first tool card begins around y=844; its total page height is about 5,131 px. At 1440 px, directory cards begin around y=462 and the first card is about 356 px tall. These are local rendered measurements, not universal device values.

**Specific defects:**

- Searching `favicon` returns “No tools found” despite the existing `/tools/favicon-generator/` route. Search covers title, description, and category, while the displayed title is “Make App Icons.”
- “Back to Tools” and the related panel's “View All Tools” both link to `/`, not `/tools`.
- “Request a Tool” has no action attached.
- Navbar “Browse Tools” and “Get Started” share a destination, adding duplicate emphasis.

**Enhancement:** Put search and direct task shortcuts near the homepage headline: Compress, Convert, Remove background, Crop, Make PDF. Add directory filters: All, Convert, Edit, Optimize, PDF, Developer. Use “Favicon generator,” “SVG to JSX,” and “Crop image” as recognizable names; maintain synonyms such as app icon, React, resize, and reduce file size. Make empty results offer Clear search and useful alternatives. Define a real request destination before retaining that action.

**Acceptance:** `favicon`, `app icon`, `SVG`, and `reduce size` find the intended tools; all tools-directory links lead to `/tools`; search is labeled, clearable, and announces result counts. Category filters work by keyboard. Validate proposed popular-tool order with usage data rather than assuming it.

## 2. Workspace hierarchy — P1

**Current experience:** Every tool has a large framed title panel, two technology/privacy badges, large vertical gaps, then the workspace. Lower sections repeat trust claims and a generic comparison table. The tool is presented like another marketing page.

**Evidence:** Compression upload begins around y=428 on a 1280 px desktop view and y=593 at 390 px. On mobile its format choices begin around y=1207 in the initial state. The fixed disabled download action is visible while useful configuration remains below the fold.

**Enhancement:** Use a compact breadcrumb, title, one-line outcome, and a single “Files stay on this device” message. Place a large preview beside a compact settings/results panel on desktop. On mobile show file selection first, then preview, settings, and a state-aware download action. Keep concise tool-specific help below the workspace; reduce repeated marketing sections.

**Acceptance:** At 390 × 844, the initial file-choice button is fully visible without scrolling. At 1280 × 800, the main action and essential settings are visible in the initial state. Hide the mobile export bar until a file is selected; account for its actual height and device safe area. Check content and toasts against one- and two-button bars.

## 3. Upload and recovery — P0/P1

**Evidence:** The shared uploader handles accepted files but has no shared rejection feedback. Several consumers accept generic `image/*`, broader than their decoding/export capabilities. Multi-file remove controls are 24 px and become visible only on hover. Preview object URLs are created during render without corresponding cleanup.

**Enhancement:** Make “Choose image” a visible primary button, with drag-and-drop as a secondary instruction. Show supported formats and file counts before selection. Add inline rejection messages for unsupported files and too many files, with a direct retry. Validate decoding separately from file extension. Provide Replace and Remove as real, named controls; expose actions on touch and keyboard focus. Manage preview URLs outside render and release them when replaced.

**Acceptance:** Unsupported and corrupted fixtures produce actionable messages without leaving a spinner stuck. Keyboard users can select, replace, and remove files. Replacing a failed file resets the error. Repeated replacement releases unused preview URLs.

## 4. Result correctness and export confidence — P0

### Compression

**Confirmed:** A generated 3.9 KB PNG became 9.3 KB. The UI labeled the output “Compressed” and displayed “Reduced by -136%.”

**Change:** Show “Output is 136% larger” in a neutral/warning state; offer Keep original or a supported smaller format. Hide or explain the quality slider for PNG because browser canvas PNG encoding does not apply its quality argument. Use actual output dimensions, format, and byte size in the result summary. If conversion would flatten transparency, explain that before export.

### ICO and favicon export

**Confirmed:** The browser returned `image/png` with PNG signature bytes `[137,80,78,71,13,10,26,10]` when the implementation requested `image/x-icon`. The tool still announced ICO and “Ready to Export.” The converter renames that output with an `.ico` extension. The favicon package uses the same encoding approach.

**Change:** Implement actual ICO container encoding, or remove the ICO promise until supported. Check output MIME and file signatures instead of trusting the requested canvas format. Renaming a PNG is not reliable ICO generation.

### JPG conversion

**Source-confirmed:** The converter calculates `JPEG` for `image/jpeg` but conditionally renders its quality slider only for `JPG` or `WEBP`. JPG conversion therefore misses that setting.

**Change:** Drive capabilities from MIME types rather than presentation strings. Rename “Estimated Size” to “Output size” once an actual blob exists. Show a processed preview, not only the original upload preview. Clear stale output and disable export during replacement/reprocessing. Add decode, null-blob, and canvas error handling.

**Acceptance for this entire group:** Verify each claimed export using MIME, signature bytes, dimensions, and successful reopening in an independent consumer. Never announce a smaller result when it grew. Settings must visibly affect supported formats, and unavailable controls must explain why.

## 5. Processing feedback and AI tools — P1

**Source-confirmed:** Background removal uses a generic spinner/message without model-download progress. Blur runs foreground segmentation again on every blur change. The processing functions do not consistently guard against old async work overwriting newer settings or a replacement file.

**Enhancement:** Distinguish Preparing model, Processing image, and Ready. Show download progress when available, otherwise honest stage text. Explain the first-use model download and device-dependent processing. Cache the foreground mask per image so blur changes only redraw the result. Debounce expensive settings and ignore stale jobs; add cancel/retry behavior where supported.

**Acceptance:** Rapidly changing settings or replacing/resetting an image cannot publish an obsolete result. Download corresponds to the current settings. Failed model loading offers Retry and useful guidance. Do not invent remaining-time estimates.

## 6. Mobile and accessibility — P1

**Source evidence:** Watermark positioning uses mouse handlers without touch/pointer equivalents. Multiple sliders use nearby visual text without programmatic labels. Icon-only links and PDF reorder/remove controls lack descriptive names. Several links wrap buttons. Motion includes indefinite decorative animations without a shared reduced-motion policy.

**Enhancement:** Use pointer events for watermark dragging, plus keyboard positioning and numeric/preset alternatives. Label inputs, name icon actions, expose selected format/preset states, and announce processing/errors. Use one interactive element per action. Add a skip link and consistent focus-visible treatment. Prefer 44 px touch controls, especially small PDF and file-removal actions. Respect reduced motion across CSS and Motion components.

**Acceptance:** Complete select → edit → export with keyboard only and with a real touch device. Check focus after replacement/reset, screen-reader names and status announcements, 200% zoom, portrait/landscape, 320/390/768/1280 px widths, normal-text contrast of at least 4.5:1, and UI/large-text contrast as applicable. This review did not measure contrast or test a screen reader.

## 7. Trust and language — P0/P1

**Source-confirmed contradictions:** The homepage says “Tools without the telemetry,” while the root layout mounts Vercel Analytics and the privacy page acknowledges analytics. “Zero server interaction” overstates local image processing. “Perfect edges,” “zero latency,” “0ms,” “No File Size Limits,” and “functions perfectly” create expectations the implementation cannot guarantee. “Offline Ready” is a static footer statement rather than detected readiness.

**Enhancement:** Retain the precise promise “Your images are processed on your device.” Describe anonymous usage analytics accurately. Replace performance absolutes with “No image uploads; processing speed depends on your device.” Explain first-use AI downloads and verified offline readiness per tool. Correct awkward labels such as “Privately Secure” and generic technical badges such as “WebAssembly / Speed.”

**Offline evidence and limits:** The service worker skips cross-origin requests and its precache list omits compression, social resize, and watermark pages. Runtime caching can cover visited pages, so omission alone does not prove they fail offline. Cold-start AI model assets and production route/asset caching need explicit testing before making blanket promises.

**Acceptance:** Marketing, privacy policy, actual analytics configuration, and detected offline state agree. Validate offline use on a production build with required assets cached, and provide useful first-use offline guidance when they are not.

## 8. Tool-specific enhancements — P2 after shared fixes

| Tool | Enhancement | Why it matters |
| --- | --- | --- |
| PDF | Page thumbnails, orientation/margins, keyboard-accessible reorder, meaningful file name | Users can verify the document before downloading. Keep existing up/down controls as an alternative to drag. |
| Social resize | Reposition subject, Fit/Fill choice, safe-area guides, select desired presets | Automatic center cropping can cut off the subject. |
| Crop/rotate | Dimensions, explicit aspect-ratio selection, transparency preservation, undo | Output becomes predictable; current export fills the canvas white. |
| Watermark | Touch/keyboard positioning, alignment presets, repeat option | Positioning becomes usable beyond desktop mouse input. |
| Join images | Append files, visible reorder/remove list, consistent fit/alignment, one-image guidance | Current selection replaces the file list and requires at least two images to process. |
| Favicon | Square crop/padding, small-size preview, verified ICO and installation snippet | Non-square source images should not be blindly stretched. |
| Base64/SVG | Paste input where appropriate, output variants, readable code, real copy success/failure | Current clipboard success is set before the clipboard promise resolves. |

## Visual design direction

- Keep the light slate foundation; use a single accent for selected states, focus, and primary workflow cues. Category color may remain as a supporting cue with a text label.
- Separate marketing and workspace typography. Large landing headlines can coexist with compact 28–36 px desktop tool headings and 24–28 px mobile headings.
- Define reusable spacing (4/8/12/16/24/32/48), panel radius (12–16 px), input/button heights, focus rings, and state colors. Current 24/32/40 px rounding and varied shadows can be simplified.
- Replace decorative icons in oversized homepage cards with small before/after demonstrations where they help explain the tool. Provide an optional sample image so a new visitor can try a tool immediately.
- Make card titles/outcomes do the work. Remove category serial numbers and hover-only “Launch Tool” text. Use a compact directory that reveals more choices in one viewport.
- Fix the shared comparison table's first row: its two `td` elements use `display:flex`, causing the cloud cell to render beneath the img0 cell in the same column. Prefer reducing this generic comparison content altogether.

## Implementation roadmap

Estimates are indicative engineering days for one developer, excluding final real-device/user validation. Re-estimate after technical investigation; phases can be released separately.

| Phase | Scope | Estimate | Exit criteria |
| --- | --- | --- | --- |
| 1 — Correctness and trust | Compression states, true ICO or withdraw claim, JPG settings, stale-export protection, wrong links, inactive action, search aliases, truthful copy | 3–5 days | Confirmed defects have reproducible passing checks; no unsupported export or misleading result state |
| 2 — Shared workspace | Compact tool header, reusable uploader/status/result/action components, mobile action behavior, labels/focus/keyboard, pointer watermark controls | 5–8 days | One consistent workflow across all tool engines; keyboard and mobile acceptance checks pass |
| 3 — Discovery and visual refinement | Homepage task shortcuts/sample, category filters, compact directory, naming consistency, token-based visual cleanup | 3–5 days | Users can identify and launch intended tasks without assistance; layout checks pass at target widths |
| 4 — Advanced workflows | AI model stages/mask reuse, social crop control, PDF preview, cross-tool handoff, verified offline status | 5–10 days | Each feature has its own task-based acceptance test; local files are released when the user clears the session |

Pilot Phase 2 in Compress Image first: it exercises file input, settings, live processing, before/after, errors, and downloads. Then migrate FormatConverter and the remaining engines. Keep route URLs stable while improving names and navigation. A later “Continue in Crop/Compress” handoff can reuse the current image in memory with an explicit Clear action; do not add persistent storage by default.

## Validation and success measures

1. Establish a baseline before redesign: tool-find time, first-file time, successful export rate, errors, and mobile completion. Use only disclosed aggregate events; exclude image contents, file names, and code payloads.
2. Conduct a small formative study with 5–8 people across casual and developer tasks. Example tasks: reduce a photo below a size target; make a favicon; assemble/reorder a PDF; position a watermark on a phone; find SVG-to-JSX. This finds usability issues; it is not statistically conclusive.
3. Proposed usability targets: at least 80% unassisted completion for these tasks in the study, no critical keyboard blockers, no incorrect MIME/signature exports, no stale downloads, and clear recovery for every known failure state. Treat targets as goals, not measured outcomes.
4. Run a fixture matrix: opaque/transparent PNG, JPEG, WebP, SVG where supported, corrupted file, extensionless file, large dimensions, multiple files, unsupported input, rapid replacement, and output larger than input.
5. Validate Chrome, Firefox, Safari/iOS and Android on real devices where available. Test AI first load and cached load separately; test production offline behavior separately from development mode.

## Files to start with

- `src/app/tools/[tool]/page.tsx`: compact shared header, navigation, help and related tools.
- `src/components/ui/FileDropzone.tsx`: shared file acceptance, rejection, preview lifecycle, accessible controls.
- `src/components/tools/CompressorTool.tsx`: result state, PNG capabilities, async freshness.
- `src/components/tools/FormatConverter.tsx` and `FaviconTool.tsx`: output verification and supported formats.
- `src/app/tools/page.tsx` and `src/config/tools.ts`: aliases, filters, naming and order.
- `src/components/layout/Navbar.tsx`, `Footer.tsx`, `src/app/page.tsx`, `src/app/layout.tsx`: hierarchy and consistent trust language.
- `src/components/tools/WatermarkTool.tsx`: pointer and keyboard positioning.
- `src/components/PwaRegister.tsx`, `public/sw.js`: verified readiness and offline behavior.

No application source was changed during this review.
