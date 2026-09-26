// Headless playtests: one scripted "golden path" run plus a few hundred
// random runs through the real rules in js/core.js. Fails loudly on any
// ink runtime error, stuck state, or out-of-range meter.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as ink from 'inkjs/full';

const require = createRequire(import.meta.url);
const { Game } = require('../js/core.js');
const rooms = require('../js/rooms.js');

const source = readFileSync(new URL('../story/oompa.ink', import.meta.url), 'utf8');
const storyJson = new ink.Compiler(source).Compile().ToJson();

function makeGame() {
  const g = new Game({ Story: ink.Story, storyJson, rooms });
  return g;
}

// Run a batch to idle. `pick` chooses a choice index from a batch.
function drain(game, batch, pick, log) {
  let guard = 0;
  while (!batch.idle) {
    if (++guard > 500) throw new Error('drain: stuck');
    for (const l of batch.lines) log && log.push(l.text);
    if (process.env.TRACE && !batch.done) console.log('  [' + game.knot + ']', batch.choices.map(c => c.text).join(' / '));
    try {
      batch = batch.done ? game.finish() : game.choose(pick(batch));
    } catch (e) {
      throw new Error(`in knot "${game.knot}": ${e.message.split('\n')[0]}`);
    }
  }
  return batch;
}

function check(game, where) {
  const v = game.v;
  if (v.heat < 0 || v.heat > 10) throw new Error(`${where}: heat out of range ${v.heat}`);
  if (v.actions < 0 || v.actions > 6) throw new Error(`${where}: actions out of range ${v.actions}`);
  if (v.solidarity < 1) throw new Error(`${where}: solidarity < 1`);
  if (v.has_toffee < 0) throw new Error(`${where}: negative toffee`);
  if (!rooms[game.room]) throw new Error(`${where}: unknown room ${game.room}`);
}

// ---------- golden path ----------
function golden() {
  const prefer = [];
  const pick = batch => {
    for (const want of prefer) {
      const c = batch.choices.find(c => c.text.includes(want));
      if (c) return c.index;
    }
    return batch.choices[0].index;
  };
  const g = makeGame();
  const log = [];
  const run = b => { const r = drain(g, b, pick, log); check(g, 'golden'); return r; };
  let r = run(g.newGame());
  const plan = [
    ['travel', 'river'],          // 5: Gramble's injury
    ['travel', 'hall'],           // 4
    ['use', 'wallpaper'],         // 3: tear swatch
    ['travel', 'bunkhouse'],      // 2
    ['use', 'stub'],              // free: pay slip
    ['use', 'gramble'],           // 1
    ['travel', 'river'],          // 0 -> evening
    // Tuesday
    ['travel', 'river'],          // 5: Spy-Sweets
    ['use', 'line'],              // 4: river line joins (wallpaper, no heat)
    ['use', 'station'],           // 3: work
    ['travel', 'inventing'],      // 2
    ['use', 'clipboard'],         // free
    ['use', 'toffo'],             // 1: joins, 3 toffee
    ['use', 'toffo'],             // 0: inoculate -> evening (Gramble not warned)
  ];
  prefer.push('Tear off', 'Copy it', 'Four beans', 'everyone', 'Come to the Bunkhouse', 'Say nothing',
    'Warn him', 'test log', 'together', 'secret meeting', 'what they need', 'wrong words', 'Sleep');
  for (const [act, arg] of plan) {
    if (r.screen) break;
    r = run(act === 'travel' ? g.travel(arg) : g.use(arg));
  }
  const v = g.v;
  const want = { gramble_joined: true, toffo_joined: true, line_joined: true, has_wallpaper: true, ev_paystub: true, ev_testlog: true };
  for (const [k, val] of Object.entries(want)) if (v[k] !== val) throw new Error(`golden: expected ${k}=${val}, got ${v[k]}`);
  if (r.screen !== 'end') throw new Error(`golden: expected end screen, got ${JSON.stringify(r)}`);
  console.log(`golden path ok: day ${v.day}, union ${v.solidarity}, heat ${v.heat}, democracy ${v.democracy}, toffee ${v.has_toffee}`);
  return log;
}

// ---------- random runs ----------
function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

function randomRun(seed) {
  const rand = rng(seed);
  const g = makeGame();
  const pick = b => b.choices[Math.floor(rand() * b.choices.length)].index;
  let r = drain(g, g.newGame(), pick);
  let steps = 0;
  while (!r.screen) {
    if (++steps > 400) throw new Error(`seed ${seed}: never ended`);
    check(g, `seed ${seed}`);
    const hs = g.hotspots();
    const open = Object.keys(rooms).filter(id => !rooms[id].later);
    if (rand() < 0.55 && hs.length) r = g.use(hs[Math.floor(rand() * hs.length)].id);
    else r = g.travel(open[Math.floor(rand() * open.length)]);
    r = drain(g, r, pick);
    // Save/load round trip mid-run.
    if (!r.screen && rand() < 0.1) {
      const saved = g.serialize();
      g.restore(saved);
    }
  }
  return { screen: r.screen, v: g.v, g };
}

const log = golden();
const tally = { end: 0, gameover: 0 };
const heats = [];
const unions = [];
let retried = 0;
for (let seed = 1; seed <= 400; seed++) {
  const { screen, g } = randomRun(seed);
  tally[screen]++;
  heats.push(g.v.heat);
  unions.push(g.v.solidarity);
  if (screen === 'gameover' && retried < 20) {
    if (!g.retryCheckpoint()) throw new Error(`seed ${seed}: no checkpoint to retry`);
    if (g.v.heat >= 10) throw new Error(`seed ${seed}: checkpoint already lost`);
    retried++;
  }
}
const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
console.log(`random runs: final heat avg ${avg(heats)} max ${Math.max(...heats)}; union avg ${avg(unions)} max ${Math.max(...unions)}`);
console.log(`random runs ok: ${tally.end} reached Wednesday, ${tally.gameover} reassigned, ${retried} retries restored`);
if (process.argv.includes('--log')) console.log(log.join('\n'));
