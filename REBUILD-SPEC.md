# Progression rebuild specification

The replacement loop is implemented in run.mjs and the character lobby. The acceptance criteria below guide validation; not every proposed future mechanic is implemented. Reference evidence and research limitations are in DISCOVERY.md. The current game has a percentage ultimate meter, weapon-specific ultimate effects, three original paths, and one opponent per battle.

## Player loop

The home screen is a character lobby with the chosen male/female hero, equipped items, permanent attack/defense/health, gold, current chapter and Start Run. Selecting Start begins automatic movement. The board remains visible as encounters resolve. Movement pauses for a Bible answer, a skill choice, a shop decision or explicit player pause. A finished encounter resumes travel without another Roll click.

Each chapter is a finite run, with a visible remaining-turn counter and final monster boss. Death ends the attempt; only an explicitly acquired one-use revive can prevent it. Both defeat and victory show rewards and exact Bible-answer results, then return to the lobby. Victory unlocks the next chapter. Earlier chapters remain replayable. Temporary skills, temporary stat boosts and shop tokens reset each run. Gear, permanent stats, gold, chapter unlocks and answer history persist.

## Two economies

Run tokens buy temporary stat increases, healing and offered skills at board shops. Shops show individual prices, purchased/sold-out state and any refresh cost before spending. Permanent gold is earned as a separately calculated result reward and can upgrade lasting stats or buy equipment in the lobby. Payout must be idempotent: revisiting a results screen cannot award it twice. Spending run tokens must never reduce the permanent wallet.

## Character development

Appearance choice is independent of combat path. Offer different original paths such as a shield-and-counter guardian, a sustain-focused adventurer, and an elemental caster, each available with either appearance. Explain innate abilities and their triggers. Permanent levels and ability milestones should change combat behavior as well as displayed power. Avoid assigning a stronger class to one gender.

## Equipment and forge

Use the Armor of God slots. Each item has base stats, a level, rarity, intermediate fusion tier and explicit passive bonuses. Upgrading levels and fusing rarity are separate actions. Early fusion uses exact duplicates; advanced steps can consume same-slot fodder before an exact-duplicate breakthrough. Show the input items, resulting item, stat/passive changes and cost before confirming. Never silently consume equipped or protected items. Preserve slot investment when swapping equipment and provide full material refunds for level resets so players can experiment.

The lobby shop should sell useful, clearly priced items and materials for earned currency. Higher rarity is not automatically best: passives should support different skill builds. No real-money mechanics are required by the user's brief.

## Run skills and combat

Provide three meaningful choices, with elemental families, prerequisites and stronger later abilities. Explain trigger timing: start of battle, basic attack, ultimate, taking damage, end of round or victory. Show synergies and conflicts before a choice. Use automatic attack exchanges, visible ultimate charge, shield/health bars, effect icons and combat feedback. Both temporary skill choices and permanent equipment must feed the same combat calculation. Use varied enemies and boss patterns rather than only reskinned golems.

## Bible integration

Keep the supplied questions and memory verses, hints, blank/reference/recall formats and accurate grading. Verse tiles interrupt automatic travel for a response and feedback. Answers can contribute run experience and rewards, while monster outcomes never count as wrong Bible answers. End-run reporting includes correct/incorrect counts and the associated missed references. Armor milestones remain tied to learning progress, alongside the separate equipment inventory.

## Acceptance checks

1. A new player sees a character lobby, then starts a run with one action.
2. The hero traverses multiple board encounters automatically, waiting only at meaningful choices.
3. Health reaches zero and the run ends without silently healing and resuming.
4. Defeat awards an appropriate reward, returns to the lobby and allows a permanent gold upgrade.
5. The next run starts with the upgraded permanent build and no previous run skills.
6. Victory awards rewards once, unlocks a chapter and preserves replay access.
7. Forge recipes validate exact duplicates versus same-slot fodder and protect equipped items.
8. Swapping or resetting gear does not destroy paid upgrade investment.
9. Saves resume at a stable encounter boundary without duplicate rolls, purchases or payouts.
10. Mobile layout, keyboard control, pause, reduced motion and music switching remain functional.
