# Keystone Quarry

An original typing game for kids, set in a blocky mining world. Pip the miner digs a tunnel. Each block shows a key, and pressing that key breaks the block. Blocks you mine build up your camp, which grows from a tent to a log hut, a cottage, a stone tower and finally a castle.

- **Play:** https://claude.ai/artifact/WikF7R3gb3pZJy5yCZwEfW (private Claude artifact; share it from the page's Share menu)
- **Source:** `index.html`. This is a single file with no build step and no dependencies apart from two Google Fonts. It is the only copy of the game: the desktop apps are built from it.
- **Desktop apps:** macOS (`dist/Keystone-Quarry-mac.dmg`) and Windows (`dist/Keystone-Quarry-windows-x64.zip`). See [Desktop builds](#desktop-builds).

## Lessons

| Mine | Name | Teaches |
|---|---|---|
| 1 | Home Row Hollow | a s d f · j k l ; (adds two keys at a time, starting with f j) |
| 2 | Coal Seam | g h e i r u, then short words |
| 3 | Iron Ridge | t y w o q p, then words |
| 4 | Gold Depths | z x c v b n m , . then words |
| 5 | Word Mine | real words using every letter; shows words per minute |
| 6 | Crystal Caves | Shift, capitals and periods in short sentences |
| 7 | Gloom Hollow (boss mine) | every letter, under gentle time pressure: type the word on each Gloomling to send it home, then beat the Rumble Golem one word at a time |

A mine opens once the child scores **85% correct** on the one before it. Gloom Hollow is the exception: it opens after **Mine 4**, once every letter has been taught. In Gloom Hollow Pip has 3 hearts, and a Gloomling that reaches Pip takes one. If all 3 are lost, the results screen says "Pip needs a rest" and the child can try again. Nothing is taken away.

**Grown-up cheat:** type `idkfa` on the title screen (the mine map) to open every mine. Stars and camp progress stay as they are.

Stars: 3 for ≥97%, 2 for ≥90%, otherwise 1. Speed is shown only from Mine 5 on, because accuracy comes first.

## Teaching aids
- An on-screen keyboard colour-coded by finger, with the next key bouncing. For a capital it also lights up the Shift key on the other hand.
- A hint line names the finger to use ("Press g with your left pointer finger").
- Wrong keys crack the block and give a soft sound. Nothing is lost and there is no timer.
- A Caps Lock warning, and bumps drawn on F and J.
- **Hand guide (on by default; the "Hands" button in the play screen):** see-through hands rest on the home row over the on-screen keyboard. The finger to use slides to the next key in its finger colour, and for a capital the other hand's pinky reaches for Shift.
- **Background music (off by default; the "Music" button at the top):** original and generated, with a theme for each place: a bright C major for the mine map, warm rolling piano in Home Row Hollow, plucked D dorian in Coal Seam, marching G mixolydian in Iron Ridge, low A minor with long echoes in Gold Depths, bouncy F major in Word Mine, glassy F lydian bells in Crystal Caves, and a watchful plucked E minor in Gloom Hollow that speeds up with a driving bass when the Rumble Golem arrives. Themes run at 130–190 note slots per minute, and 230 for the boss (`step` in `THEMES` is seconds per slot). Version 1.1 played 80. Music is separate from the Sound button for effects. Browsers only allow audio after a click or key press, so saved "music on" starts on the first one.
- Tapping the on-screen keys also types, so the game works on a tablet or phone.

## Desktop builds

The Mac and Windows apps use Electron to wrap the same game. They work offline because the fonts are bundled with them.

**You need:** macOS (it builds both platforms, and Windows builds don't need Wine) and Node 22+.

```bash
npm ci              # installs Electron 44.7.1, @electron/packager and the two font packages
npm start           # runs the game in a desktop window
npm run build:icon  # only needed when the icon art changes; writes build/icon.icns + build/icon.ico
npm run pack        # builds both platforms (or pack:mac / pack:win)
```

| Output | What it is |
|---|---|
| `dist/Keystone-Quarry-mac.dmg` | Universal macOS app (Apple silicon and Intel) for macOS 12 and later |
| `dist/Keystone Quarry-darwin-universal/Keystone Quarry.app` | The same app, not packed |
| `dist/Keystone-Quarry-windows-x64.zip` | Windows 10/11 x64 app folder; run `Keystone Quarry.exe` |

How it fits together:
- `scripts/build-app.js` makes `app/index.html` out of the root `index.html`. It adds a full HTML document and a strict Content Security Policy, and swaps Google Fonts for the bundled `@fontsource` copies. **Never edit `app/` by hand.** To change the game, edit the root `index.html`, republish the artifact and run `npm run pack` again.
- `main.js` is the window: sandboxed, with no Node access, no new windows, no navigation and a short menu.
- Each computer keeps its own saved progress, in `~/Library/Application Support/Keystone Quarry/` on a Mac and `%APPDATA%\Keystone Quarry\` on Windows.

**First launch (the builds are not signed by a publisher):**
- **Mac:** this Mac opens it normally. On other Macs, a downloaded copy gets blocked. Right-click the app and choose **Open**, then **Open** again (on macOS 15+, use **System Settings → Privacy & Security → Open Anyway**).
- **Windows:** SmartScreen shows "Windows protected your PC". Click **More info → Run anyway**.

### ⚠️ Gotchas
- **Ad-hoc sign the Mac app after packaging.** `pack:mac` runs `codesign --force --deep --sign -`, because Apple silicon won't run unsigned code and repackaging breaks Electron's own signature.
- **Pack the `.app` with `hdiutil` or `ditto`, not `zip`.** Electron.framework is full of symlinks, and plain `zip` turns them into copies, which breaks the app.
- **`asar extract-file` writes into the current folder.** Run in the project root, `npx asar extract-file <app.asar> app/index.html` writes `./index.html` over the game source (this happened once and the file was restored from the artifact). Extract from a scratch folder, or use `asar list`/`grep` on the `.asar` instead.
- **The Electron binary may not download during `npm ci`.** If `node_modules/electron/dist` is missing, run `node node_modules/electron/install.js`.

### Follow-ups
- Builds signed and notarized by a publisher (Apple Developer ID; a Windows code-signing certificate) would remove the first-launch warnings.
- An installer for Windows (for example Squirrel or NSIS through Electron Forge) instead of a zip.
- The Windows build is built on a Mac and has not yet been run on a Windows PC.

## Notes
- Progress (unlocked mines, stars, camp size) is kept in the browser's `localStorage`, so it stays on that device and browser only.
- The file has no `<!doctype>`/`<html>`/`<body>`, because the artifact host adds those when it publishes. To play it locally, wrap it in a minimal HTML page or serve it. Opening it directly also works, but in quirks mode.
- To republish after editing, ask Claude to publish `keystone-quarry/index.html` to the artifact URL above.
- Original game: no assets, names or characters are taken from any existing game.
