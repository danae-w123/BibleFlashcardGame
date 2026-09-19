# Three-lap adventure update — September 19, 2026

## Research scope

Reviewed selected gameplay segments from three videos this pass, plus official store descriptions and community guides. These are sampled observations, not a claim to have watched every video in full or all versions of Rogue Legend. The reference is PocketHaven's mobile Rogue Legend, not Rogue Legacy or similarly named games.

| Source | Observations used |
| --- | --- |
| [TanJinGames, part 3: Lancelot](https://www.youtube.com/watch?v=PLsanHqyAAs) | Opening: character/pets centered above START, compact bottom navigation. At approximately 5:02: two separate enemies, individual health bars, hero and pets on the left. |
| [TanJinGames, part 4: Kitsura](https://www.youtube.com/watch?v=8aRcFS6lef4) | Opening: chapter and prominent START. Around 0:40: equipped hero, six gear slots, item levels, inventory and Merge. Around 0:45–0:50: blacksmith, selected base/material slots, stat increase preview, merged-item reward. |
| [BethoStudio, pet guide #2](https://www.youtube.com/watch?v=BByAZkcKs8g) | Around 17:59–18:04: equipped hero and inventory, Equipment/Hero tabs and workshop. Around 26:20–26:40: pet collection, summoning, individual pet reveal. Around 26:55: talent milestones. |
| [Official App Store listing](https://apps.apple.com/us/app/rogue-legend-roguelike-rpg/id6754965520) | Pet training and combat, collecting/upgrading gear, three-way skill choices, shops and minigames. |
| [Official Google Play listing](https://play.google.com/store/apps/details?id=com.pockethaven.roguelegend) | Confirms the correct mobile game and overall board/roguelike progression. |
| [Community starter guide](https://www.reddit.com/r/RogueLegendRPG/comments/1srvlbj/rogue_legend_staring_guide_tips/) | Secondary, version-dependent explanation of chests, rarity merging, enhancement resources and pet eggs. Prices and recipes were not copied. |
| [Community skills reference](https://roguelegend.wiki.gg/wiki/Category%3ASkills) | Cleave and pet-related combat skills. Our splash damage formula is an original adaptation. |
| [QTEGamers August gameplay review](https://qtegamers.blogspot.com/2026/08/) | Describes changing board encounters, multiple enemies and a 30-roll run counter. |

## Implemented changes

1. Exactly three board laps for new runs. End of lap one is a camp, lap two a mini-boss, lap three the main boss. No fourth lap is possible.
2. Dice animate their full rolled value; movement stops at mandatory checkpoints, with an explanation when fewer spaces are traveled. Bosses cannot be skipped.
3. Two- and three-monster encounters, separate health bars, selectable targets, and attacks from surviving monsters only. Every fight still waits for Start Battle.
4. Sweeping Light (Cleave): 20/40/60% splash damage to other living enemies. Charged Radiance also splashes 50%.
5. A dedicated pet sanctuary shop, accessed through a simple two-choice Shops menu.
6. Egg hatching with a saved reveal. Uncollected companions are equally likely; no duplicates until all three are owned, then eggs yield food. One starter egg; run rewards provide more.
7. Pet food from battles and the shop; permanent companion training with a visible level-dependent cost.
8. Common, Rare and Epic equipment shop choices, with stat comparisons and explicit purchase confirmation.
9. Bulk equipment leveling with exact gold/ore cost preview, respecting rarity caps and available resources.
10. Recycling one spare Common/Rare gear copy into ore. Last copies and protected items cannot be recycled.
11. A direct character-class menu showing distinct class outfits and abilities.
12. Guaranteed Bible checkpoints: at least four opportunities in every run, even with high dice rolls.

The user's three-lap rule intentionally replaces the reference game's observed roll counter. Prices, skill balance, guaranteed checkpoints, duplicate-free egg collection, bulk leveling and recycling are original usability/balance choices, not claims of identical reference mechanics. Existing merging, equipment sets, manual battle start, class abilities, pets in combat, board shops, life steal and shields remain available.

## Persistence and validation

Existing active saves migrate to three laps while retaining resources and current encounters. A saved dice movement completes before conversion. Older saves beyond lap three resume on the final lap rather than losing their progress immediately. An already active old boss encounter remains finishable.

Automated validation: 81 passing tests covering all six chapter paths, checkpoint boundaries, saved dice, combat groups, target selection, splash damage, single reward settlement, egg/food persistence, costs, upgrade caps and protected recycling. Production build passes. Browser checks cover welcome/continue, saved run restoration, egg hatching/equipping, manual battle entry, independent target selection surviving reload, and the group arena at 390 × 844. The battle, map and Start Battle control fit within the phone viewport.

Cross-device saves still require the existing Supabase configuration. This update does not change that deployment prerequisite.
