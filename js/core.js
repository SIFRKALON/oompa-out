// Game rules with no DOM: the clock, travel, hotspots, and the ink runner.
// Used by js/game.js in the browser and by scripts/playtest.mjs in node.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OompaCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WATCHED = ['heat', 'solidarity', 'scrip', 'has_toffee', 'actions'];
  const MAJORITY = 21;
  const MAX_HEAT = 10;
  const ACTIONS_PER_SHIFT = 6;

  class Game {
    constructor({ Story, storyJson, rooms }) {
      this.Story = Story;
      this.storyJson = storyJson;
      this.rooms = rooms;
      this.story = null;
      this.pending = null;
      this.checkpoint = null;
      const game = this;
      this.v = new Proxy({}, {
        get: (_, k) => game.story.variablesState[k],
        set: (_, k, val) => { game.story.variablesState[k] = val; return true; },
      });
    }

    // ---------- lifecycle ----------

    newGame() {
      this.story = new this.Story(this.storyJson);
      this.checkpoint = null;
      return this.start('intro');
    }

    serialize() {
      return JSON.stringify({ v: 1, ink: this.story.state.toJson(), checkpoint: this.checkpoint });
    }

    restore(saved) {
      const data = typeof saved === 'string' ? JSON.parse(saved) : saved;
      this.story = new this.Story(this.storyJson);
      this.story.state.LoadJson(data.ink);
      this.checkpoint = data.checkpoint || null;
      this.pending = null;
    }

    retryCheckpoint() {
      if (!this.checkpoint) return false;
      const cp = this.checkpoint;
      this.restore(cp);
      this.checkpoint = cp;
      return true;
    }

    // ---------- queries ----------

    get room() { return this.v.room; }
    get busy() { return this.pending !== null; }

    hotspots(roomId = this.room) {
      const room = this.rooms[roomId];
      if (!room || !room.hotspots) return [];
      return room.hotspots.filter(h => !h.when || h.when(this.v));
    }

    roomStatus(roomId) {
      const r = this.rooms[roomId];
      if (r.later) return 'later';
      if (r.locked && !(roomId === this.room)) return 'locked';
      return 'open';
    }

    organized(roomId) {
      const r = this.rooms[roomId];
      return !!(r.organizedWhen && r.organizedWhen(this.v));
    }

    plates() {
      const v = this.v;
      const lit = Object.keys(this.rooms).filter(id => this.organized(id)).length;
      return { teal: v.solidarity >= 2, yellow: lit >= 2 };
    }

    // ---------- player actions ----------

    travel(dest) {
      if (this.busy) return { idle: true };
      if (dest === this.room) return { idle: true };
      const r = this.rooms[dest];
      if (!r) return { idle: true };
      if (r.later) return { idle: true, toast: r.laterMsg || 'Not in this build yet.' };
      if (r.locked) return { idle: true, toast: r.lockedMsg };
      this.spend(1);
      this.v.room = dest;
      return r.enter ? this.start(r.enter) : this.finish();
    }

    use(hotspotId) {
      if (this.busy) return { idle: true };
      const h = this.hotspots().find(x => x.id === hotspotId);
      if (!h) return { idle: true };
      if (h.cost) this.spend(h.cost);
      return this.start(h.knot);
    }

    spend(n) {
      this.v.actions = Math.max(0, this.v.actions - n);
      if (this.v.disguise > 0) this.v.disguise = this.v.disguise - 1;
    }

    // ---------- ink runner ----------

    start(path) {
      this.knot = path;
      this.story.ChoosePathString(path);
      this.pending = { goto: null, checkpoint: false, end: false, gameover: false };
      return this.advance();
    }

    choose(index) {
      this.story.ChooseChoiceIndex(index);
      return this.advance();
    }

    snapshot() {
      const s = {};
      for (const k of WATCHED) s[k] = this.v[k];
      return s;
    }

    advance() {
      const lines = [];
      while (this.story.canContinue) {
        const before = this.snapshot();
        const text = this.story.Continue().trim();
        const tags = this.story.currentTags || [];
        const after = this.snapshot();
        const line = { text, speaker: null, kind: 'narr', stamps: [], notices: [] };
        for (const tag of tags) this.readTag(tag.trim(), line);
        for (const k of WATCHED) {
          if (k === 'actions') continue;
          const d = after[k] - before[k];
          if (d) line.notices.push({ key: k, delta: d });
        }
        if (line.speaker && line.kind === 'narr') line.kind = 'speech';
        if (text || line.stamps.length || line.notices.length) lines.push(line);
      }
      const choices = this.story.currentChoices.map((c, i) => {
        const hint = (c.tags || []).map(t => t.trim()).find(t => t.startsWith('hint:'));
        return { index: i, text: c.text.trim(), hint: hint ? hint.slice(5) : null };
      });
      return { lines, choices, done: choices.length === 0 };
    }

    readTag(tag, line) {
      const i = tag.indexOf(':');
      const key = i === -1 ? tag : tag.slice(0, i);
      const val = i === -1 ? '' : tag.slice(i + 1).trim();
      switch (key) {
        case 's': line.speaker = val; break;
        case 'memo': line.kind = 'memo'; break;
        case 'daycard': line.kind = 'daycard'; line.day = val; break;
        case 'get': line.stamps.push({ type: 'get', text: val }); break;
        case 'ev': line.stamps.push({ type: 'ev', text: val }); break;
        case 'joined': line.stamps.push({ type: 'joined', text: val }); break;
        case 'goto': this.pending.goto = val; break;
        case 'checkpoint': this.pending.checkpoint = true; break;
        case 'end': this.pending.end = true; break;
        case 'gameover': this.pending.gameover = true; break;
      }
    }

    // Called when a knot has run out of content and the player has read it.
    // Applies the consequences and returns the next batch, or { idle }.
    finish() {
      const p = this.pending || {};
      this.pending = null;
      if (p.end) return { idle: true, screen: 'end' };
      if (p.gameover) return { idle: true, screen: 'gameover' };
      if (this.v.heat >= MAX_HEAT) return this.start('reassigned');
      if (p.checkpoint) this.checkpoint = { v: 1, ink: this.story.state.toJson() };
      if (p.goto) {
        this.v.room = p.goto;
        const r = this.rooms[p.goto];
        if (r && r.enter) return this.start(r.enter);
      }
      if (this.room === 'office' && this.v.disguise <= 0) return this.start('caught');
      // Out of actions: the whistle blows. The evening knot runs straight
      // through the night into the next morning (which resets actions).
      if (this.v.actions <= 0) {
        this.v.room = 'bunkhouse';
        return this.start('evening');
      }
      return { idle: true };
    }
  }

  return { Game, MAJORITY, MAX_HEAT, ACTIONS_PER_SHIFT };
});
