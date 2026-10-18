# Zavlis AI V4 — functional changes

The existing dashboard CSS and artwork are unchanged. Smart Match uses transparent local rules, not an AI model or tested provider rankings.

`smart-match.js` detects video, voice, image, writing, code, design and music in Arabic/English. Each detected task receives a separate primary tool. It retains category alternatives in Copy/Download. Output language follows Arabic letters in the request; otherwise it is English. Unknown tasks request clarification. These rules are limited and do not guarantee understanding every natural-language request.

`data/tools.json` is the editable catalog. There are 53 records, including one inactive archived Sora record. Unknown prices are empty strings; unknown Arabic support is `null`. A free plan is not a promise that every model, task or commercial use is free. Sources and restrictions are stored with confirmed metadata.

The Free budget option prefers documented free tiers. If that provider is already assigned to another task, matching still covers the remaining tasks using separate alternatives, with explicit warnings where a free tier is unverified. It does not claim those alternatives meet a strict zero-cost requirement.

To add an affiliate link, fill that tool's `affiliateUrl` with its real HTTPS URL, then run from this folder:

```powershell
node scripts/sync-tools.cjs
```

The synchronizer validates the catalog and updates `tools-data.js`, allowing the browser to work without fetching a database. Affiliate links are labeled and use `rel="sponsored noopener noreferrer"`. Empty slots contain no fabricated links.

Eight existing brand assets are reused. Other icons are explicitly identified as initials placeholders, not official logos. Sora remains visible as a discontinued archived item and is never recommended. Official discontinuation source: https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation

Twenty existing content pages were copied from the local pre-launch reference with their content and bilingual templates retained. Site navigation and canonicals now use this repository's GitHub Pages domain. This does not configure redirects on the old ChatGPT Sites host, nor establish that the local reference exactly matches its latest live content. Historical article claims have not all been re-researched.

`analytics.js` is shared by all 21 content pages. Project `yytrv421ps` only loads on the existing production HTTPS hostname and `/zavlis-ai/` path after analytics consent. It is deliberately disabled on local previews. Consent can be withdrawn through Analytics preferences. Blocked storage prevents remembering the choice across navigation. Workspace and quick-form content are masked. Previous provider cookies are not manually deleted. Local consent tests are not proof of live Clarity ingestion.

The V4 report and original 20+50 results are in the workspace's `zavlis-recovery/V4-REPORT/`. Four historical hero-text assertions fail against the design approved before V4; two complete iframe-isolation assertions remain blocked by the browser inspector. No V4 deployment was performed.
