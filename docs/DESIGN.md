# OOMPA OUT — Game Design Document (v0.1)

> *A short, funny and sometimes serious organizing game. You're a disgruntled factory worker in a candy empire. You have five days, a pocket full of stolen sweets, and coworkers who are all too scared to talk. Get them talking.*

Working title: **Oompa Out**. Parody names are used throughout (see §12 for IP and tone notes).

---

## 0. The pitch in one breath

You play **Nib**, a line worker in **Wendell Wonkmann's Confectionery Works**, the most magical factory in the world and one of the worst places to work in it. Over **one working week** you listen to coworkers, build a committee, get around management's surveillance with the factory's own ridiculous inventions, and on **Golden Ticket Tour Day** (while five awful children are being dunked, juiced and shrunk in the background) you lead a **sit-down occupation** of the factory. On Saturday the workers put Wonkmann on trial.

**Thesis, which is also the core mechanic:**
> **Candy gets you in. People get you through.**
> Inventions are individual, clever tools for sneaking, scouting and getting past things. None of the locks that matter (the big valves, the vote, the song, the final door) open for one person. They need *people*.

---

## 1. Design pillars

| Pillar | What it means in practice | Borrowed from / why it works |
|---|---|---|
| **1. Mechanics say the message** | Solidarity is literally a key. Some doors need 3 people, the main valve needs a department, and the trial verdict needs a majority. You *cannot* win alone, and if you try, you get a worse ending. | *Papers, Please* and *This War of Mine* make you **feel** the theme through the rules, not just read it (what Bogost calls "procedural rhetoric"). |
| **2. Few verbs, deep combos** | You only ever **Go, Look, Talk, Use (candy)**. Every candy has at least 2 uses, so players feel clever instead of following a checklist. | *Overboard!*, *Reigns*, Zelda item design, Monkey Island inventory puzzles. |
| **3. Time pressure means real choices** | 5 days with a fixed number of actions. You *won't* do everything. What you pick is your story, and it's also the reason to replay. | *Citizen Sleeper* (clocks, precarity, labor), *Overboard!* (short runs, lots of endings). |
| **4. Telegraph the threat** | Every morning Management posts a **Memo** that tells you their next move. The fun is getting ahead of it (warning coworkers in advance, "inoculating" them). | *Into the Breach*: when the enemy's move is visible, a crisis becomes a puzzle. |
| **5. Funny first, then it lands** | Candy-colored absurdist comedy with real teeth underneath. The jokes get you to lower your guard, and then a coworker tells you about their injury. | *Night in the Woods*, *Kentucky Route Zero*, *Frog Detective*, *Disco Elysium*. |
| **6. How you win matters more than whether you win** | A hidden **Democracy** value tracks whether you *organized* (asked, delegated, voted) or *commanded*. If you take the factory by yourself, you get the top hat. | *Animal Farm*. Endings that judge your *method* rather than your score get people talking afterward. |
| **7. Short, replayable, whole** | About 60–75 min for a first run and about 40 min for a replay, with 8+ endings and a few randomized elements. | *Overboard!*, *A Short Hike*, *Frog Detective*: small games people actually finish and recommend. |

---

## 2. Scope at a glance

| | |
|---|---|
| **Genre** | Narrative strategy / light point-and-click / social stealth |
| **Platform** | Browser (single-page HTML/JS), desktop and mobile. Ship on itch.io. |
| **Run length** | ~60–75 min first run; ~35–45 min replays |
| **Structure** | 4 organizing days → Tour Day (occupation) → Trial Day → Epilogue |
| **Rooms** | 12 (MVP: 7) |
| **Candies / inventions** | 8 (MVP: 4) |
| **Named coworkers** | 7 (MVP: 4) |
| **Endings** | 8 main + variants in the epilogue slides |
| **Writing budget** | ~35–50k words of ink script (for reference, *Overboard!* is a similar size) |
| **Art budget** | 1 cutaway map, 12 room illustrations, ~14 portraits (3 expressions each), 8 item icons, ~10 ending cards |

---

## 3. Structure: map or no map? Movement or scenes?

**Decision: an illustrated cutaway map used as the hub, plus single-screen scenes. There is no free-walking avatar.**

### Why a map
The factory is drawn as one **side-view cross-section** (think ant farm, *Fallout Shelter*, the ship cutaway in *The Life Aquatic*). **Height shows class:**

```
            ┌──────────────────────────────────────────┐
  TOP       │   WONKMANN'S PENTHOUSE  ◇ Great Glass Elev. │  ← the owner
            ├──────────────────────────────────────────┤
  MEZZ.     │  Candymen Office   │  Wonka-Vision Studio  │  ← management
            ├──────────────────────────────────────────┤
  FLOOR     │ Inventing │ Fizzy Lifting │ Nut Sorting │ │
            │   Room    │     Room      │    Room     │ │  ← production
            │───────────┴───────┬───────┴─────────────│ │
            │  CHOCOLATE RIVER ROOM  │  Juicing Room   │ │
            ├──────────────────────────────────────────┤
  BELOW     │ Bunkhouse │ Company Store │ Boiler & Pipes│  ← where you live
            └──────────────────────────────────────────┘
```

- The whole game is a climb **from the basement to the penthouse**. The final elevator ride smashes up through every floor you've organized.
- **The map shows your progress.** Each department lights up in union colors as you win it over (the reverse of *Plague Inc.*'s spreading map). Management's surveillance candies appear on the map as eyes. You can read the state of the game at a glance.
- The map works well on mobile: tap a room and the scene opens.

### Why scenes and not walking
- Walking animation is expensive and adds nothing here. The interesting stuff is **who's in the room and what's in your pocket**.
- Each room is **one illustrated screen with 3–6 hotspots**: people, objects, exits, and hidden spots that only show up with the right candy.
- This keeps production small and puts the budget into writing and art, which is where games like this win.

### Moving around
- Tap a room on the map to travel there. **Each move costs 1 action.**
- Some routes are **locked** and need a tool or a person (e.g. the Mezzanine needs a disguise, the vents need Fizzy Lifting, the penthouse needs the Elevator).
- **Secret routes** such as the chocolate pipes and the vents let you skip a costly move or avoid a Candyman patrol. They're found through exploration and coworker tips.

---

## 4. The core loop

### A day
```
 MORNING WHISTLE ──► MEMO FROM MANAGEMENT (telegraphs their move today)
        │
        ▼
 THE SHIFT: 6 actions
   • Go to a room          (1 action)
   • Talk / one-on-one     (1 action)
   • Search / use candy    (1 action)
   • Work your station     (1 action: earns Scrip, keeps Heat down)
        │
        ▼
 EVENING, BUNKHOUSE: 1 committee action
   (hold a meeting, assign a task to someone, plan, vote)
        │
        ▼
 NIGHT (optional): 1 risky action  (+Heat, but the factory is empty)
        │
        ▼
 MANAGEMENT RESOLVES ITS MOVE → the clocks tick → next day
```

### The tension at the center: work or organize
If you skip your station, you gain **Heat** and lose **Scrip** (you need Scrip to buy candy at the Company Store). If you work, you're safe but you've used up an action. That's the same squeeze real organizers deal with, and it's the game's main economy.

### Meters (kept to a minimum on purpose)

| Meter | Visible? | What it does |
|---|---|---|
| **Solidarity** | Yes, shown as the **Union Wall** in the Bunkhouse with named faces and department blocs | Opens collective locks. Decides whether the occupation holds. Decides the trial vote. |
| **Heat** (0–10) | Yes, shown as **Wonkmann's Gaze**, a clock with an eye | At thresholds (4/7/10) management targets you. At 10 you're "reassigned" (game over for the day, see §9). |
| **Scrip** | Yes, bean tokens | Buys candy and favors, and pays bribes. |
| **Evidence** | Yes, as a dossier of items | Used at the trial. |
| **Democracy** | **Hidden** (hinted by coworker reactions) | Goes up when you ask, delegate and vote. Goes down when you decide alone, hoard candy, or override the committee. Decides the "who wears the hat" ending. |
| **Public Sympathy** | Shown only after you get control of Wonka-Vision | Earned from broadcasts and from saving the kids. Changes the trial and epilogue tone. |

### Management's escalation clock
Management has its own **4-segment clock per day**. Its moves come from a deck. Some are fixed and some are shuffled, and the Memo always telegraphs them:
- **Mandatory Song Rehearsal** (a captive-audience meeting): Solidarity drops in departments you haven't *inoculated*.
- **Spy-Sweets Installed** (the *Square Candies That Look Round*, which now actually look at you): rooms get eyes, and talking there costs Heat.
- **The Promotion Offer**: Mr. Slugsby offers a key coworker, or you, a Candyman badge.
- **Loompa-Bot Demonstration**: management shows off robot replacements. Fear goes up. If Toffo is on your side, you learn the bots' weakness.
- **A Firing**: a leader you've flipped gets targeted. You can protect them if you saw it coming.

**Inoculation is a real organizing practice and a great mechanic.** Warning a coworker *ahead of time* ("they're going to call a meeting and say the union will cost you your bunk") shrinks the damage when it happens. That's *Into the Breach* telegraphing turned into a labor tactic.

---

## 5. Talking: the one-on-one

This is where the game's heart is, and it's modeled on how organizers actually do it: **listen first, find the grievance, make it shared, offer hope, then ask for something concrete.** Leading with jargon or ideology fails.

A one-on-one has four beats, each a small choice:

1. **Listen**: Ask about their day, their station, their family. *(You learn their grievance. Looking at their station first gives you better options.)*
2. **Agitate**: Name the grievance back to them: "So when you hurt your back they docked you three days?"
3. **Hope**: Show them it's shared and fixable: "Pip got hurt the same way. So did half of Fudge."
4. **Ask**: A **specific** commitment: "Come to the Bunkhouse after the whistle." / "Sign the wall." / "Lick this wallpaper at midnight."

- If you pick the wrong grievance, they get awkward and the conversation is wasted (you can try again tomorrow).
- If you pick the preachy option ("Comrade, the means of production—") they back away and your Heat goes up slightly because they gossip. It's funny, and it teaches the lesson.
- **Organic leaders**: each department has one person everyone listens to. Flip them and **their whole bloc follows**, which lights up that room on the map. Finding out *who* the real leader is (not the loudest person) is its own small puzzle.

---

## 6. Candies & inventions: the toolkit

Every item has **how you get it**, **a primary use**, **at least one creative secondary use**, and **a cost or risk**. Items marked ★ are in the MVP.

| # | Candy / Invention | How you get it | Primary use | Secondary / creative uses | Risk / cost |
|---|---|---|---|---|---|
| 1 ★ | **Lickable Wallpaper** (snozzberry, lime, cola…) | Tear a swatch in the Wallpaper Hall (Day 1) | **Secret messages.** Each flavor is a code ("cola = meet at midnight"). Lets you call meetings without Heat. | Leave a trail for coworkers during the Tour. Can be tasted to identify the informant (someone keeps licking the wrong flavor…). | If a Candyman licks it, the code is burned for a day. |
| 2 ★ | **Hair Toffee** | Toffo in the Inventing Room (he's the test subject and has spares) | **Disguise**: grow a Candyman mustache and walk into the Mezzanine. | Give it to a bald Candyman as a bribe. Use it as a rope (the hair keeps growing). | Wears off in 3 actions, so the hair falls out mid-scene (a comic panic). |
| 3 ★ | **Fizzy Lifting Drink** | Steal it from the Fizzy Lifting Room (guarded) or buy it on the Company Store black market | **Vertical access**: float to catwalks and vents, including the penthouse vent at night. | Float a banner in the Chocolate River Room. Make a Candyman float away. | **The ceiling fan.** You have to *burp* at the right moment to come back down (a one-tap timing beat). Miss it and you get +3 Heat and a scene where you're rescued in a net. |
| 4 ★ | **Neverending Gobstopper** | Inventing Room vault. Needs the squirrels or a night break-in | **Jam a machine** and halt a production line: the **slowdown**. | Wedge a door open. Throw it as an unstoppable distraction. | Only one exists, so where you use it is a real decision. |
| 5 | **Three-Course-Dinner Gum** | Company Store (expensive) or Toffo | **Non-lethal takedown**: a guard who chews it swells into a blueberry and gets rolled to the Juicing Room. | Feed a whole picket line during the occupation (no hunger, so morale holds). | A Candyman getting juiced is a *spectacle*, and Democracy drops if you enjoy it too much. |
| 6 | **Wonka-Vision** (TV teleporter) | Operated in the Studio. Static the technician can teach you | **Broadcast**: take over every screen in the factory, and later the world, and raises Public Sympathy. | **Shrink** yourself to travel by pneumatic tube or a TV feed. Shrink the evidence to smuggle it out. | The broadcast is loud and gives an instant +2 Heat on any day before the Tour. |
| 7 | **Squirrels** (a living "invention") | Help them in the Nut Sorting Room (they're sorted into "bad nuts" and thrown down the chute too) | **Fetch keys and small objects** from anywhere they can scurry. | Chew wires (disabling Loompa-Bots). At the trial, they sit on the jury and tap Wonkmann's head to check if he's a "bad nut." | They're also workers with demands. Ignore them and they'll organize without you. |
| 8 | **Great Glass Elevator** | Needs Wonkmann's **candy-cane key** (lifted with gum, or given to you by Chip) | **The final door**: it goes sideways, slantways and *up*, straight into the penthouse. | Ride it with everyone you organized. The number of passengers is part of the ending. | One-way. Once you ride it, the endgame starts. |

**Background candies for flavor and small effects:** Rainbow Drops (you spit in 7 colors, which makes graffiti and route markers), Invisible Chocolate (lose a patrol for 1 action), Hot Ice Cream for Cold Days (survive the Freezer shortcut).

**Design rule:** every big objective can be reached in **at least 2 ways**, for example getting into the Office with Hair Toffee (disguise), Fizzy Lifting (vent) *or* the squirrels (key). Players pick based on what they have, so they feel clever instead of stuck. This is the immersive-sim principle, *Hitman* and *Deus Ex* scaled down to a browser game.

---

## 7. Rooms: what is where

★ = MVP rooms. Each lists **who's there**, **what's there** and **why you go**.

### Basement: where workers live
| Room | Who | What | Why you go |
|---|---|---|---|
| ★ **Bunkhouse** (hub) | Gramble (old-timer), off-shift workers | **The Union Wall**, your bunk (save point), evening meetings | Committee actions, planning, and seeing your Solidarity. The emotional home base. |
| ★ **Company Store** | Crumb the clerk (an informant suspect) | Candy for Scrip, a black-market counter, **Scrip receipts** (evidence) | Buy tools. Find out how the scrip trap works. Someone here talks to Slugsby. |
| **Boiler & Pipe Works** | Pip (young, reckless) | Chocolate-pipe network (secret routes), the pressure valve | Shortcuts. During the Tour, **the Main Valve (a 3-person lock)** floods or drains the River. |

### Production floor
| Room | Who | What | Why you go |
|---|---|---|---|
| ★ **Chocolate River Room** (the famous meadow) | Most of the workforce, Sister Nougat (choir director) | The waterfall mixer, the pink boat, **the stage for the Trial** | Your station. The biggest bloc. **Sister Nougat is the organic leader**: flip her and the choir flips, and the choir *is* the song. |
| ★ **Inventing Room** | Toffo (test subject) | Prototypes, the **Gobstopper vault**, the **Loompa-Bot** under a sheet, **Toffo's notebook** (evidence: inventions stolen from workers) | Your tool source. You learn the automation threat. |
| **Fizzy Lifting Room** | A bored Candyman guard | Bubbling vats, **the ceiling fan**, a vent to the Mezzanine and penthouse | Vertical access. |
| **Nut Sorting Room** | 100 squirrels, their elder "Chestnut" | The "Bad Nut" chute | Recruit the squirrels. A side-quest about non-human labor that pays off. |
| **Juicing Room** | Marzi (juicer, carries a lot of guilt) | The **Juicing Log** (evidence: every "accident," including children *and* workers) | Evidence of endangerment. Marzi's conscience arc. |

### Mezzanine: management
| Room | Who | What | Why you go |
|---|---|---|---|
| ★ **Candymen Office** | The Candymen (pastel-suited supervisors), sometimes **Mr. Slugsby** | Spy-Sweet monitors, **personnel files** (clues to the informant), **Memo drafts** (see tomorrow's move early) | Intelligence, and disabling the surveillance. |
| **Wonka-Vision Studio** | Static (technician, worn out and sarcastic) | Broadcast desk, shrink ray | **The broadcast.** Mikey Screen's big moment on Tour Day. |

### Top
| Room | Who | What | Why you go |
|---|---|---|---|
| ★ **Wonkmann's Penthouse** | Wonkmann (rarely), a sleeping pet walrus | The **Ledger** (wage theft), **the Loompaland Contract** (signed in cocoa-bean ink), the **Deed to the Factory**, the Elevator dock | The heist target. Night visits by vent are high-risk and high-reward. The final confrontation. |

**MVP cut (7 rooms):** Bunkhouse, Company Store, Chocolate River, Inventing Room, Candymen Office, Penthouse, and Fizzy Lifting (merged into the Inventing Room as a side area).

---

## 8. Cast

**Nib** (you): a mid-career line worker. Their dry inner monologue is the narrator voice (lightly *Disco Elysium* in tone, not in scale).

**Coworkers** (recruitable; each has a grievance, a fear, and a skill they bring to the plan):
| Name | Where | Grievance | Fear | Brings to the plan |
|---|---|---|---|---|
| **Gramble** | Bunkhouse | Bad back, pension "lost" | "We tried in '71, they drowned the leaders in fudge." | **Memory**: remembers the original Loompaland deal. The key trial witness. |
| **Sister Nougat** | River | Being forced to write the *moralizing songs* management uses | Losing the choir | **The Song**: the choir is the strike signal and the occupation's morale. |
| **Toffo** | Inventing | Being experimented on; inventions credited to Wonkmann | Being replaced by the bot he helped build | **Tools and the Bot shutdown code.** |
| **Pip** | Boiler | Nothing yet. Pip is young and angry at everything | Being boring | **Speed**, but raises Heat. The courage that can tip over into recklessness. |
| **Marzi** | Juicing | Guilt over what the machines do to people | Being blamed | **The Juicing Log.** Marzi's confession is the trial's emotional peak. |
| **Static** | Studio | Unpaid overtime producing propaganda | Screens (ironically) | **Broadcast operation.** |
| **Crumb** | Store | Debt to the store | Everything | Store access. **Possibly the informant.** |

**The Informant (randomized each run):** one of **Crumb, Pip or Marzi** reports to Slugsby. Clues are spread around (the wrong wallpaper flavor, personnel files, who knew about the meeting before it happened). Unmask them to cut Heat. **Win them back** instead of exposing them for a big Democracy boost: nobody gets left behind.

**Management:**
- **Wendell Wonkmann**: whimsical, charming and completely without empathy. He speaks in riddles and song so he never has to answer anything. On trial, the whimsy is his whole defense.
- **The Candymen**: pastel-suited supervisors who follow orders. At the trial they give the "*just following orders*" defense, and you can turn them into witnesses.
- **Mr. Slugsby** (of *Slugsby, Gripe & Associates*): the union-avoidance consultant. He's a parody of the original story's "rival" who turns out to work for the boss, and here that's literally his job: bribing workers to snitch.

**The Tour guests** (appear only on Day 5): Augie Glutt, Verity Brine, Violetta Chompsky, Mikey Screen, and **Chip Pail** with **Grandpa Moe**. *Moe used to work at the factory* (it's in the source!) and **was fired in the last organizing drive.** That makes Chip a potential ally and a secret path to the ending.

---

## 9. Narrative structure: the week

### Prologue / Day 1 (Monday): "The Whistle" · about 12 min · tutorial
- Nib wakes in the Bunkhouse. The first Memo: *"Productivity celebration! Quotas up 20%. Mandatory smiling."*
- At the River station, **Gramble is hurt** (he's pulled into the mixer and saved, barely). The Candymen **dock his pay** for the lost chocolate.
- **This is the inciting moment.** It teaches Look (the injury), Talk (the first one-on-one with Gramble), and Go (the Wallpaper Hall for your first candy).
- At night, your first lick-coded meeting: 2 people show up. The Union Wall has 3 faces on it.

### Day 2 (Tuesday): "Whispers" · Act I · agitate
- Open exploration. You meet Toffo (Hair Toffee), the Company Store (the scrip trap), and the Candymen Office (by disguise).
- **Discovery:** a Memo draft about the **Loompa-Bots** and a note that a *Golden Ticket Tour* is coming on Friday. The ticking clock is set.
- Management move: **Spy-Sweets installed.**

### Day 3 (Wednesday): "The Committee" · Act II · organize
- Build a committee of 3 or more, **flip one organic leader**, find the squirrels.
- **The March on the Boss:** you deliver demands in person (a set-piece). Wonkmann answers with a song and a trapdoor. *The rejection is scripted.* It gives the story (and the player) moral permission to escalate, which is how real campaigns go.
- Management move: **the Promotion Offer.** You or a leader get offered a Candyman badge. **If you accept, you get the "Supervisor Nib" ending** early (see §10).

### Day 4 (Thursday): "Work to Rule" · Act II, second half · escalate
- **The Slowdown:** jam the line with the Gobstopper, or get everyone to work *exactly* to rule. Production stalls and management panics.
- **The Night Heist (optional):** float by vent into the Penthouse to steal the Ledger and the Contract and read the Tour schedule. Timing beats with the fan and a sleeping walrus.
- **The Informant reveal / confrontation.**
- Management move: **Loompa-Bot Demonstration** or **a Firing** (whichever threat is worse for your current state).
- **The Planning Board** (evening): assign committee members to Tour Day objectives (see below).

### Day 5 (Friday): "Golden Ticket Day" · Act III · the occupation (≈15 min)
The tour happens around you. **Each kid's famous "accident" opens a window of distraction**, and your objectives are timed to those windows:

| Tour beat | Window it opens | Objective |
|---|---|---|
| Augie falls in the river and goes up the pipe | The pipes clog, so the Boiler is unguarded | **A. Stop Production**: the Main Valve (a **3-person lock**) or the Gobstopper |
| Violetta blows up into a blueberry | Candymen crowd the Juicing Room | **B. Take the Surveillance**: disable the Spy-Sweets in the Office |
| Verity gets sorted as a "bad nut" | The Nut Room is chaos | **C. Stop the Bots**: squirrels chew the wires, *or* Toffo's code |
| Mikey gets shrunk by Wonka-Vision | The Studio is open | **D. Broadcast**: Static and you seize every screen: *"We are occupying the factory."* |
| Only Chip is left | Wonkmann heads for the Elevator to crown his heir | **E. The Elevator**: get the candy-cane key, *or* convince Chip |

- **You can intervene to save the kids.** It costs time, but it raises Public Sympathy (the world is watching on Wonka-Vision) and Democracy. Letting a spoiled kid get juiced is funny, and it also says something about you. That's the mirror.
- **Sit-down occupation:** at the climax Sister Nougat's choir starts **a new song**, the first one the workers wrote themselves. The number of workers who join (Solidarity) decides whether the occupation holds when the Candymen push back.
- **The Great Glass Elevator** crashes up through every floor into the penthouse, carrying everyone you organized. Wonkmann is surrounded.

### Day 6 (Saturday): "The Snozzberry Tribunal" · Act IV · the trial (≈12 min)
Held in the Chocolate River meadow, the same place where everything was once edible and everyone was expendable.

**Format:** an *Ace Attorney*-lite structure. There are 4 charges. For each one, a witness testifies (Wonkmann, a Candyman, or Slugsby as defense counsel). You **Press** a statement or **Present** evidence at a contradiction. The jury is the **Workers' Assembly** (plus squirrels, if you recruited them), and their support meter moves with each exchange.

| Charge | Key evidence | Key witness |
|---|---|---|
| **1. Wage theft** (the scrip trap) | Ledger, Scrip receipts | Crumb |
| **2. Endangerment** of workers *and* children | Juicing Log, Gramble's injury report | Marzi (her confession) |
| **3. Theft of invention** | Toffo's notebook | Toffo |
| **4. The Loompaland Contract** (luring a people away with cocoa beans and fine print) | The Contract, the Deed | Gramble's memory |

- **"Just following orders":** a Candyman gives this defense. The tribunal (you) can reject it, which is the Nuremberg principle, *and* choose to accept his testimony against Wonkmann in exchange for leniency. Accountability vs. reconciliation is a real choice with real consequences.
- **Wonkmann's defense is whimsy.** He deflects with songs and riddles. The strongest moment in the trial is when the player's evidence stops the song. **Spell out that scene: the music cuts out mid-verse.**
- **Missing evidence isn't a hard fail.** You can still argue from testimony, but the vote is closer and some charges may not stick. The trial is the *payoff* for how you played, not a new skill test.

**Sentencing:** the Assembly votes on proposals. *You propose, they decide.* (If your Democracy score is low, **you** decide, and that should feel wrong.) The options include:
- **Work the line**: Wonkmann works a shift at union wages. *(the restorative option)*
- **Exile to Loompaland**: he goes where he took people from and has to survive on their terms.
- **The Chute / the Juicer**: poetic justice, the fates he designed turned back on him. *(Available. It darkens the ending and drops Democracy, because the game asks whether you've just built a new machine.)*
- **Pardon for testimony**: he hands over all the recipes and the deed publicly and walks away.

### Epilogue: "The New Song" · ≈3 min
Ending slides (like *Oregon Trail* or *Fallout*) cover the factory, each coworker, the squirrels, and Chip. The credits play **the song the workers wrote**, assembled from lines you picked at key moments throughout the run. It's your own verse at the end.

---

## 10. Outcomes: how you win or lose

### Failure states (soft, story-rich, and a quick checkpoint to the start of that day)
| Loss | Trigger | Ending card |
|---|---|---|
| **Reassigned** | Heat hits 10 before Friday | You're sent down the Bad Nut chute. *"The furnace is only lit on Thursdays."* A retry is offered. |
| **Supervisor Nib** | You accept Slugsby's badge | A bittersweet ending with its own epilogue: you keep the others in line. The Union Wall gets painted over. *(A full ending, not a game over. It's a valid choice and a gut-punch.)* |
| **The Machines Sing Now** | Occupation with Solidarity below the threshold, *or* the Bots weren't stopped | You get replaced. The robots sing the old moralizing songs, perfectly in tune. |
| **Strike Broken** | The occupation holds but the Surveillance and Broadcast objectives failed | Management tells the story. The factory reopens with new workers. A retry of Tour Day is offered. |

### Victory states (you take the factory, and *how* decides the flavor)
| Ending | Conditions | Tone |
|---|---|---|
| **🏆 The Cooperative** | High Solidarity, high Democracy, strong trial (3+ charges stick), restorative or exile sentence | The best ending. The factory is renamed by vote. It's still magical, and now it's safe. |
| **The New Wonkmann** | You won, but Democracy is low (you commanded, hoarded, decided the sentence alone) | The final shot: Nib in the top hat. The workers' new song has your name in it, with the rhythm of the old songs. *(Animal Farm)* |
| **Chip's Choice** | You flipped Chip and Grandpa Moe on Tour Day | Chip inherits the factory, then tears up the deed on live Wonka-Vision and hands it to the Assembly. Grandpa Moe gets his old job back, with a pension. |
| **Mob Justice** | Won the occupation but a weak trial (0–1 charges stick) *and* a harsh sentence | The factory is yours, but it's unstable. The epilogue sets up a sequel hook with Slugsby. |
| **Wonkmann Walks** | Won the occupation, weak trial, merciful sentence | He opens a new factory across town. You keep yours. A funny-sad ending. |
| **🐿 Nut Union** (secret) | Squirrels fully recruited and seated on the jury | The squirrels deliver the verdict. It's absurd, a crowd-pleaser, and something to share. |

**Why this works:** people remember games that judge *how* you played rather than *how well*. Players compare endings, argue about them, and replay. Aiming for "The Cooperative" gives completionists a clear goal. The other endings make the moral point on their own.

---

## 11. The golden path (the critical path, and how you actually win)

A puzzle dependency chart, in the way Ron Gilbert plans point-and-clicks. **Bold** = a required gate. *Italic* = an alternative route.

```
DAY 1  Gramble injured ─► 1-on-1 Gramble ─► Wallpaper swatch ─► first night meeting
                                                    │  (secret comms unlocked)
DAY 2  Toffo 1-on-1 ─► HAIR TOFFEE ─► Candymen Office ─► learn: Bots + Tour Friday
       Company Store ─► Scrip receipts (evidence)         + informant clue #1
                                                    │
DAY 3  Flip SISTER NOUGAT (organic leader) ─► River bloc lit ─► COMMITTEE ≥ 3
       Nut Room ─► help squirrels ─► SQUIRRELS ─► fetch GOBSTOPPER from vault
       March on the Boss (scripted rejection) · refuse the Promotion
                                                    │
DAY 4  Slowdown (Gobstopper or work-to-rule) ─► management panics
       Night: FIZZY LIFTING ─► vent ─► Penthouse ─► LEDGER + CONTRACT
            (alt: Hair Toffee disguise by day · alt: squirrels fetch key)
       Unmask or win back the Informant
       PLANNING BOARD: assign people to objectives A–E
                                                    │
DAY 5  A: Main Valve (3 PEOPLE) or Gobstopper
       B: Spy-Sweets off (Hair Toffee / squirrels)
       C: Bots off (squirrels / Toffo code)
       D: Broadcast (Static + you)
       E: Candy-cane key (3-Course Gum on Slugsby / Chip hands it over)
       ─► THE NEW SONG (Solidarity check) ─► GREAT GLASS ELEVATOR ─► Penthouse
                                                    │
DAY 6  Tribunal: 4 charges × evidence ─► Assembly vote ─► Sentence ─► Epilogue
```

**Minimum to win:** A + C + E and a Solidarity threshold. B and D make it much easier and push the ending toward the better outcomes.

---

## 12. Tone, sensitivity & IP

- **Punch up.** The satire targets the owner, the consultant, and the system. Workers are never the joke. They're the funny, warm, specific heart of the game.
- **Oompa-Loompa history:** in the original book they were first drawn as African pygmies "imported" by Wonka, and this was revised in 1973 after criticism. The parody should **face that directly instead of repeating it**. The Loompaland Contract charge *is* the story of that extraction. Give the workers their own culture, humor, names and language. No caricature.
- **The Nuremberg reference** is structural (accountability for people who give orders and people who follow them, rejecting "just following orders"), not a comparison of atrocities. The tribunal is whimsical in costume and serious in principle.
- **IP:** use parody names throughout (Wonkmann, Candymen, Slugsby, the kids). "Oompa" is fine as a working title. **Before any commercial release, rename the workers** (e.g. *Umpahs*, *Loomies*) and avoid the protected character names, songs and specific likenesses. Parody gets you a long way, but don't lean on it for merch.
- **Kids in peril** stays in the source's slapstick register: nobody dies, and every kid can be saved.

---

## 13. Tech recommendation: light, beautiful, browser-native

**Recommendation: [ink](https://www.inklestudios.com/ink/) (with `inkjs`) for all narrative and state, plus a hand-built vanilla HTML/CSS/JS shell for the map, scenes, inventory and meters. One `index.html`, no framework, no build step to start.**

Why:
- **ink** is the proven standard for exactly this kind of game: *80 Days*, *Heaven's Vault*, *Sorcery!*, *Overboard!*, and a lot of indie hits. It handles branching dialogue, variables, conditions, knots and weighted choices *far* better than hand-rolled JSON, and writers can work in it directly. `inkjs` runs natively in the browser.
- **Vanilla JS/CSS shell:** the map is an SVG with clickable room groups. Scenes are a full-screen illustration with absolutely positioned hotspot buttons. Meters and inventory are DOM. CSS transitions handle the juice. It stays small (under ~3 MB with art), loads instantly, works offline, and runs well on phones.
- **Save/load:** `story.state.toJson()` goes into `localStorage`. Autosave at every day boundary (the checkpoints).

**Alternatives considered:**
| Tool | Verdict |
|---|---|
| Twine (SugarCube/Harlowe) | Great for prototyping the story in a weekend. Becomes spaghetti at this much state, and the map/hotspot UI fights the format. **Use it for a paper prototype, not the build.** |
| Decker (HyperCard-like) | Charming and 1-bit, with built-in hotspots. A strong choice if we go lo-fi retro. Keep in mind for the aesthetics phase. |
| Bitsy | Too limited for the systems. |
| Godot / Unity web export | Too heavy for what's essentially a story game with a map. Slow mobile load. |
| Phaser | Only worth it if we add real-time action (we shouldn't). |
| React/Svelte | Fine, but not needed. Reconsider only if the UI grows a lot. |

**Architecture sketch:**
```
index.html
├── story/oompa.ink           ← all writing, choices, variables (compiled to .json)
├── js/
│   ├── engine.js             ← loads inkjs story, bridges ink ⇄ UI
│   ├── map.js                ← SVG cutaway, room states, travel & action cost
│   ├── scene.js              ← room illustration + hotspots
│   ├── clock.js              ← day/action/Heat/Management clocks
│   └── ui.js                 ← dialogue box, inventory, Union Wall, dossier
├── art/                      ← rooms, portraits, map, icons
└── audio/                    ← ambience per room, the Song (layered stems)
```
ink owns the **truth** (variables such as `solidarity`, `heat`, `democracy`, `has_gobstopper`). JS reads the tags ink emits (`# room: inventing`, `# portrait: toffo_worried`, `# sfx: burp`) and calls ink external functions for things like `travel(room)`.

**A nice audio idea for later:** the workers' Song is built from **stems that unlock as departments join**, so the soundtrack literally gets fuller as solidarity grows. (*Rez* / *Celeste*-style adaptive music, done cheaply.)

---

## 14. Production plan

| Milestone | Contents | Goal |
|---|---|---|
| **M0: Paper prototype** (1 wk) | Twine or index cards. Days 1–2, meters on paper. | Is the work-vs-organize squeeze fun? Is the one-on-one satisfying? |
| **M1: Vertical slice** (2–3 wks) | Real shell: map + 4 rooms + 2 candies + 2 coworkers, Day 1 and Day 2, placeholder art | The loop feels good on a phone. |
| **M2: Full week** (4–6 wks) | All organizing days, 7 MVP rooms, 4 MVP candies, informant system, Management deck | Complete the Day 1–4 arc. |
| **M3: Tour Day + Trial** (3–4 wks) | The occupation set-piece, tribunal system, 5 core endings | Playable start to finish. |
| **M4: Content complete** (3 wks) | All 12 rooms, 8 candies, 7 coworkers, all endings, the Song | Feature-complete. |
| **M5: Aesthetics & polish** | Art direction, audio, juice, accessibility (text size, reduced motion, color-blind-safe meters) | *(Next conversation.)* |

---

## 15. Open questions for the next pass

1. **Voice:** how dark does the comedy go? My recommendation is a *Night in the Woods* level, not *Rick & Morty*.
2. **Chip's role:** is Chip a playable POV for a single Tour Day scene (you see the tour from the other side)? It would be a strong change of perspective.
3. **The Song:** do we want actual melody and lyrics, and a musician collaborator?
4. **Randomization depth:** is only the informant randomized, or also the Management deck order and the Tour beat order? More randomization means more replays but is harder to write.
5. **Art direction:** paper cutout? Risograph? 1-bit Decker? Lush gouache? *(Next session.)*
