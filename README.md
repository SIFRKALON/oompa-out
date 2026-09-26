# Oompa Out

A short browser game about organizing the workers of a very magical, very exploitative candy factory.

You're Nib, a stirrer in the Chocolate River Room of Wonkmann's Confectionery Works. You have one week, a pocket full of stolen sweets, and coworkers who are all too scared to talk. Candy gets you in. People get you through.

- Design document: [docs/DESIGN.md](docs/DESIGN.md)
- Visual directions: [docs/art-directions.html](docs/art-directions.html)

## Play

Open `index.html` in a browser. There's no build step and no server: everything runs from `file://`.

This is the **vertical slice**: Monday and Tuesday, about 15 minutes. It covers five rooms (Bunkhouse, Chocolate River Room, Corridor of Doors, Inventing Room, Candymen Office), two tools (Lickable Wallpaper, Hair Toffee), and two people to organize (Gramble and Toffo).

Keys: `1`–`9` pick a choice or a hotspot, `Enter` continues, `M` opens the map, `P` opens your pocket.

## How it's built

| Path | What it is |
|---|---|
| `story/oompa.ink` | All the writing, choices and game state, in [ink](https://www.inklestudios.com/ink/). The header comment lists the tags the shell understands. |
| `js/story.js` | The compiled story. Generated, don't edit. |
| `js/rooms.js` | Rooms and hotspots: where things are, what they cost, when they appear. |
| `js/core.js` | The rules with no UI: actions, travel, the evening whistle, disguise, checkpoints. |
| `js/art.js` | Scene art, portraits and the factory map, drawn as SVG in riso inks. |
| `js/game.js` | The browser UI. |
| `css/game.css` | The Riso Union look. Teal and yellow are extra "plates" that unlock as workers join. |
| `vendor/ink.js` | The inkjs runtime (MIT). |

## Develop

```sh
npm install
npm test        # compile the story, then run the golden path + 400 random playthroughs
npm run bundle  # write dist/oompa-out.html, a single self-contained file
```

After editing `story/oompa.ink`, run `npm run build` (or `npm test`) to regenerate `js/story.js`. The build fails on any ink error or warning.
