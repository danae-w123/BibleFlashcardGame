# Companion, discovery, and menu update — September 19, 2026

## Evidence and coverage
This update uses targeted video observation and transcript review. It does not claim 50 complete videos were watched or that every live-service system has been exhaustively verified. The broader earlier research is in DISCOVERY.md, BOARD-RESEARCH.md, SHOP-BATTLE-RESEARCH.md, and MAP-BOSS-RESEARCH.md.

- [BethoStudio pet guide](https://www.youtube.com/watch?v=BByAZkcKs8g&t=1572s): visually inspected the collection screen at approximately 26:12. Owned and unavailable pet cards, equipment slots, upgrade indicators, and Collection/Summon destinations are visible. Reviewed the transcript around 25:55–30:00 for unlock, equip, upgrade, and combat-role discussion.
- [TanJinGames part 1](https://www.youtube.com/watch?v=DVhZ_qO1LA4): inspected the three-card skill decision (Ice Weapon, Shuriken Throw, Fire Weapon). At 6:39, the Lucky Treasure event uses a separate animated machine scene; at 6:54 the video returns to the board and dice. Earlier verified sections include the merchant at 6:22 and rest/training around 7:02. The new free treasure die is our original adaptation, not a claim that Rogue Legend uses this exact reward formula.
- [Official App Store description](https://apps.apple.com/gb/app/rogue-legend-roguelike-rpg/id6754965520): describes pets joining combat and permanent hero/gear development.
- [Community companion guide](https://rogue.desoware.com/guide/companions): distinguishes hero-support companions from animal pets. Our three animal companions adapt the pet concept; they do not implement the reference game's separate multi-hero support system.

## Feature comparison and implementation
| Reference concept | Previous game | This update |
| --- | --- | --- |
| Clear destination navigation | Several scattered buttons | Play / Hero / Shop / Journal, plus two run tools |
| Animal pet collection and upgrades | Absent | Three original companions; one active; persistent training |
| Small skill decisions | Existing three-choice battle rewards | Shrine tiles also offer three eligible saved choices |
| Distinct treasure event | Immediate flat reward | Animated free die, 25–50 run tokens |
| Progress rewards | End-of-run settlement | Six permanent, one-time quest milestones |
| Gear, shops, talents, varied boards, boss cadence | Already implemented | Preserved and grouped into clearer menus |

Mounts, PvP, guilds, paid summoning, limited-time events, and multi-hero support were not implemented in this update. These systems require separate design and verification; reproducing every monetization or live-service system is not necessary for this Bible game.

## Original balancing and save behavior
Dawn Dove is free to own; choose it in Hero → Companions. Eagle recruitment costs 80 earned gold; Lion costs 120. Training costs 40 times the current level, up to level 5. Every third combat round the active companion heals, adds attack damage, or grants shield before retaliation. Only one travels at a time. These numbers and artwork are original.

Treasure outcomes and shrine choices are saved before the player continues. Reloading cannot reroll the discovery or collect the same treasure twice. Quest claims are permanent and only available in the lobby. Existing saved runs and profiles remain compatible.

## Artwork
public/companions-atlas.png is an original generated 2172×724 three-cell atlas. Prompt requested a friendly painterly Greek-myth adventure style: white healing dove, golden attacking eagle, brave lion with teal/gold armor and shield glow; consistent dark teal background; no text, borders, or logos. Generated with the built-in image tool and copied unchanged. No Rogue Legend game assets were copied.

## Validation
72 automated tests pass, including companion ownership/training/combat, discovery save/reload invariants, and one-time milestone claims. Production build passes. Browser checks cover desktop and phone navigation, companion selection, milestone claiming, reload persistence, and the existing quiz flow. Account synchronization still requires a configured Supabase backend; current practice profiles save on the device.
