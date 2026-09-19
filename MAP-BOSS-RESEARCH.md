# Chapter maps and boss encounters

## Sources and observations

- [PocketHaven's store description](https://apps.apple.com/us/app/rogue-legend-roguelike-rpg/id6754965520) confirms lobby-to-dice-board runs, automatic enemy fights, three upgrade choices, buff/debuff events, minigames, shops, bosses, and permanent equipment/talent progression. This is the primary description of the overall loop.
- [BethoStudio gameplay](https://www.youtube.com/watch?v=YfTFv6jeHNA&t=1318s), sampled at 21:58, 22:08, 22:13 and 22:18–22:36: a rest-or-train event leads into a board with a central boss statue, visible shop/camp pieces and a zero-roll boss countdown. The central statue becomes a large monster before the separate automatic boss battle. Combat has its own round counter, HP bars, floating damage and acquired skills. The board-roll count and combat-round count are separate concepts.
- [TanJinGames, Kitsura gameplay](https://www.youtube.com/watch?v=8aRcFS6lef4&t=1465s), sampled around 24:25–24:37 and 25:32–25:37: three upgrade cards include a one-use resurrection; a Wise Monk event offers a skill-wheel minigame; later icy-cavern combat displays companions, stacked skills and status effects. These scenes support the broader discovery record; the monk minigame and companions are not implemented in this update.
- [QTE Gamers' hands-on account](https://qtegamers.blogspot.com/2026_08_28_archive.html) reports 30 rolls, board refreshes after laps with four persistent corners, a first-board miniboss after 15 rolls and two minibosses on the second board. Exact schedules for every later chapter are not established by this account.
- [Kavindu Priyanath's design analysis](https://www.linkedin.com/posts/kavindu-priyanath_rogue-legend-is-a-dice-roguelite-from-activity-7465060158876962816-sgj-) distinguishes closed roll-based maps from open tile-based maps, and describes special structures, elite encounters, bosses and permanent progression. It is secondary analysis, not authoritative balancing data.

This is targeted visual sampling and source review, not a claim to have watched every aspect, every chapter, or 50 full videos. Previous discovery and shop research remain in DISCOVERY.md, BOARD-RESEARCH.md and SHOP-BATTLE-RESEARCH.md. Unrelated Bloons Rogue Legends and Rogue Blight search results were excluded.

## Implemented adaptation

Six original closed circuits: coastal diamond (20 tiles), vineyard terraces (24), highland hexagon (18), oasis ring (22), citadel battlements (26), summit crown (28). These counts and outlines are design choices for this game, not copied or asserted reference-game values. Shops, camps, chests and shrines have original vector miniatures. The existing original monster atlas supplies the boss on its central plinth and the boss encounter tile.

The boss can be inspected to see its real combat trait, checkpoint schedule and victory requirements. On the final roll it blocks the landing tile; Start Battle remains mandatory. New first-chapter runs have one elite at roll 15; later chapters retain elites at 10 and 20. All chapters retain the guaranteed final boss at 30. Later elite timing is our adaptation. Existing saves retain their original 20-tile geometry and checkpoint timing. Saved rolls resume without rerolling or relocating the hero.

The chapter atlas previews all six routes. Small-screen controls use two rows so the added Maps button remains accessible. Existing equipment, merging, run skills, shop purchases, life steal, shields and Bible results remain part of the same run/progression system.

## Verification

67 engine/integration tests pass. New tests exercise all six lengths, boundary wrapping, lap refreshes, unique coordinates, save/resume, legacy geometry, checkpoint schedules, and the mandatory boss start/victory flow. Browser checks covered the board, shop miniatures, boss briefing, atlas, automatic movement and 320×568 / 390×844 / 1280×720 layouts. The 320×568 page and control bounds fit the viewport without document overflow; longer informational dialogs scroll internally.
