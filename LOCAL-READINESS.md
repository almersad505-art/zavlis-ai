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

SHA256 index.html: 93eb3b9ab6977a10447cd8b9d8996b18e9fc733ec867ea65095a09773754de68

## CSS refinement release

- New hero asset assets/hero-ai-profile.png, generated with built-in ImageGen; previous hero retained for history. CSS now references the AI side profile with a navy overlay, reducing emphasis on the planet scene.
- Primary CTA gradient: linear-gradient(to right, #0055ff, #9b2add).
- Central cards: 16px/18px padding, reduced typography, softer borders, uniform 42px translucent rounded icon tiles.
- Start Creating: explicit radio/name/translation grid alignment; 16px inline textarea padding and reserved counter space.
- Compact desktop sidebar: 13px type, 11px translations, 53px rows, reduced gaps.
- Focused checks: no horizontal overflow at widths 320/390/768/1536; radio centers and labels align to within 1px; Arabic RTL mobile verified; no observed console errors; inline JS syntax valid. Clarity yytrv421ps retained.
- Image prompt: Wide navy website hero; dominant blue synthetic humanoid face in side profile on right looking left, full face visible, cyan circuits and purple rim light, distant magenta mountain lake, dark left 55% negative space; no Earth globe, UI, text, watermark or logos.
- The image is a generated interpretation of the reference, not an extraction of its original artwork.
