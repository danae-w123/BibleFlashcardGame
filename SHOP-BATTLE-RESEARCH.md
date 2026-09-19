# Merchant scenes and sustain skills

## Reference evidence

- [TanJinGames, Rogue Legend gameplay](https://www.youtube.com/watch?v=DVhZ_qO1LA4&t=379s): sampled the battle at 6:19 and merchant at 6:25–6:30. The battle displays floating damage and a grid of acquired skills. The shop shows a shopkeeper and speech bubble, supply purchases above skill offers, rarity borders, a SOLD OUT offer, Ultimate Shield and Ultimate Resistance offers, Exit, a paid Reroll, and Skills. Earlier discovery notes also record this shop at 6:22–6:32.
- [Community skill index](https://roguelegend.wiki.gg/wiki/Category:Skills): search-index evidence describes Lifesteal as a chance-based weapon-attack healing skill. Direct page access returned 403, so this is not treated as a verified complete skill database.
- Existing broader footage and discovery limitations remain in DISCOVERY.md and BOARD-RESEARCH.md. These are sampled scenes, not a claim that 50 full videos were watched.

## Adaptation in this game

An original illustrated merchant interior and shopkeeper accompany three supply offers and up to three eligible, unique skill offers. Bought offers remain sold out until a paid reroll. Stock, purchases and reroll count survive saving. Run tokens pay for these temporary upgrades; permanent gold is untouched. This economy and the following skill numbers are our own balancing choices, not asserted Rogue Legend values.

Life Steal retains the existing `leech` save identifier. Basic strikes heal 15/30/45% of actual enemy HP damage, rounded up and capped at missing health. Enemy shields and overkill cannot inflate healing. Radiant Aegis grants 12/24/36 shield HP on each ultimate, before the counterattack. Remaining shield persists within that battle and resets for the next battle. Separate combat telemetry supports green healing text, blue absorption text, a shield aura and actual damage numbers rather than misleading net-health changes.

Start Battle remains required. Battles run automatically after that choice. Shops pause board travel until Exit Shop.

## Original art

`public/shop-interior.png` was generated with the built-in image generation tool. Prompt: original high-end Greek-myth fantasy RPG merchant interior; warm lantern light, teal shadows, wooden potion and equipment shelves, friendly older shopkeeper with salt-and-pepper curls and beard in a teal tunic behind a counter on the left third; crimson flask and coins; right side softly lit store; no words, logos or UI. Landscape 1536×1024. The delivered generation was copied unchanged; no reference-game art was extracted.

## Verification

Engine tests cover shield timing and carryover, actual-damage life steal, health caps, shielded hits and overkill, eligible shop stock, saved stock, sold-out purchases and reroll costs. Existing progression, board, combat, Bible grading and save compatibility tests remain in the test suite.
