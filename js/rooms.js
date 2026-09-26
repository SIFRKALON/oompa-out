// Where everything is. Hotspot x/y are in scene units (viewBox 0 0 160 90).
// `when` reads ink variables; `cost` is actions spent before the knot runs.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OompaRooms = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    // ---------- top ----------
    penthouse: { name: "Wonkmann's Penthouse", floor: 'top', later: true },

    // ---------- mezzanine ----------
    office: {
      name: 'Candymen Office', floor: 'mezz', enter: 'enter_office', locked: true,
      lockedMsg: 'Candymen only. The stairs are in the Corridor of Doors, and there is a man at the bottom of them.',
      hotspots: [
        { id: 'files', label: 'Personnel files', knot: 'office_files', cost: 1, x: 18, y: 40 },
        { id: 'memos', label: 'Outbox tray', knot: 'office_memos', cost: 1, x: 50, y: 52 },
        { id: 'monitors', label: 'Spy-Sweet monitors', knot: 'office_monitors', cost: 1, x: 96, y: 20 },
        { id: 'candyman', label: 'A Candyman', knot: 'office_candyman', cost: 1, x: 128, y: 50 },
        { id: 'exit', label: 'Stairs down', knot: 'office_exit', cost: 0, x: 150, y: 80 },
      ],
    },
    studio: { name: 'Wonka-Vision Studio', short: 'Wonka-Vision', floor: 'mezz', later: true },

    // ---------- production floor ----------
    inventing: {
      name: 'Inventing Room', floor: 'floor',
      organizedWhen: v => v.toffo_joined,
      hotspots: [
        { id: 'sheet', label: 'Dust sheet', knot: 'inv_sheet', cost: 0, x: 22, y: 48 },
        { id: 'toffo', label: 'Toffo', knot: 'toffo', cost: 1, x: 66, y: 40 },
        { id: 'clipboard', label: 'Clipboard', knot: 'inv_clipboard', cost: 0, x: 96, y: 56 },
        { id: 'jar', label: 'Toffee jar', knot: 'inv_jar', cost: 0, x: 122, y: 52 },
        { id: 'vault', label: 'Vault', knot: 'inv_vault', cost: 0, x: 146, y: 32 },
      ],
    },
    hall: {
      name: 'Corridor of Doors', floor: 'floor',
      hotspots: [
        { id: 'wallpaper', label: 'Lickable wallpaper', knot: 'hall_wallpaper', cost: 0, x: 22, y: 32 },
        { id: 'suggestion', label: 'Suggestion box', knot: 'hall_suggestion', cost: 0, x: 52, y: 62 },
        { id: 'fizzy', label: 'Round door', knot: 'hall_fizzy', cost: 0, x: 84, y: 38 },
        { id: 'door', label: 'Candymen stair', knot: 'hall_door', cost: 0, x: 128, y: 44 },
      ],
    },
    fizzy: { name: 'Fizzy Lifting Room', short: 'Fizzy Lifting', floor: 'floor', later: true },
    river: {
      name: 'Chocolate River Room', floor: 'floor', enter: 'enter_river',
      organizedWhen: v => v.line_joined,
      hotspots: [
        { id: 'line', label: 'The line', knot: 'river_line', cost: 1, x: 26, y: 50 },
        { id: 'station', label: 'Your station (work)', knot: 'river_work', cost: 1, x: 56, y: 72 },
        { id: 'spysweet', label: 'Spy-Sweet', knot: 'river_spysweet', cost: 0, x: 74, y: 36, when: v => v.day >= 2 },
        { id: 'pomfrey', label: 'Candyman Pomfrey', knot: 'river_pomfrey', cost: 1, x: 100, y: 46 },
        { id: 'mixer', label: 'Waterfall mixer', knot: 'river_mixer', cost: 0, x: 132, y: 30 },
      ],
    },
    juicing: { name: 'Juicing Room', floor: 'floor', later: true },

    // ---------- basement ----------
    bunkhouse: {
      name: 'Bunkhouse', floor: 'base',
      organizedWhen: v => v.gramble_joined,
      hotspots: [
        { id: 'speaker', label: 'Loudspeaker', knot: 'bunk_speaker', cost: 0, x: 84, y: 12 },
        { id: 'bunk', label: 'Your bunk', knot: 'bunk_nib', cost: 0, x: 22, y: 70 },
        { id: 'gramble', label: 'Gramble', knot: 'gramble', cost: 1, x: 58, y: 46, when: v => v.injury_seen },
        { id: 'stub', label: "Gramble's pay slip", knot: 'bunk_stub', cost: 0, x: 84, y: 60, when: v => v.injury_seen },
        { id: 'wall', label: 'Union Wall', knot: 'bunk_wall', cost: 0, x: 138, y: 26 },
      ],
    },
    store: { name: 'Company Store', floor: 'base', later: true },
    boiler: { name: 'Boiler & Pipes', floor: 'base', later: true },
  };
});
