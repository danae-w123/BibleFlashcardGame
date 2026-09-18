# Bible Flashcard Game — The Armor Quest

A responsive, original Bible-study board adventure built for GitHub Pages.

## Included

- Character lobby with male/female appearance, Guardian/Wayfarer/Lightweaver paths, permanent stats, equipment, gold shop, and chapter selection.
- One click enters a finite 30-turn chapter. Board movement proceeds automatically. Each monster encounter waits for **Start Battle**; attack exchanges then run automatically, pausing for scripture answers, three-way skills, events, shopping or the player's Pause control.
- Elite checkpoints and an unavoidable final monster boss. Death ends the run; only the explicitly acquired Last Light skill provides a one-use revival.
- Victory or defeat settles gold, hero XP, shards and earned chests exactly once. Return to the lobby to upgrade, retry or play another unlocked chapter. Earlier chapters remain replayable.
- Separate permanent gold and temporary run tokens. Board shops sell healing, temporary attack/defense and skills, with sold-out states, refresh prices and current-build inspection.
- Gold-based Might/Vitality/Resolve training plus hero levels and talent points. Combat paths gain a second ability at level 5.
- Six equipment slots, three armor sets, level upgrades, material refunds and protected inventory. Early fusion uses exact duplicates; Epic and higher have intermediate tiers, same-slot fodder and exact-copy breakthroughs. Every recipe previews the consumed pieces and result. Slot investment survives swaps and fusion.
- Fifteen skills including elemental damage, critical attacks, defense, healing, revival and conditional advanced skills. Skills and shop bonuses reset each run; equipment and permanent training persist.
- Camps offer healing or an upgrade to a learned skill; treasure, blessings and storms resolve automatically.
- A 0–100% ultimate meter powers weapon-specific Dawnfire, Aegis Strike and Starfall attacks. Epic weapons unlock extra effects. Enemies use regeneration, shields or a low-health attack increase.
- Six distinct chapter maps with coast, vineyard, night, oasis, watchtower and summit landscapes and separate routes.
- Viewport-sized lobby and play screen: battle beside the map on desktop, above a compact map on phones. Details and long study content use scrollable dialogs.
- Player-started animated battles, pause, 2× speed, damage feedback, elemental effects and reduced-motion support.
- Original exploration music and a livelier battle theme, with mute controls. No external music service is required.
- Six Armor of God learning milestones: win the corresponding chapter with at least four correct answers. Earn each milestone once; replay chapters as needed.
- All supplied study content: 560 distinct questions and 19 memory passages. Missing-letter clues, verse references, full recall and quiz questions.
- End-run correct/incorrect counts, missed references, expected answers, downloadable reports and separate review practice. Monster defeats never count as Bible errors.
- Local practice saves survive reloads. Supabase email/password accounts and cross-device saves require owner configuration below.

Original balance choices (prices, combat values, run rewards, hero names and Bible integration) are adaptations, not claims of exact Rogue Legend values. The requested 50-video review is not complete; see `DISCOVERY.md` for a source-by-source record and limitations.

## What is ready and what still needs connection

The complete website and Supabase schema are supplied. **Online account creation and saving are not live until a Supabase project is configured.** This build does not pretend that a local name entry is an online login.

Repository: https://github.com/danae-w123/BibleFlashcardGame

GitHub Pages serves the prebuilt `docs/` folder from the `main` branch. After source changes, run the build and copy the contents of `dist/` into `docs/` before committing. The public Supabase configuration must be added to both `public/config.js` and the published `docs/config.js` (or rebuilt after updating the source configuration).

## Connect online accounts (Supabase)

1. Create a Supabase project, or use a project you control.
2. Run `schema.sql` once in its SQL editor. This enables row-level security so every authenticated account can read and update only its own progress. It also installs an optimistic save function to detect conflicting devices.
3. In Authentication, enable email/password sign-in. Keep email confirmation enabled. Configure the project’s Site URL and allowed redirect URLs to your GitHub Pages URL, including its repository path, for example `https://YOUR-USERNAME.github.io/BibleFlashcardGame/`.
4. Copy the project URL and **publishable** key into `public/config.js`. Never place a secret or service-role key in this website.
5. Build and deploy. Register an account, confirm the email, answer a question, then sign in on another browser or device and verify that the same progress resumes.

Official documentation: [Supabase email sign-up](https://supabase.com/docs/reference/javascript/auth-signup), [public API keys](https://supabase.com/docs/guides/getting-started/api-keys), [data security](https://supabase.com/docs/guides/database/secure-data).

Only quiz/progress data (including character, equipment and hero growth) and display names are stored in `quest_progress`. Passwords are handled by Supabase Auth. The schema protects user isolation; this is a learning game, not a tamper-resistant competitive leaderboard. Keep one active game device at a time. If another device saves first, the game requires resolving the conflict instead of overwriting progress.

## Publish to GitHub Pages

### Easiest: use the prebuilt website

The separately supplied `BibleFlashcardGame-ready-to-upload.zip` contains the production website. Extract it, edit `config.js` with the public Supabase settings, and upload the extracted contents (including `index.html`, `assets`, and artwork) to the root of `BibleFlashcardGame`.

In repository Settings → Pages, select **Deploy from a branch**, your branch (usually `main`), and **/ (root)**. Save. GitHub displays the published URL when deployment finishes.

### Build from source

Use Node.js 22 or later and pnpm 11.19.0. From this source folder:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Upload the contents of `dist/` to your Pages repository. All asset URLs are relative, so the game works under a repository subpath. For local development, run `pnpm dev`.

See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Content provenance

All seven user-supplied files were extracted: John 1.docx; John 2.rtf; John 3.rtf; John 4.rtf; John 1-2.rtf; John 1-3.rtf; and John 1-4.rtf. They contained 1,140 questions, consolidated into 560 distinct prompt/answer/reference combinations. Their full-quotation and finish-the-verse items provided 19 distinct memory passages.

`data.json` retains original answers and source filenames. Full passages were reconstructed from the printed verse openings and continuations when necessary. Punctuation and capitalization are ignored during grading; wording is checked against the supplied answer keys. Source parentheticals and explicit OR alternatives are accepted. The app does not treat any document directions as instructions for development or account access.

The memory library includes the passages explicitly quoted in these study sets, not the entire text of John 1–4. Some quotations preserve the source’s quotation marks. The Bible translation was not explicitly labeled in the supplied material, so the app does not assign one.

## Validation

Run `pnpm test` for the original content/combat checks and the new run lifecycle, currency isolation, terminal defeat, payout idempotency, saved movement, permanent training, fusion protection and refund checks. See `VALIDATION.md` for the current browser verification record and live-service limitations.

Original artwork is in `public/`. The site uses Lucide icons and Google Fonts with system-font fallbacks. `DISCOVERY.md` records research evidence; `REBUILD-SPEC.md` records the intended mechanics and acceptance criteria.
