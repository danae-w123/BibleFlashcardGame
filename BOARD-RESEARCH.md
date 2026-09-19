# Board movement research and implementation — September 19, 2026

## Evidence reviewed in this pass

- Official PocketHaven listing: https://play.google.com/store/apps/details?id=com.pockethaven.roguelegend — board-based runs, dice, tile encounters, choices and permanent progression.
- Official iOS listing: https://apps.apple.com/us/app/rogue-legend-roguelike-rpg/id6754965520 — corroborating run structure.
- TanJinGames footage: https://www.youtube.com/watch?v=DVhZ_qO1LA4 — sampled frames around 6:15–7:02. At 6:57, two dice show a total of 12 above the board; a large roll control sits below; a side meter reads 26/30; tiles form an angled route with prominent corner landmarks and a moving hero. Nearby samples show shop, treasure, a separate two-dice jail event, and rest/train. The jail dice event is not confused with the normal movement roll. Sampled playback/frames, not a full watch.
- ATG footage: https://www.youtube.com/watch?v=G75-3oDxEIw — sampled around 4:38–5:03. Desert board with raised tiles, corner structures, campfire landmark, enemy pieces, a large two-dice button, speed control, and a separate combat view. Sampled footage, not a full watch.
- Firsthand review: https://qtegamers.blogspot.com/2026_08_28_archive.html — reports four fixed corners, ordinary tiles refreshing after a circuit, 30-roll survival and stage-dependent elite timing in version 0.573. This is a player's observation, not an official numeric specification.

## Changes

Two independently rolled d6 dice now determine movement (2–12 spaces). The actual saved values drive a one-second tumble, a readable result pause, numbered path previews, one hop per space, and an encounter announcement. The roll is saved before animation, so reloading never rerolls an already planned move. Reduced-motion preferences skip tumbling/hopping and shorten delays.

The six chapter landscapes now contain a closed diamond-shaped circuit with four larger corner landmarks. Fresh runs generate a seeded board, and crossing the start refreshes ordinary tiles while retaining corner types. Existing runs remain loadable and adopt the refreshed layout on their next lap. The countdown shows remaining rolls before the final boss.

The Bible adaptation retains automatic progression, guaranteed verse checkpoints, existing scheduled shops/elites, player-started battles, and player decisions. It does not claim exact reproduction of all Rogue Legend minigames, economy, camera movement, or version-specific scheduling. No Rogue Legend art, music, or code is reused.

## Validation

60 automated tests pass, including saved dice/no reroll, 2–12 bounds, counted wraparound, stable corner types, deterministic lap refreshes, checkpoint visibility, old-save compatibility, and a full run. Browser checked actual 1+3=4 dice faces and sum, loop rendering, landing into an elite encounter, and 390×844 battle layout with no page overflow.
