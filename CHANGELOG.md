# Changelog

## 1.3.0 — 2026-10-28
- Quarry map: the mine list on the title screen is now a map of tunnels under the camp. Opening a mine digs the tunnel to it, and Pip walks there. Click a mine or use the arrow keys to move Pip, then click again or press Enter to play. Gloom Hollow is a side tunnel off Gold Depths.
- Words per minute: shown on every mine now (it was Mines 5–7 only), with a best speed per mine.
- High scores: each run earns a score from correct keys, treasure, accuracy and speed. Each mine keeps a top 5 with the player's initials.
- Saves from 1.2 carry over: their open tunnels are dug the first time the map shows.

## 1.2.1 — 2026-10-28
- Security: Electron 44.7.1 → 44.9.3, which distrusts the compromised eMudhra intermediate certificates (Dependabot alert 1, high). The game makes no network requests, so the practical risk was low, but the apps no longer ship the affected runtime.
- Repository: published at github.com/git-cgallagher/keystone-quarry (public, MIT) with CI (`npm run check`, Windows and macOS packaging), Dependabot for GitHub Actions, and a security policy.

## 1.2.0 — 2026-10-28
- Music: each mine (and the mine map) has its own theme, with its own key, chords, instrument (piano, pluck or bell) and echo, matched to how the mine looks. It is faster than before: 130–190 note slots a minute instead of 80. The Rumble Golem fight switches to a faster boss theme (230 a minute).

## 1.1.0 — 2026-10-28
- Hand guide: see-through hands over the on-screen keyboard show where fingers rest, and the right finger reaches for each key (toggle: "Hands").
- Background music: original generative piano loop, off by default (toggle: "Music").
- Mine 7, Gloom Hollow: a boss mine. Gloomlings carry words toward Pip, and the Rumble Golem takes 6 words to beat. Pip has 3 hearts. It opens after Mine 4.
- Cheat code: type `idkfa` on the title screen to open every mine.
- Saves from 1.0 carry over; the new mine starts with no stars.

## 1.0.0 — 2026-10-28
- Desktop apps: an Electron 44.7.1 wrapper with a universal macOS `.dmg` (ad-hoc signed) and a Windows x64 `.zip`. The apps include their fonts and run offline.
- App icon: a crystal-ore block with a key cap, made by `scripts/make-icon.js`.

## 2026-10-27
- First version of the game (6 mines, finger-coloured keyboard, camp building), published as a private Claude artifact.
