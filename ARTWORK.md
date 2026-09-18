# Original board artwork

Asset: `public/board-art.png`

Created with the built-in Imagegen tool and visually inspected before integration. One generation; no external game assets were copied.

Prompt: “Premium stylized fantasy 3D tabletop diorama landscape for an interactive Bible verse quest board game: ancient biblical Mediterranean ruins, azure sea, teal foliage, pale sandstone islands and cliffs, warm golden magical sanctuary. Wide 3:2 composition, high isometric angle, broad visually calm central terrain for functional tile overlays, perimeter details, dark navy atmosphere. Polished cinematic miniature landscape, youthful heroic adventure. Environment only; no text, letters, numbers, UI, logos, watermarks, characters, game pieces, board path, or tiles.”

The interactive tiles, icons, and hero marker are rendered by the website over the artwork.


## Combat sprites

`public/hero.png` and `public/monster.png` were generated using built-in Imagegen in response to the request for character-versus-monster battle tiles. Both were inspected as full-body RGBA sprites with transparent backgrounds.

Hero prompt: “Full-body youthful gender-neutral heroic adventurer, approximately 18–20, bronze and gold armor with teal fabric inspired by fantasy biblical Mediterranean antiquity; small round shield and short sword, ready stance facing right in three-quarter view. Premium stylized 3D miniature render matching ancient Mediterranean island diorama, soft upper-left light. Square, entire body and equipment visible, centered, generous transparent padding. Genuinely transparent background, isolated character, no stage, environment, text, numbers, logos, watermarks or graphic violence.”

Monster prompt: “Full-body fantasy stone-and-moss golem with glowing amber eyes, facing left in three-quarter view, sturdy broad pale sandstone boulder body with teal moss; approachable but formidable creature. Premium stylized 3D miniature render matching ancient Mediterranean island diorama, soft upper-left light, non-gory. Square, entire body visible, centered, generous transparent padding. Genuinely transparent background, isolated creature, no stage, environment, text, numbers, logos or watermarks.”


## Female adventurer

`public/hero-female.png` was generated with built-in Imagegen using the male hero as a style/gear reference. The request specified a matching young adult female adventurer with a brown braid, laurel circlet, protective bronze armor, ivory tunic, teal cape, sword and sunburst shield, the same full-body right-facing stance, and a transparent background. The result was visually inspected and copied into the project's public assets. Both sprites use the same game stats and animation system.

## Music

`audio.js` contains an original procedural Web Audio score: a light 110 BPM exploration melody, and a separate 138 BPM battle melody with stronger percussion and a rhythmic accompaniment. These are synthesized locally by the browser. No audio was extracted from Rogue Legend or from YouTube.
