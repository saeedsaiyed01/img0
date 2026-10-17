# SEO changes and deployment

This change updates crawl signals, metadata, structured data, and explanatory content. It preserves the existing tool engines and homepage design.

## Changes

- Shared canonical origin: `https://www.img0.site`, matching the host currently serving production. Canonical page URLs include trailing slashes.
- Unique page titles and descriptions for home, directory, privacy, and all 16 tools. Page title branding is applied once, with matching social metadata.
- One generated robots.txt source, permitting Next.js rendering assets.
- A sitemap containing all 19 canonical pages, including the tools directory, without artificial build-time modification dates.
- Tool-specific explanatory content, instructions, limitations, FAQs, and related links. Visible FAQ text and JSON-LD use the same data.
- Visible breadcrumbs with BreadcrumbList schema, shared Organization/WebSite identity, and accurate software features.
- More precise local-processing claims and a service-worker cache version bump for the updated pages.

ICO and JPG copy describes the existing engines. This PR does not include the separate image-export fixes, sample flow, or UI redesign.

## Validation

Run `npm ci`, `npm run build`, and `npm run check:seo`. The SEO check inspects the exported HTML, metadata, sitemap, robots, related links, and visible/schema FAQ parity across all 19 pages. Use `npm.cmd` in PowerShell if `npm.ps1` is blocked by execution policy.

The existing static-export configuration emits a warning about custom response headers; the hosting platform must supply those headers. This PR does not change that configuration.

Verified on this branch: production build and SEO checks pass (19 pages, 16 tools, 65 matching FAQ entries). Lint passes for all changed SEO source files and the SEO check script. The full repository lint command still reports seven existing errors in the unchanged `Base64Tool.tsx`, `PdfTool.tsx`, and `FormatConverter.tsx` files, plus 17 warnings. Those tool-engine fixes are outside this SEO-only change.

## After deployment

1. In Vercel, keep `www.img0.site` as the served primary host and make the apex-to-www redirect permanent (301/308). This account setting is outside the repository.
2. Confirm canonical www page URLs return 200 directly and apex variants redirect toward them.
3. Check `/robots.txt` permits `/_next/`, and `/sitemap.xml` includes all 19 final URLs.
4. Submit the www sitemap in the existing Search Console domain property. Inspect home and representative tools to compare declared and Google-selected canonicals and verify rendered resources.
5. Request reindexing for key updated pages and compare page/query performance over subsequent 28-day periods.

No deployment, Search Console submission, or skill installation is included. FAQ markup describes visible content; it does not promise Google FAQ rich results.
