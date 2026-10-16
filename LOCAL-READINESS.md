# Zavlis AI V3 — Local readiness

Date: 2026-10-17 (Asia/Riyadh).

## Delivery state

- Changes are local only. No commit, push, Pages publication, domain change or paid service was performed for this update.
- Updated following the user-supplied Clarity ID yytrv421ps: consent-gated integration is included locally. The remote script only loads after opt-in on the published GitHub Pages host and path.
- index.html remains self-contained: CSS, JavaScript and the SVG brand asset are embedded.
- Existing comparison, guide and information links still point to the original ChatGPT Site; those pages are not duplicated in this project.

## Changes

- Added min-width constraints and safe wrapping for grid content and output.
- Improved mobile navigation and 44px touch targets; input/select text is 16px to avoid mobile focus zoom.
- Allowed header height to grow with content and kept decorative hero layers from intercepting clicks.
- Removed the unused redirect-based locale handler and inline image error handler.
- Added strict-origin-when-cross-origin referrer policy.
- Preserved escaped generated HTML, textContent output, sandboxed preview iframe, restrictive generated-page CSP, and noopener/noreferrer external links.

## Focused verification

- Inline JavaScript syntax: PASS (4 scripts).
- Browser layouts: Arabic RTL and English LTR at 320, 390, 768 and 1440 pixels; no document horizontal overflow. Three desktop columns and stacked mobile layout confirmed.
- Code Lab input containing img/onerror and script markup is escaped in generated HTML; no injected image in the output. Preview sandbox remains empty (no permissions granted).
- Browser console errors: none observed in the inspected session.
- Internal fragment targets: no missing targets. External blank-tab links all include noopener.
- Clarity script is created dynamically only after analytics consent; ad storage is denied. Workspace content has data-clarity-mask="true". Local previews are excluded.
- The previous 50 acceptance checks were not rerun.

This is a focused source and browser review, not a penetration test or a guarantee of zero vulnerabilities. Production collection has not been verified: this update has not been pushed or published. Clarity data must be verified after publication and visitor opt-in.

## Transfer

Publish index.html as the site root when explicitly requested. This file alone runs the workspace; this note is not a runtime dependency.

SHA256 (index.html): ad6efbb71e8fe1824b90c9ad017532e4181c754a728a431cb76eacaf98e45199

## Clarity integration update

- Project ID: yytrv421ps (public identifier supplied by user).
- Bilingual opt-in/decline and analytics preferences controls; choice stored locally when browser storage is available.
- No prompts or generated results are deliberately sent as custom events. Workspace content is masked for recordings.
- Revoking consent sends consentv2 denied and reloads without the tracker. Existing provider cookies are not manually cleared.
- The previous responsive/security checks remain applicable to unchanged application logic. The added integration received syntax and isolated consent-flow checks; production collection remains unverified.
