# Smart Match catalog and ranking

Edit `data/tools.json`, then run `node scripts/sync-tools.cjs`. This validates the required schema and builds the browser snapshot `tools-data.js`. Both the browser and Node tests use the same catalog; `smart-match.js` contains no provider preference lists. Text input only proposes editable task buttons. Ranking requires `match(text, catalog, {confirmedTasks: [...]})`; omitting that array returns a review draft with no recommendations. Only confirmed IDs and explicit budget/language choices affect ranking. `?tasks=...` restores validated selections for review; the prompt is never added to the share URL.

Run `node scripts/test-smart-match.cjs` for the 30 request fixtures. Full historical browser/download evidence is saved in the workspace under `zavlis-recovery/SMART-MATCH-150-REPORT`.

Each eligible task has three ranked alternatives. Capability eligibility is checked before ranking. Specialists precede general tools; within each group the score uses task 50, budget 20, language 20, specialization 10, then alphabetical name order. The score measures catalog fit, not provider quality. Arabic support is feature-scoped. English receives neutral language points because English support is not a verified catalog field. Unknown facts never count as confirmed free access or Arabic support.

Use the exact string `unknown` for unverified facts, never an invented value. A free-plan starting price of zero does not establish commercial rights or access to every feature. Preserve scope notes and official evidence URLs. Legacy metadata remains for traceability; current matching uses `free_tier`, `arabic_support`, `price_from`, `arabic_tasks` and `capabilities`.

`affiliateUrl` is an intentionally empty editable slot. New initials icons are placeholders, not official provider logos. Archived records remain in the directory and are excluded from matching.

The parser uses explicit Arabic/English task vocabulary and selected Saudi expressions. It supports multiple tasks and specific negation forms; it is not a general semantic language model. Extend fixtures and vocabulary together when adding a new phrasing. `subtasks.js` defines the child tasks; every catalog tool has `subtasks` and per-tag `subtask_sources`. Exact subtask matches receive 50 task points, category-only fallbacks receive 25, and documented subtask matches rank first. Unknown feature-level free access and Arabic support are not inferred from a provider's general plan or language support.

Design styles and Clarity are outside this change. The user accepted the existing empty Code Lab sandbox as sufficient. The subtask change uses only the ten user-supplied fixtures in `scripts/subtask-cases.json`, run with `node scripts/test-subtasks.cjs`; no browser tests or new reports are part of this change.
