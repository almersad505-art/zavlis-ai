# Zavlis AI V3 — Reference dashboard release

Date: 2026-10-17 (Asia/Riyadh).

## Result

Reference-based three-column bilingual dashboard implemented in index.html, with dashboard.js and assets/. Include these files together when transferring.

- Sidebar: Smart Match, Media Lab, Image Studio, Video Starter, Prompt Studio, Code Lab, Compare Tools, Guides, My Projects and Upgrade to Pro.
- Navbar: Home, AI Tools, Compare, Guides, For Students, For Business, About, scoped search, language selector, theme toggle and session projects.
- Futuristic hero, five workspace cards, six popular tools, featured guides, Start Creating and Trending Now panels.
- Media Lab is a launcher for the existing local text preparation tools, not a new AI generation service.
- Trending entries are editorial picks, not measured popularity rankings. My Projects stores up to 10 outputs in memory for this page session only. Plans dialog discloses that no paid plan is available.
- Clarity yytrv421ps and opt-in/decline retained; workspace, quick inputs and session dialog are masked. Local preview does not send analytics.

## Verification

- Inline scripts and dashboard.js syntax PASS.
- Previous visual review at reference viewport 1536x1024: close reconstruction of the requested composition, not a pixel-identical rendering. Generated hero artwork, fonts and several icon/logo treatments differ from the reference.
- Arabic/English at widths 320,390,768,1536: no horizontal document overflow; images loaded.
- Search for Claude filters to Claude. Trending Guides tab shows three guide links.
- Start Creating successfully produced Smart Match recommendations; Media Lab launcher visible.
- Code Lab script-tag input escaped; iframe sandbox has no permissions; no console errors in focused checks.
- Prior 50 acceptance checks were not repeated.

## Existing-site links

Compare, information and guide destinations still use the original ChatGPT Site. They are links, not copied local pages.

## Hero artwork

Built-in ImageGen used. Saved asset: assets/hero-final.png. Final prompt: futuristic navy science-fiction hero with blue Earth and a humanoid profile at right, neon cyan/violet orbits, mountains and reflective magenta lake; left 48% dark negative space; no text, UI, logos or watermark.

SHA256 index.html: 513aa071772a404d4d4977b92029bdf84d8e2276f41656e3ca8c281096449f52
