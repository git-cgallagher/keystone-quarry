// CI check (npm run check): the game's script parses, the desktop page builds, and the built page loads nothing
// from the network (fonts must come from app/fonts so the desktop apps work offline).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');

function fail(msg) { console.error('check failed: ' + msg); process.exit(1); }

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 1) fail(`expected one inline <script> in index.html, found ${scripts.length}`);

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'keystone-')), 'game.js');
fs.writeFileSync(tmp, scripts[0]);
const parsed = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
if (parsed.status !== 0) fail('the game script does not parse:\n' + parsed.stderr);

execFileSync(process.execPath, [path.join(__dirname, 'build-app.js')], { stdio: 'inherit' });
const app = fs.readFileSync(path.join(root, 'app', 'index.html'), 'utf8');
const remote = app.match(/(?:src|href)=["']https?:\/\/[^"']+/g);
if (remote) fail('the desktop page still loads from the network: ' + remote.join(', '));
const fonts = fs.readdirSync(path.join(root, 'app', 'fonts'));
for (const f of [...app.matchAll(/url\("fonts\/([^"]+)"\)/g)].map(m => m[1])) if (!fonts.includes(f)) fail('missing bundled font ' + f);

console.log('check passed: script parses, desktop page builds offline with', fonts.length, 'fonts');
