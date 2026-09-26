// Browser UI: renders the HUD, rooms, map and dialogue, and feeds player
// input to the rules in js/core.js.
(function () {
  'use strict';

  const SAVE_KEY = 'oompa-out/save-v1';
  const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MGMT = new Set(['pomfrey', 'lintel', 'candyman', 'wonkmann']);
  const { Game, MAJORITY, MAX_HEAT, ACTIONS_PER_SHIFT } = window.OompaCore;
  const Art = window.OompaArt;

  const $ = id => document.getElementById(id);
  const el = {
    hud: $('hud'), stage: $('stage'), panel: $('panel'), lines: $('lines'), choices: $('choices'),
    cont: $('btn-continue'), scene: $('scene'), hotspots: $('hotspots'), roomName: $('room-name'),
    viewRoom: $('view-room'), viewMap: $('view-map'), map: $('map'), goal: $('goal'),
    title: $('screen-title'), pocket: $('screen-pocket'), pocketBody: $('pocket-body'),
    end: $('screen-end'), endBody: $('end-body'), toast: $('toast'), plate: $('plate-stamp'),
  };

  const game = new Game({ Story: window.inkjs.Story, storyJson: window.OOMPA_STORY, rooms: window.OompaRooms });
  let view = 'room';
  let used = new Set();
  let plates = { teal: false, yellow: false };
  let current = null; // the batch on screen, if any
  let renderedRoom = null;

  // ------------------------------------------------------------ storage

  function readSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; }
  }
  function writeSave() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ game: game.serialize(), used: [...used] })); } catch (e) { /* storage unavailable */ }
  }
  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* storage unavailable */ }
  }

  // ------------------------------------------------------------ flow

  function begin(result) {
    el.title.hidden = true;
    el.end.hidden = true;
    el.hud.hidden = false;
    el.stage.hidden = false;
    view = 'room';
    render();
    handle(result, true);
  }

  function newGame() {
    used = new Set();
    const first = game.newGame();
    plates = { teal: false, yellow: false };
    applyPlates(false);
    begin(first);
  }

  function continueGame() {
    const saved = readSave();
    if (!saved) return newGame();
    try {
      game.restore(saved.game);
    } catch (e) {
      clearSave();
      return newGame();
    }
    used = new Set(saved.used || []);
    plates = game.plates();
    applyPlates(false);
    begin({ idle: true });
  }

  // Show a batch from the story, or settle into the room when idle.
  function handle(result, fresh) {
    if (result.idle) {
      current = null;
      closePanel();
      if (result.toast) toast(result.toast);
      if (result.screen) return showEnd(result.screen);
      writeSave();
      render();
      return;
    }
    if (fresh) el.lines.replaceChildren();
    // A knot can move Nib (a goto, or the evening whistle). Keep the room
    // behind the dialogue in sync.
    if (renderedRoom !== game.room) { view = 'room'; render(); }
    const hadContent = el.lines.childElementCount > 0;
    if (result.done && !result.lines.length && !hadContent) {
      return handle(game.finish(), true);
    }
    current = result;
    openPanel();
    result.lines.forEach((line, i) => el.lines.appendChild(renderLine(line, i)));
    renderChoices(result);
    renderHud();
    applyPlates(true);
    const firstNew = el.lines.children[el.lines.childElementCount - result.lines.length];
    (firstNew || el.lines.lastElementChild)?.scrollIntoView({ block: 'nearest' });
    const focusTarget = result.done ? el.cont : el.choices.querySelector('button');
    focusTarget && focusTarget.focus({ preventScroll: true });
  }

  function choose(index) {
    if (!current || current.done) return;
    // Echo the choice as Nib's own line.
    const picked = current.choices.find(c => c.index === index);
    if (picked) {
      const echo = document.createElement('p');
      echo.className = 'line picked';
      echo.innerHTML = `<span class="k">▸</span> ${escapeHtml(picked.text)}`;
      echo.style.cssText = 'margin:0;font-weight:700;color:var(--pink)';
      el.lines.appendChild(echo);
    }
    handle(game.choose(index), false);
  }

  function proceed() {
    if (!current || !current.done) return;
    handle(game.finish(), true);
  }

  function travel(roomId) {
    if (game.busy) return;
    if (roomId === game.room) { setView('room'); return; }
    const res = game.travel(roomId);
    if (!res.toast) { view = 'room'; render(); }
    handle(res, true);
  }

  function useHotspot(id) {
    if (game.busy) return;
    used.add(`${game.room}:${id}`);
    handle(game.use(id), true);
  }

  // ------------------------------------------------------------ rendering

  function render() {
    renderHud();
    el.viewRoom.hidden = view !== 'room';
    el.viewMap.hidden = view !== 'map';
    if (view === 'room') renderRoom(); else renderMap();
  }

  function renderHud() {
    const v = game.v;
    $('hud-day').textContent = DAY_NAMES[v.day] || `Day ${v.day}`;
    $('hud-actions').innerHTML = pips(ACTIONS_PER_SHIFT, v.actions);
    const heat = $('hud-heat');
    heat.innerHTML = pips(MAX_HEAT, v.heat);
    heat.classList.toggle('hot', v.heat >= 7);
    heat.parentElement.setAttribute('aria-label', `Heat ${v.heat} of ${MAX_HEAT}`);
    $('hud-actions').parentElement.setAttribute('aria-label', `${v.actions} of ${ACTIONS_PER_SHIFT} actions left`);
    $('hud-union').textContent = v.solidarity;
    $('hud-scrip').textContent = v.scrip;
    const dis = $('hud-disguise');
    dis.hidden = !(v.disguise > 0);
    dis.querySelector('strong').textContent = v.disguise;
    el.goal.textContent = v.goal || '';
  }

  function pips(total, on) {
    let s = '';
    for (let i = 0; i < total; i++) s += `<i class="${i < on ? 'on' : ''}"></i>`;
    return s;
  }

  function renderRoom() {
    const id = game.room;
    const room = game.rooms[id];
    renderedRoom = id;
    el.roomName.textContent = room.name;
    const hs = game.hotspots();
    const pins = hs.map((h, i) => {
      const fresh = !used.has(`${id}:${h.id}`);
      return `<g class="hs${h.cost ? ' cost' : ''}${fresh ? ' new' : ''}" data-hs="${h.id}" role="button" tabindex="0"
        aria-label="${escapeHtml(h.label)}${h.cost ? ', costs 1 action' : ', free'}" transform="translate(${h.x} ${h.y})">
        <circle class="hs-pulse" r="3.4"/>
        <circle class="hs-ring" r="3.4"/>
        <text class="hs-num">${i + 1}</text>
      </g>`;
    }).join('');
    el.scene.innerHTML = Art.scenes[id](game.v) + pins;
    el.scene.setAttribute('aria-label', `${room.name} scene`);
    el.hotspots.innerHTML = hs.map((h, i) => `
      <li><button type="button" data-hs="${h.id}">
        <span class="n">${i + 1}</span>${escapeHtml(h.label)}
        <span class="c${h.cost ? '' : ' free'}">${h.cost ? '1 action' : 'free'}</span>
      </button></li>`).join('');
  }

  const narrow = window.matchMedia('(max-width: 600px)');
  function renderMap() {
    el.map.innerHTML = Art.map(game, narrow.matches ? 'tall' : 'wide');
  }
  narrow.addEventListener?.('change', () => { if (view === 'map' && !el.hud.hidden) renderMap(); });

  function setView(next) {
    if (game.busy) return;
    view = next;
    render();
    if (next === 'map') el.map.querySelector('.map-room.is-here')?.focus({ preventScroll: true });
  }

  function renderLine(line, i) {
    const div = document.createElement('div');
    div.className = `line ${line.kind}`;
    div.style.animationDelay = `${Math.min(i, 8) * 70}ms`;
    const stamps = renderStamps(line);
    if (line.kind === 'daycard') {
      div.textContent = line.text;
    } else if (line.kind === 'speech') {
      const who = line.speaker;
      const portrait = Art.portraits[who] ? Art.portraits[who](game.v) : '';
      const name = Art.names[who] || who;
      div.innerHTML = `<div class="portrait">${portrait}</div>
        <div><span class="who${MGMT.has(who) ? ' mgmt' : ''}">${escapeHtml(name)}</span><div>${escapeHtml(line.text)}</div>${stamps}</div>`;
    } else {
      div.innerHTML = `${escapeHtml(line.text)}${stamps}`;
    }
    return div;
  }

  function renderStamps(line) {
    const out = [];
    for (const s of line.stamps) {
      const label = s.type === 'get' ? 'Got' : s.type === 'ev' ? 'Evidence' : 'Joined';
      out.push(`<span class="stamp ${s.type}">${label}: ${escapeHtml(s.text)}</span>`);
    }
    for (const n of line.notices) {
      const sign = n.delta > 0 ? '+' : '−';
      const amt = Math.abs(n.delta);
      if (n.key === 'heat') out.push(`<span class="stamp ${n.delta > 0 ? 'heat-up' : 'heat-down'}">${sign}${amt} Heat</span>`);
      if (n.key === 'solidarity') out.push(`<span class="stamp union${n.delta < 0 ? ' down' : ''}">${sign}${amt} Union</span>`);
      if (n.key === 'scrip') out.push(`<span class="stamp scrip">${sign}${amt} Scrip</span>`);
    }
    return out.length ? `<div class="stamps">${out.join('')}</div>` : '';
  }

  function renderChoices(batch) {
    el.choices.replaceChildren();
    el.cont.hidden = !batch.done;
    if (batch.done) return;
    batch.choices.forEach((c, i) => {
      const li = document.createElement('li');
      const hint = c.hint ? `<span class="hint ${c.hint}">${escapeHtml(c.hint)}</span>` : '<span></span>';
      li.innerHTML = `<button type="button" data-choice="${c.index}"><span class="k">${i + 1}</span><span>${escapeHtml(c.text)}</span>${hint}</button>`;
      el.choices.appendChild(li);
    });
  }

  function openPanel() { el.panel.hidden = false; }
  function closePanel() {
    el.panel.hidden = true;
    el.lines.replaceChildren();
    el.choices.replaceChildren();
    el.cont.hidden = true;
  }

  // ------------------------------------------------------------ plates

  function applyPlates(announce) {
    const next = game.story ? game.plates() : { teal: false, yellow: false };
    document.body.classList.toggle('plate-teal', next.teal);
    document.body.classList.toggle('plate-yellow', next.yellow);
    if (announce) {
      if (next.teal && !plates.teal) stamp('New ink: Teal', 'Someone else\'s name is on the wall. From now on the union prints in its own color.', 'teal');
      if (next.yellow && !plates.yellow) stamp('New ink: Yellow', 'Two rooms organized. The print gets brighter.', 'yellow');
    }
    plates = next;
  }

  const stampQueue = [];
  let stamping = false;
  function stamp(title, text, kind) {
    stampQueue.push({ title, text, kind });
    if (!stamping) nextStamp();
  }
  function nextStamp() {
    const s = stampQueue.shift();
    if (!s) { stamping = false; el.plate.hidden = true; return; }
    stamping = true;
    el.plate.className = `plate-stamp ${s.kind}`;
    el.plate.innerHTML = `${escapeHtml(s.title)}<small>${escapeHtml(s.text)}</small>`;
    el.plate.hidden = false;
    setTimeout(nextStamp, 2600);
  }

  let toastTimer;
  function toast(text) {
    el.toast.textContent = text;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 3400);
  }

  // ------------------------------------------------------------ pocket

  function unionMembers(v) {
    const named = ['Nib'];
    if (v.gramble_joined) named.push('Gramble');
    if (v.line_joined) named.push('Pip', 'River stirrer', 'River stirrer');
    if (v.old_timers) named.push('Old-timer', 'Old-timer');
    if (v.toffo_joined) named.push('Toffo');
    if (v.testers) named.push('Blue-tongue tester');
    if (v.asked_needs) named.push("Somebody's cousin");
    const out = named.slice(0, v.solidarity);
    while (out.length < v.solidarity) out.push('Worker');
    return out;
  }

  function renderPocket() {
    const v = game.v;
    const items = [];
    if (v.has_wallpaper) items.push('<li><strong>Lickable Wallpaper.</strong> The flavor code. Lets you call a meeting at night without anyone upstairs hearing about it.</li>');
    if (v.has_toffee > 0) items.push(`<li><strong>Hair Toffee ×${v.has_toffee}.</strong> Grows a management mustache for 3 actions. Eat it at the Candymen stair.</li>`);
    if (!items.length) items.push('<li class="missing">Lint. A button. Nothing useful yet.</li>');
    const ev = [
      ['ev_paystub', "Gramble's docked pay slip", 'Wage theft'],
      ['ev_testlog', "Toffo's test log", 'Unpaid testing'],
      ['ev_botmemo', 'Loompa-Bot memo', 'Planned replacement'],
      ['ev_file', "Gramble's 1971 file", 'What happened last time'],
    ].map(([k, name, what]) => v[k] ? `<li><strong>${name}.</strong> ${what}.</li>` : `<li class="missing">??? (${what})</li>`);
    const knows = [];
    if (v.knows_tour) knows.push('Five children with Golden Tickets are touring the factory on Friday. Wonkmann is choosing an heir.');
    if (v.knows_bots) knows.push('Forty Loompa-Bots will be deployed after the tour. Staff are not to be told.');
    else if (v.saw_bot) knows.push('There is a Loompa-Bot under a sheet in the Inventing Room. Unit 1 of 40.');
    if (v.knows_offswitch) knows.push("Toffo built an off switch into the bots. Nobody asked him to.");
    if (v.knows_spy) knows.push('Spy-Sweets are going in on Tuesday, River Room first.');
    if (v.knows_slugsby) knows.push('A consultant called Mr. Slugsby is coming. Specialist in "family harmony."');
    if (v.knows_contract) knows.push('The Loompaland contract was written in chocolate, on a hot day.');
    if (!knows.length) knows.push('Not much yet. Listen more.');
    const wall = unionMembers(v).map(n => `<span>${escapeHtml(n)}</span>`).join('') +
      Array.from({ length: Math.max(0, 8 - v.solidarity) }, () => '<span class="empty">—</span>').join('');
    el.pocketBody.innerHTML = `
      <section><h3>Items</h3><ul>${items.join('')}</ul></section>
      <section><h3>Evidence for later</h3><ul>${ev.join('')}</ul></section>
      <section><h3>What you know</h3><ul>${knows.map(k => `<li>${escapeHtml(k)}</li>`).join('')}</ul></section>
      <section><h3>Union Wall · ${v.solidarity}/${MAJORITY} for a majority</h3><div class="wall">${wall}</div></section>
      <section><h3>Inks on the press</h3><div class="inks">
        <span class="ink"><i style="background:var(--blue)"></i>Federal Blue: the factory</span>
        <span class="ink"><i style="background:var(--pink)"></i>Pink: candy and management</span>
        <span class="ink"><i style="background:${plates.teal ? 'var(--teal-ink)' : 'transparent'}"></i>Teal: ${plates.teal ? 'the union' : 'locked (get someone to join)'}</span>
        <span class="ink"><i style="background:${plates.yellow ? 'var(--yellow-ink)' : 'transparent'}"></i>Yellow: ${plates.yellow ? 'two rooms organized' : 'locked (organize two rooms)'}</span>
      </div></section>`;
  }

  function openPocket() {
    if (el.hud.hidden) return;
    renderPocket();
    el.pocket.hidden = false;
    $('btn-pocket-close').focus();
  }
  function closePocket() { el.pocket.hidden = true; $('btn-pocket').focus(); }

  // ------------------------------------------------------------ end screens

  function showEnd(kind) {
    const v = game.v;
    const evidence = ['ev_paystub', 'ev_testlog', 'ev_botmemo', 'ev_file'].filter(k => v[k]).length;
    const wall = unionMembers(v).map(n => `<span>${escapeHtml(n)}</span>`).join('');
    if (kind === 'end') {
      clearSave();
      const method = v.democracy >= 2 ? 'They\'re starting to ask each other, not only you. That\'s the whole trick.'
        : v.democracy <= -1 ? 'They look to you for answers. Careful: that\'s how you end up in a top hat.'
        : 'So far, it\'s you and a handful of people who trust you. Next comes a committee.';
      el.endBody.innerHTML = `
        <p class="poster-kicker">End of the playable slice</p>
        <h1 class="end-title">To be continued</h1>
        <p class="end-text"><strong>Wednesday: The Committee.</strong> ${escapeHtml(method)}</p>
        <div class="end-stats">
          <div class="union"><b>${v.solidarity}/${MAJORITY}</b><span>Union Wall</span></div>
          <div class="heat"><b>${v.heat}/${MAX_HEAT}</b><span>Heat</span></div>
          <div><b>${evidence}/4</b><span>Evidence</span></div>
          <div><b>${v.knows_bots ? 'Yes' : 'No'}</b><span>Found the bot memo</span></div>
        </div>
        <div class="wall">${wall}</div>
        <div class="poster-buttons"><button class="btn-big" type="button" data-act="new">Play again</button></div>
        <p class="poster-foot">Try another way through: a different first conversation, a night in the Candymen Office, or warning everyone before the rehearsal.</p>`;
    } else {
      el.endBody.innerHTML = `
        <p class="poster-kicker">Heat ${v.heat}/${MAX_HEAT}</p>
        <h1 class="end-title bad">Reassigned</h1>
        <p class="end-text">Management noticed you before the union could protect you. Every risky move costs Heat: stealing, getting caught, skipping work, calling meetings out loud. Work your station, use the wallpaper, and bribe Pomfrey if you have to.</p>
        <div class="poster-buttons">
          ${game.checkpoint ? '<button class="btn-big" type="button" data-act="retry">Retry the day</button>' : ''}
          <button class="btn-big btn-alt" type="button" data-act="new">New game</button>
        </div>`;
    }
    el.end.hidden = false;
    el.end.querySelector('button')?.focus();
  }

  // ------------------------------------------------------------ input

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  $('btn-new').addEventListener('click', newGame);
  $('btn-continue-save').addEventListener('click', continueGame);
  $('btn-map').addEventListener('click', () => setView('map'));
  $('btn-back').addEventListener('click', () => setView('room'));
  $('btn-pocket').addEventListener('click', openPocket);
  $('btn-pocket-close').addEventListener('click', closePocket);
  el.cont.addEventListener('click', proceed);
  el.choices.addEventListener('click', e => {
    const b = e.target.closest('[data-choice]');
    if (b) choose(Number(b.dataset.choice));
  });
  el.hotspots.addEventListener('click', e => {
    const b = e.target.closest('[data-hs]');
    if (b) useHotspot(b.dataset.hs);
  });
  el.scene.addEventListener('click', e => {
    const g = e.target.closest('[data-hs]');
    if (g) useHotspot(g.dataset.hs);
  });
  el.scene.addEventListener('mouseover', e => {
    const g = e.target.closest('[data-hs]');
    el.hotspots.querySelectorAll('button').forEach(b => b.classList.toggle('lit', !!g && b.dataset.hs === g.dataset.hs));
  });
  el.hotspots.addEventListener('mouseover', e => {
    const b = e.target.closest('[data-hs]');
    el.scene.querySelectorAll('.hs').forEach(g => g.classList.toggle('lit', !!b && g.dataset.hs === b.dataset.hs));
  });
  el.map.addEventListener('click', e => {
    const g = e.target.closest('[data-room]');
    if (g) travel(g.dataset.room);
  });
  el.end.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'new') newGame();
    if (b.dataset.act === 'retry' && game.retryCheckpoint()) {
      plates = game.plates();
      applyPlates(false);
      begin({ idle: true });
    }
  });

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    // SVG buttons: Enter/Space activate.
    if ((e.key === 'Enter' || e.key === ' ') && t instanceof SVGElement && t.closest) {
      const hs = t.closest('[data-hs]');
      const room = t.closest('[data-room]');
      if (hs) { e.preventDefault(); useHotspot(hs.dataset.hs); return; }
      if (room) { e.preventDefault(); travel(room.dataset.room); return; }
    }
    if (!el.pocket.hidden) { if (e.key === 'Escape') closePocket(); return; }
    if (!el.title.hidden || !el.end.hidden) return;
    if (current) {
      if (!current.done && /^[1-9]$/.test(e.key)) {
        const c = current.choices[Number(e.key) - 1];
        if (c) { e.preventDefault(); choose(c.index); }
      }
      return;
    }
    if (e.key === 'm' || e.key === 'M') { e.preventDefault(); setView(view === 'map' ? 'room' : 'map'); }
    else if (e.key === 'p' || e.key === 'P') { e.preventDefault(); openPocket(); }
    else if (e.key === 'Escape' && view === 'map') setView('room');
    else if (view === 'room' && /^[1-9]$/.test(e.key)) {
      const h = game.hotspots()[Number(e.key) - 1];
      if (h) { e.preventDefault(); useHotspot(h.id); }
    }
  });

  // ------------------------------------------------------------ boot

  if (readSave()) $('btn-continue-save').hidden = false;
  $('btn-new').focus();
  window.__oompa = { game, render }; // handy in the console
})();
