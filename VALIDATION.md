# Validation record — rebuilt run progression

Validated September 18, 2026. This record supersedes the earlier manual-roll/mastery-gate version.

## Automated checks

52 tests pass: 30 retained content/combat/equipment primitive regressions, 21 tests for the new run and forge rules, and one complete finite-run integration test. Older primitive tests intentionally describe legacy helpers; the app routes progression through `run.mjs`.

The new checks cover stable saved movement; 30-turn limits and forced elite/final-boss encounters; zero-health defeat without automatic revival; a one-use acquired revival; reward settlement exactly once; separate run tokens and permanent gold; deferred XP and loot; permanent upgrades carrying into the next attempt; temporary skills resetting; advanced skill prerequisites; protected/equipped fusion ingredients; exact-copy breakthroughs; equipment refund accounting; weapon-specific charged ultimates; shield/regeneration enemy traits; and camp skill training. The integration test completes a chapter, awards its learning milestone, returns to the lobby and begins a fresh attempt with its permanent reward retained.

All seven source study files were extracted: 1,140 original questions, 560 distinct prompt/answer/reference combinations and 19 explicit memory passages. Content tests cover grading, reference variants, source answer alternatives and all chapter/mode combinations.

## Browser checks on the rebuilt app

- Female practice hero started in the character lobby. Initial skill selection led to automatic movement, Bible trials, automatic fights and board shops without repeated Roll clicks.
- Correct answers, skipped answers and their exact references appeared in independent Bible reporting.
- A run shop spent temporary tokens without reducing permanent gold; purchased offers became sold out.
- A first test attempt settled 45 gold. Spending 30 gold on Might raised permanent attack by 2; the upgrade and remaining 15 gold survived reload and carried into the next run.
- A chest provided gear that could be equipped and protected; the fusion preview showed missing ingredients and respected protection.
- The second attempt continued through turn 11 and four battle victories, including an elite. Its retirement paid 135 gold, 220 XP, 20 shards and five chests. The lobby showed hero level 3 and the reward was not awarded again when reopening results.
- The mobile battle was visibly embedded above the board. A paused elite battle reloaded at round 1 with the same 98/100 hero HP, 106/106 enemy HP, 55% ultimate charge and paused state. Resume and 2x speed led to victory and skill selection automatically.
- At a 390px viewport (375px content width with scrollbar), the inspected battle and lobby had no horizontal page overflow. Battle art, controls and board remained readable.
- No browser console errors were reported during the checked rebuilt flow.
- Original exploration/battle audio switches are implemented locally. The user previously approved the exploration music; no claim is made that the browser tool listened to synthesized audio.

## Build and limits

Production Vite build passed. The packaged site loaded in the browser at port 4173 with no console errors. Its 1440px desktop layout was inspected without horizontal overflow. The index, public configuration, both hero images, monster art, board art, JavaScript and CSS all returned HTTP 200. Both ZIP archives passed integrity checks. The editable non-module config script is intentionally copied as a public asset; Vite's notice that it is not bundled is expected. Deployment uses relative paths for GitHub repository hosting.

Practice progress is saved on the current device. Supabase signup, email confirmation, row-level account isolation, concurrent-device conflict handling and cross-device resume are not verified live because public project configuration is blank. The connected GitHub account returned no accessible matching repository; no public deployment is claimed.

The requested 50-video review is not complete. See `DISCOVERY.md` for methods, specific observations and source limitations. This build does not reproduce every Rogue Legend subsystem.
