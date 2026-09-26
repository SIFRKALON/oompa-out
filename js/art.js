// Riso-style scene art, portraits and the factory map, drawn as SVG.
// Ink classes (see css/game.css): fb/fp/ft/fy fill blue/pink/teal/yellow,
// fw paper, hb/hp/ht halftone, sb/sp/st strokes. Teal and yellow only
// print once their plate is unlocked; before that they fall back to blue
// and bare paper.
(function (root) {
  'use strict';

  const worker = (v, joined) => (joined ? 'ft' : 'fb');

  // A small standing figure, feet at (x, y).
  function person(x, y, cls, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path class="${cls}" d="M-3.4 0 L-2.2 -9 L2.2 -9 L3.4 0 Z"/>
      <circle class="${cls}" cx="0" cy="-11.6" r="2.8"/>
    </g>`;
  }

  // ---------------------------------------------------------------- scenes

  function bunkhouse(v) {
    const bunk = x => `
      <g>
        <line class="sb" x1="${x}" y1="18" x2="${x}" y2="72" stroke-width=".8"/>
        <line class="sb" x1="${x + 24}" y1="18" x2="${x + 24}" y2="72" stroke-width=".8"/>
        ${[28, 42, 56, 68].map(y => `<rect class="hb" x="${x}" y="${y}" width="24" height="3.4"/><line class="sb" x1="${x}" y1="${y + 3.4}" x2="${x + 24}" y2="${y + 3.4}" stroke-width=".5"/>`).join('')}
      </g>`;
    const faces = [];
    for (let i = 0; i < 21; i++) {
      const cx = 128 + (i % 7) * 4, cy = 23 + Math.floor(i / 7) * 5.2;
      faces.push(i < v.solidarity
        ? `<circle class="ft" cx="${cx}" cy="${cy}" r="1.5"/>`
        : `<circle class="sb" cx="${cx}" cy="${cy}" r="1.3" stroke-width=".35" opacity=".55"/>`);
    }
    return `
      <rect class="fw" width="160" height="90"/>
      <rect class="hb" x="0" y="72" width="160" height="18" opacity=".9"/>
      <line class="sb" x1="0" y1="72" x2="160" y2="72" stroke-width=".6"/>
      <g class="mul">
        ${bunk(6)}${bunk(46)}
        <!-- stove -->
        <rect class="fb" x="104" y="50" width="16" height="22"/>
        <rect class="fy" x="107" y="58" width="10" height="7"/>
        <rect class="fb" x="110" y="8" width="4" height="42"/>
        <!-- union wall -->
        <rect class="fw" x="123" y="12" width="34" height="34"/>
        <rect class="sb" x="123" y="12" width="34" height="34" stroke-width=".6"/>
        <text class="t-stencil ft" x="125.5" y="18.5" font-size="4.4">UNION</text>
        ${faces.join('')}
        <text class="t-mono fb" x="125" y="44" font-size="2.6">${v.solidarity}/21 FOR A MAJORITY</text>
        <!-- loudspeaker -->
        <ellipse class="fp" cx="84" cy="10" rx="8" ry="5.4"/>
        <ellipse class="fp" cx="85.2" cy="10.8" rx="8" ry="5.4" opacity=".5"/>
        <path class="sb" d="M80 10.5 Q84 13.5 88 10.5" stroke-width=".7"/>
        <circle class="fb" cx="81.5" cy="8.6" r=".7"/><circle class="fb" cx="86.5" cy="8.6" r=".7"/>
        <!-- crate with pay slip -->
        ${v.injury_seen ? `<rect class="hb" x="78" y="62" width="14" height="10"/><rect class="fw" x="81" y="59" width="8" height="4.4" transform="rotate(-6 85 61)"/><rect class="sp" x="81" y="59" width="8" height="4.4" stroke-width=".4" transform="rotate(-6 85 61)"/>` : ''}
        <!-- Gramble lying on the lower bunk -->
        ${v.injury_seen ? `
          <g transform="translate(0 0)">
            <rect class="${worker(v, v.gramble_joined)}" x="50" y="63.2" width="14" height="4.6" rx="2"/>
            <circle class="${worker(v, v.gramble_joined)}" cx="66.6" cy="64.6" r="3"/>
            <path class="sp" d="M52 63.4 v4.2 M55 63.4 v4.2 M58 63.4 v4.2" stroke-width=".8"/>
          </g>` : ''}
        <!-- Nib's bunk tag -->
        <rect class="fp" x="14" y="47.4" width="8" height="3" transform="rotate(-4 18 49)"/>
        <text class="t-stencil fw" x="15" y="49.8" font-size="2.4" transform="rotate(-4 18 49)">NIB</text>
      </g>`;
  }

  function river(v) {
    const lolly = (x, y, r) => `<line class="sb" x1="${x}" y1="${y}" x2="${x}" y2="50" stroke-width=".8"/><circle class="fp" cx="${x}" cy="${y}" r="${r}"/><circle class="sb" cx="${x}" cy="${y}" r="${r * 0.55}" stroke-width=".6"/>`;
    const line = [10, 18, 26, 34, 42].map((x, i) => person(x, 54 - (i % 2), worker(v, v.line_joined), 0.9)).join('');
    const posts = [66, 74, 82].map(x => `<line class="sb" x1="${x}" y1="40" x2="${x}" y2="52" stroke-width=".9"/>` +
      (v.day >= 2 ? `<rect class="fp" x="${x - 2}" y="36" width="4" height="4"/>` + (v.spysweets_on ? `<circle class="fw" cx="${x}" cy="38" r="1"/><circle class="fb" cx="${x - .3}" cy="38.3" r=".45"/>` : '') : '')).join('');
    return `
      <rect class="fw" width="160" height="90"/>
      <g class="mul">
        ${lolly(18, 18, 8)}${lolly(44, 12, 6)}${lolly(92, 20, 7)}
        <path class="hb" d="M0 50 Q40 46 80 50 T160 48 V90 H0 Z" opacity=".35"/>
        <!-- the river -->
        <path class="hb" d="M0 60 Q30 55 60 60 T120 58 T160 60 V84 Q120 88 80 82 T0 84 Z"/>
        <path class="sp" d="M8 66 q6 -3 12 0 t12 0 M40 72 q6 -3 12 0 t12 0 M84 68 q6 -3 12 0 t12 0" stroke-width=".7"/>
        <!-- waterfall and mixer -->
        <rect class="hb" x="120" y="2" width="22" height="58"/>
        ${[123, 127, 131, 135, 139].map(x => `<line class="sb" x1="${x}" y1="2" x2="${x}" y2="60" stroke-width=".7"/>`).join('')}
        <circle class="sp" cx="132" cy="30" r="9" stroke-width="4" stroke-dasharray="3.2 2.2"/>
        <circle class="fp" cx="132" cy="30" r="4.4"/>
        <circle class="sp" cx="133.2" cy="31" r="9" stroke-width="4" stroke-dasharray="3.2 2.2" opacity=".35"/>
        ${line}
        ${posts}
        <!-- the oar -->
        <line class="sb" x1="46" y1="58" x2="64" y2="78" stroke-width="1.4"/>
        <ellipse class="fb" cx="65" cy="79.5" rx="3.2" ry="1.6" transform="rotate(48 65 79.5)"/>
        <!-- Pomfrey -->
        <g>
          <path class="fp" d="M94 52 L96 38 L104 38 L106 52 Z"/>
          <circle class="fp" cx="100" cy="34.6" r="3.4"/>
          <rect class="fb" x="96.4" y="29.2" width="7.2" height="2.8" rx="1"/>
          <rect class="fb" x="95" y="31.6" width="10" height="1"/>
          <path class="sb" d="M98 36 q2 1.4 4 0" stroke-width=".7"/>
          <rect class="fw" x="104" y="41" width="4" height="5.4"/>
          <rect class="sb" x="104" y="41" width="4" height="5.4" stroke-width=".35"/>
        </g>
      </g>`;
  }

  function hall(v) {
    const stripes = [];
    const inks = ['fp', 'fy', 'ft', 'fb'];
    for (let i = 0; i < 10; i++) {
      const x0 = i * 4, x1 = x0 + 4;
      const yTop0 = x0 * 18 / 40, yTop1 = x1 * 18 / 40;
      const yBot0 = 90 - x0 * 28 / 40, yBot1 = 90 - x1 * 28 / 40;
      stripes.push(`<polygon class="${inks[i % 4]}" opacity=".55" points="${x0},${yTop0} ${x1},${yTop1} ${x1},${yBot1} ${x0},${yBot0}"/>`);
    }
    return `
      <rect class="fw" width="160" height="90"/>
      <g class="mul">
        <polygon class="hb" points="0,90 160,90 120,62 40,62"/>
        <polygon class="sb" points="0,0 160,0 120,18 40,18" stroke-width=".6"/>
        <rect class="sb" x="40" y="18" width="80" height="44" stroke-width=".6"/>
        ${stripes.join('')}
        ${v.has_wallpaper ? `<rect class="fw" x="12" y="28" width="7" height="12"/><rect class="sb" x="12" y="28" width="7" height="12" stroke-width=".4" stroke-dasharray="1 .8"/>` : ''}
        <!-- round door -->
        <circle class="sb" cx="84" cy="40" r="12" stroke-width="1.2"/>
        <circle class="hb" cx="84" cy="40" r="10"/>
        <circle class="fp" cx="80" cy="36" r="1.8"/><circle class="fp" cx="87" cy="42" r="1.2"/><circle class="fp" cx="85" cy="33" r=".9"/>
        <text class="t-stencil fb" x="73" y="25" font-size="3">FIZZY LIFTING</text>
        <!-- side doors -->
        <rect class="sb" x="48" y="30" width="12" height="32" stroke-width=".6"/>
        <rect class="sb" x="102" y="30" width="12" height="32" stroke-width=".6"/>
        <!-- suggestion box -->
        <rect class="fb" x="47" y="56" width="10" height="9"/><rect class="fw" x="49" y="57.6" width="6" height=".9"/>
        <!-- candymen stair -->
        <polygon class="fp" points="120,22 146,8 146,78 120,60" opacity=".85"/>
        <polygon class="hb" points="124,58 142,72 142,76 124,62"/>
        <polygon class="hb" points="124,50 142,62 142,66 124,54"/>
        <polygon class="hb" points="124,42 142,52 142,56 124,46"/>
        <rect class="fw" x="124" y="26" width="19" height="6" transform="skewY(-26) translate(0 62)"/>
        <text class="t-stencil fp" x="125" y="30.8" font-size="3.3" transform="skewY(-26) translate(0 62)">CANDYMEN ONLY</text>
        <!-- Lintel at his desk -->
        <rect class="fb" x="104" y="60" width="16" height="8"/>
        <circle class="fp" cx="112" cy="55.4" r="3.6"/>
        <path class="sb" d="M110 56.6 q2 1.4 4 0" stroke-width=".8"/>
      </g>`;
  }

  function inventing(v) {
    const hair = v.toffo_joined ? 'st' : 'sb';
    return `
      <rect class="fw" width="160" height="90"/>
      <rect class="hb" x="0" y="72" width="160" height="18" opacity=".9"/>
      <line class="sb" x1="0" y1="72" x2="160" y2="72" stroke-width=".6"/>
      <g class="mul">
        <!-- the contraption -->
        <rect class="fp" x="84" y="10" width="30" height="34" rx="3"/>
        <rect class="fp" x="85.4" y="11" width="30" height="34" rx="3" opacity=".35"/>
        <circle class="fw" cx="92" cy="20" r="4"/><line class="sb" x1="92" y1="20" x2="94.6" y2="17.4" stroke-width=".7"/>
        <circle class="fw" cx="106" cy="20" r="4"/><line class="sb" x1="106" y1="20" x2="103" y2="18.4" stroke-width=".7"/>
        <path class="sb" d="M114 18 H124 V6 M84 30 H76 V4 M99 44 V58" stroke-width="1.6"/>
        <path class="fb" d="M90 32 H108 L103 40 H95 Z"/>
        <circle class="fy" cx="125" cy="6" r="2"/><circle class="fy" cx="75" cy="5" r="1.6"/>
        <!-- test chair + clipboard -->
        <rect class="fb" x="90" y="58" width="12" height="3"/>
        <line class="sb" x1="91" y1="61" x2="91" y2="72" stroke-width=".9"/><line class="sb" x1="101" y1="61" x2="101" y2="72" stroke-width=".9"/>
        <rect class="fb" x="100" y="46" width="2.4" height="12"/>
        <rect class="fw" x="97" y="49" width="6" height="8" transform="rotate(8 100 53)"/>
        <rect class="sb" x="97" y="49" width="6" height="8" stroke-width=".4" transform="rotate(8 100 53)"/>
        <!-- toffee jar on a shelf -->
        <rect class="fb" x="112" y="60" width="22" height="2"/>
        <rect class="sb" x="117" y="47" width="11" height="13" rx="2" stroke-width=".8"/>
        ${[[120, 57], [123, 57], [126, 57], [121.5, 54], [124.5, 54], [123, 51]].map(([x, y]) => `<circle class="fp" cx="${x}" cy="${y}" r="1.3"/>`).join('')}
        <!-- vault -->
        <rect class="fb" x="138" y="18" width="18" height="30"/>
        <circle class="fw" cx="147" cy="30" r="4.4"/><circle class="fb" cx="147" cy="30" r="1.4"/>
        <rect class="fw" x="146.4" y="42" width="1.2" height="2.4"/>
        <!-- the thing under the sheet -->
        <path class="hb" d="M12 70 C12 38 34 38 34 70 Z" transform="translate(1.4 1)"/>
        <path class="fw" d="M12 70 C12 38 34 38 34 70 Z"/>
        <path class="sb" d="M12 70 C12 38 34 38 34 70" stroke-width=".8"/>
        <path class="sb" d="M16 70 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0" stroke-width=".5"/>
        ${v.saw_bot ? `<rect class="fp" x="27" y="54" width="5" height="1.6" transform="rotate(-20 29 55)"/>` : ''}
        <!-- Toffo -->
        <g>
          <path class="${worker(v, v.toffo_joined)}" d="M58 70 L61 52 L71 52 L74 70 Z"/>
          <circle class="${worker(v, v.toffo_joined)}" cx="66" cy="46.6" r="4.6"/>
          <path class="${hair}" d="M58 44 q-2 -8 3 -8 q0 -7 5 -4 q3 -6 7 -1 q6 0 4 7 q4 3 0 7" stroke-width="1.4" stroke-linecap="round"/>
          <path class="${hair}" d="M62 49.6 q4 2.4 8 0" stroke-width="1.1" stroke-linecap="round"/>
          <path class="sb" d="M74 58 l6 -3" stroke-width="1"/>
          <path class="sp" d="M79 53.6 l3 2.4 M79 56.4 l3 -2.4" stroke-width=".7"/>
        </g>
      </g>`;
  }

  function office(v) {
    const screens = [];
    for (let i = 0; i < 8; i++) {
      const x = 80 + (i % 4) * 9, y = 8 + Math.floor(i / 4) * 8;
      const isRiver = i === 5;
      screens.push(`<rect class="fb" x="${x}" y="${y}" width="8" height="6.6"/>` +
        (isRiver && v.day >= 2 && !v.spysweets_on
          ? `<rect class="fw" x="${x + 1}" y="${y + 1}" width="6" height="4.6"/>${[1.8, 3.4, 5].map(d => `<line class="sb" x1="${x + d}" y1="${y + 1}" x2="${x + d}" y2="${y + 5.6}" stroke-width=".5"/>`).join('')}`
          : `<rect class="hb" x="${x + 1}" y="${y + 1}" width="6" height="4.6" opacity=".7"/>`));
    }
    return `
      <rect class="fw" width="160" height="90"/>
      <rect class="hp" x="0" y="0" width="160" height="66" opacity=".55"/>
      <rect class="hp" x="0" y="66" width="160" height="24"/>
      <line class="sp" x1="0" y1="66" x2="160" y2="66" stroke-width=".7"/>
      <g class="mul">
        ${screens.join('')}
        <!-- files -->
        <rect class="fb" x="8" y="30" width="20" height="36"/>
        ${[36, 46, 56].map(y => `<rect class="fw" x="11" y="${y}" width="14" height="6"/><rect class="fb" x="16" y="${y + 2.4}" width="4" height="1.2"/>`).join('')}
        <!-- desk with outbox -->
        <rect class="fp" x="36" y="56" width="30" height="4"/>
        <line class="sb" x1="38" y1="60" x2="38" y2="72" stroke-width="1"/><line class="sb" x1="64" y1="60" x2="64" y2="72" stroke-width="1"/>
        <rect class="sb" x="42" y="51" width="12" height="5" stroke-width=".7"/>
        <rect class="fw" x="43" y="49.6" width="10" height="3" transform="rotate(-4 48 51)"/>
        <rect class="fp" x="49" y="49.8" width="3.4" height="1.4" transform="rotate(-4 48 51)"/>
        <!-- a Candyman -->
        <rect class="fp" x="116" y="56" width="26" height="4"/>
        <path class="fp" d="M122 56 L124 44 L132 44 L134 56 Z"/>
        <circle class="fp" cx="128" cy="40.4" r="3.6"/>
        <rect class="fb" x="124.4" y="34.8" width="7.2" height="2.8" rx="1"/><rect class="fb" x="123" y="37.2" width="10" height="1"/>
        <path class="fb" d="M125 42 q3 2.4 6 0 q-3 1 -6 0 Z"/>
        <!-- stairs down -->
        <path class="sb" d="M140 90 V82 H146 V76 H152 V70 H160" stroke-width="1.2"/>
      </g>`;
  }

  const scenes = { bunkhouse, river, hall, inventing, office };

  // ---------------------------------------------------------------- portraits

  function face(body, extra) {
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><g class="mul">${body}${extra || ''}</g></svg>`;
  }

  const portraits = {
    nib: v => face(`
      <path class="fb" d="M8 40 L12 28 H28 L32 40 Z"/>
      <circle class="fb" cx="20" cy="19" r="9"/>
      <path class="fp" d="M10 16 Q20 4 30 16 Z"/>
      <circle class="fw" cx="17" cy="20" r="1.2"/><circle class="fw" cx="23" cy="20" r="1.2"/>`),
    gramble: v => face(`
      <path class="${v.gramble_joined ? 'ft' : 'fb'}" d="M6 40 L10 29 H30 L34 40 Z"/>
      <circle class="${v.gramble_joined ? 'ft' : 'fb'}" cx="20" cy="19" r="10"/>
      <rect class="fw" x="12" y="14" width="6" height="2"/><rect class="fw" x="22" y="14" width="6" height="2"/>
      <circle class="fw" cx="16" cy="19" r="1"/><circle class="fw" cx="24" cy="19" r="1"/>
      <path class="sp" d="M10 32 v8 M15 31 v9 M20 31 v9 M25 31 v9 M30 32 v8" stroke-width="1.4"/>`),
    toffo: v => face(`
      <path class="${v.toffo_joined ? 'ft' : 'fb'}" d="M9 40 L12 29 H28 L31 40 Z"/>
      <circle class="${v.toffo_joined ? 'ft' : 'fb'}" cx="20" cy="21" r="8"/>
      <path class="sb" d="M8 20 q-4 -10 4 -12 q0 -8 8 -5 q6 -6 10 2 q8 1 3 10 q4 5 -1 9" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path class="sb" d="M15 25.4 q5 3 10 0" stroke-width="1.6" fill="none"/>
      <circle class="fw" cx="17" cy="21" r="1"/><circle class="fw" cx="23" cy="21" r="1"/>`),
    pip: v => face(`
      <path class="${v.line_joined ? 'ft' : 'fb'}" d="M10 40 L13 30 H27 L30 40 Z"/>
      <circle class="${v.line_joined ? 'ft' : 'fb'}" cx="20" cy="21" r="8"/>
      <path class="fb" d="M12 16 l2 -8 l3 6 l3 -8 l3 8 l3 -6 l2 8 Z"/>
      <circle class="fw" cx="17" cy="21" r="1"/><circle class="fw" cx="23" cy="21" r="1"/>
      <circle class="fp" cx="15" cy="25" r=".8"/><circle class="fp" cx="25" cy="25" r=".8"/>`),
    pomfrey: v => face(`
      <path class="fp" d="M8 40 L11 28 H29 L32 40 Z"/>
      <circle class="fp" cx="20" cy="20" r="8.6"/>
      <rect class="fb" x="12" y="6" width="16" height="7" rx="2"/><rect class="fb" x="9" y="12" width="22" height="2.2"/>
      <path class="fb" d="M13 24 q7 5 14 0 q-7 2 -14 0 Z"/>
      <circle class="fb" cx="17" cy="19" r="1"/><circle class="fb" cx="23" cy="19" r="1"/>`),
    lintel: v => face(`
      <path class="fp" d="M6 40 L9 28 H31 L34 40 Z"/>
      <circle class="fp" cx="20" cy="20" r="11"/>
      <path class="fb" d="M12 25 q8 5 16 0 q-8 2 -16 0 Z"/>
      <circle class="fb" cx="16" cy="18" r="1"/><circle class="fb" cx="24" cy="18" r="1"/>`),
    candyman: v => face(`
      <path class="fp" d="M8 40 L11 28 H29 L32 40 Z"/>
      <circle class="fp" cx="20" cy="20" r="8.6"/>
      <rect class="fb" x="12" y="6" width="16" height="7" rx="2"/><rect class="fb" x="9" y="12" width="22" height="2.2"/>
      <path class="fb" d="M13 24 q7 5 14 0 q-7 2 -14 0 Z"/>
      <circle class="fb" cx="17" cy="19" r="1"/><circle class="fb" cx="23" cy="19" r="1"/>`),
    wonkmann: v => face(`
      <ellipse class="fp" cx="20" cy="22" rx="15" ry="11"/>
      <ellipse class="fp" cx="21.4" cy="23" rx="15" ry="11" opacity=".45"/>
      <rect class="fb" x="12" y="2" width="16" height="12"/><rect class="fb" x="8" y="12" width="24" height="2.4"/>
      <path class="sb" d="M12 24 Q20 32 28 24" stroke-width="1.6" fill="none"/>
      <circle class="fb" cx="15" cy="20" r="1.2"/><circle class="fb" cx="25" cy="20" r="1.2"/>`),
  };

  const names = {
    nib: 'Nib', gramble: 'Gramble', toffo: 'Toffo', pip: 'Pip', pomfrey: 'Candyman Pomfrey',
    lintel: 'Mr. Lintel', candyman: 'A Candyman', wonkmann: 'Mr. Wonkmann (loudspeaker)',
  };

  // ---------------------------------------------------------------- map

  // Two layouts of the same cutaway: wide for desktop, tall for phones.
  // Floors keep their order either way: owner on top, workers at the bottom.
  const MAP_LAYOUTS = {
    wide: {
      w: 160, h: 116, fs: 4.2, small: 3.6,
      outline: 'M2 116 V22 L30 2 H130 L158 22 V116',
      lines: [[44, '.5', '1.2 1'], [83, '1.2', '']],
      chimney: [136, -2, 6, 10], elevator: [156, 4, 112],
      rects: {
        penthouse: [30, 4, 100, 16],
        office: [6, 24, 72, 18], studio: [82, 24, 72, 18],
        inventing: [6, 46, 50, 16], hall: [58, 46, 44, 16], fizzy: [104, 46, 50, 16],
        river: [6, 64, 96, 16], juicing: [104, 64, 50, 16],
        bunkhouse: [6, 86, 50, 24], store: [58, 86, 44, 24], boiler: [104, 86, 50, 24],
      },
    },
    tall: {
      w: 100, h: 142, fs: 4.3, small: 4.3,
      outline: 'M2 142 V20 L18 2 H82 L98 20 V142',
      lines: [[40.5, '.5', '1.2 1'], [99, '1.2', '']],
      chimney: [84, -2, 5, 8], elevator: [96.6, 6, 138],
      rects: {
        penthouse: [14, 4, 72, 14],
        office: [5, 22, 44, 16], studio: [51, 22, 44, 16],
        inventing: [5, 43, 44, 16], hall: [51, 43, 44, 16],
        river: [5, 61, 90, 16],
        fizzy: [5, 79, 44, 16], juicing: [51, 79, 44, 16],
        bunkhouse: [5, 102, 90, 18],
        store: [5, 122, 44, 16], boiler: [51, 122, 44, 16],
      },
    },
  };

  function map(game, layoutName = 'wide') {
    const L = MAP_LAYOUTS[layoutName];
    const parts = [];
    for (const [id, [x, y, w, h]] of Object.entries(L.rects)) {
      const r = game.rooms[id];
      const status = game.roomStatus(id);
      const here = id === game.room;
      const lit = game.organized(id);
      const fill = status === 'later' ? 'url(#hatch)' : lit ? 'url(#ht)' : 'var(--paper)';
      const label = (layoutName === 'tall' && r.short ? r.short : r.name).toUpperCase();
      const fs = w < 60 && layoutName === 'wide' ? L.small : L.fs;
      const tag = lit ? `<text class="t-mono ft" x="${x + 2.4}" y="${y + h - 2.4}" font-size="2.8">ORGANIZED</text>`
        : status === 'later' ? `<text class="t-mono fb" x="${x + 2.4}" y="${y + h - 2.4}" font-size="2.6" opacity=".7">LATER</text>` : '';
      parts.push(`
        <g class="map-room is-${status}${here ? ' is-here' : ''}${lit ? ' is-lit' : ''}" data-room="${id}" role="button" tabindex="0"
           aria-label="${r.name}${here ? ' (you are here)' : status === 'later' ? ' (not in this build)' : status === 'locked' ? ' (locked)' : ', travel costs 1 action'}">
          <rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:${fill}"/>
          <rect class="map-edge" x="${x}" y="${y}" width="${w}" height="${h}"/>
          <text class="t-stencil map-label" x="${x + 2.4}" y="${y + 1.6 + fs}" font-size="${fs}">${label}</text>
          ${status === 'locked' ? `<g transform="translate(${x + w - 7} ${y + 3})"><rect class="fp" x="0" y="3" width="5" height="4"/><path class="sp" d="M1 3 v-1.4 a1.5 1.5 0 0 1 3 0 v1.4" stroke-width=".8"/></g>` : ''}
          ${tag}
          ${here ? `<g transform="translate(${x + w - 6} ${y + h - 5})"><circle class="fp" r="4"/><text class="t-stencil fw" x="0" y="1.1" font-size="3" text-anchor="middle">YOU</text></g>` : ''}
        </g>`);
    }
    const [cx, cy, cw, ch] = L.chimney;
    const [ex, ey1, ey2] = L.elevator;
    return `<svg class="map-svg" viewBox="0 0 ${L.w} ${L.h}" role="group" aria-label="Factory map">
      <rect class="fw" width="${L.w}" height="${L.h}"/>
      <g class="mul">
        <path class="sb" d="${L.outline}" stroke-width=".8"/>
        ${L.lines.map(([y, sw, dash]) => `<line class="sb" x1="2" y1="${y}" x2="${L.w - 2}" y2="${y}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`).join('')}
        <rect class="fb" x="${cx}" y="${cy}" width="${cw}" height="${ch}"/>
        <line class="sp" x1="${ex}" y1="${ey1}" x2="${ex}" y2="${ey2}" stroke-width=".6" stroke-dasharray="2 1.4" opacity=".7"/>
        ${parts.join('')}
      </g>
    </svg>`;
  }

  root.OompaArt = { scenes, portraits, names, map };
})(typeof self !== 'undefined' ? self : this);
