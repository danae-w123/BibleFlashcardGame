# Rogue Legend reference and adaptation

The current detailed source ledger is `DISCOVERY.md`. It distinguishes full transcript reviews, sampled video frames, rendered web-page reads and search excerpts. The requested 50-video review remains incomplete; do not treat located videos as watched. Facebook evidence was not accessible.

## Confirmed core pattern

The [Google Play listing](https://play.google.com/store/apps/details?id=com.pockethaven.roguelegend), gameplay footage and the [Rogue HQ guides](https://rogue.desoware.com/guide) support a character lobby, finite board runs, automatic combat, run-specific skill choices, shops and permanent growth between attempts. The [Betho walkthrough](https://www.youtube.com/watch?v=BByAZkcKs8g) transcript specifically shows defeat followed by gold spent on permanent power before retrying. This was the key correction to the earlier implementation.

The [equipment guide](https://rogue.desoware.nl/guide/gear) distinguishes level upgrades from multi-stage rarity fusion. Higher recipes mix same-slot base fodder with exact upgraded copies. The [awakening guide](https://rogue.desoware.com/guide/equipment-awakening) documents weapon-dependent ultimates and mechanical passive unlocks. The [hero guide](https://rogue.desoware.com/guide/heroes) and [skill links](https://rogue.desoware.com/guide/skill-links) distinguish innate character abilities, persistent growth and conditional in-run skill builds.

In [VoidMaster00's second-boss episode](https://www.youtube.com/watch?v=BLHadJROjkE), the 4:48 frame shows an elite at turn 20/30; 8:38 shows a rest-versus-improve-existing-skill choice. These sampled observations informed the rebuilt checkpoints and camp training. They are not claims to have watched the full video.

## Implemented adaptation

| Reference pattern | Bible game behavior |
| --- | --- |
| Character preparation before a run | Male/female hero lobby, three combat paths, six gear slots, permanent stats and chapter selection |
| Automatic finite board journey | 30 turns, automatic movement and fights, elite checkpoints and a final monster boss |
| Temporary build choices | Three skill offers, repeated upgrades, prerequisites, camps that improve learned skills |
| Run shop | Separate tokens buy temporary healing, stats or skills; sold-out stock and priced refreshes |
| Weapon-based ultimate | 0–100% charge, Dawnfire burn, Aegis shield or Starfall burst; Epic passive effects |
| Death or victory ends an attempt | One-time reward settlement, exact Bible report, lobby upgrades and retry |
| Equipment investment | Gold/shard levels, refunds, slot investment retention, protected multi-stage fusion |
| Persistent character growth | Hero XP, level bonuses, talent points, gold training and level-5 path abilities |

Question wording and memory passages come from the supplied John 1–4 documents. Verse tiles, correct/incorrect reports and Armor of God learning milestones are original additions. Battles never count as incorrect Bible answers. Prices and combat formulas are original balance choices.

## Boundaries

This version has one opponent per fight and three original combat paths. It does not implement Rogue Legend's complete hero roster, pets, companions, awakening, mounts, guilds, leaderboards or separate event activities. The artwork and soundtrack are original, not copied from the reference. Online saves require Supabase configuration, and GitHub publication remains pending.
