# img0.site

A privacy-first, offline-capable image utility hub. All processing happens in your browser.

## Features

- **Privacy First:** No server uploads.
- **Offline Capable:** Works without internet.
- **Tools:**
  - **Image to Base64:** Convert images to Base64 strings.
  - **Image Conversion:** Convert to PNG, JPG, WebP, ICO.
  - **PDF Generator:** Convert images to A4 PDF documents.
  - **Favicon Generator:** Create full favicon packages.
  - **SVG to JSX:** Convert SVGs to React components.
  - **Image Editor:** Crop and rotate images.

## Architecture

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Registry Pattern:** Tools are defined in `src/config/tools.ts` and rendered dynamically via `src/app/tools/[tool]/page.tsx`.
- **Engines:** Reusable components in `src/components/tools/` power multiple tools (e.g., `FormatConverter`).

## Development

```bash
npm install
npm run dev
```
