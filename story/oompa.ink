// OOMPA OUT: vertical slice (Monday and Tuesday)
//
// Conventions the game shell (js/game.js) relies on:
//   Line tags     #s:<speaker>    who is talking (no tag = Nib's narration)
//                 #memo           render the line as a management memo
//                 #daycard:<Day>  big day title card
//                 #get:<item>     "got item" stamp
//                 #ev:<evidence>  "evidence" stamp
//                 #joined:<who>   "joined the union" stamp
//                 #goto:<room>    move Nib to a room once this knot finishes
//                 #checkpoint     save a retry point once this knot finishes
//                 #end / #gameover
//   Choice tags   #hint:<beat>    small label on a choice (listen, agitate…)
//
// The shell spends actions for hotspots and travel. Knots only refund
// (~ actions = actions + 1) or spend extra for optional costly choices.

// ---------- the clock ----------
VAR day = 1
VAR actions = 6
VAR room = "bunkhouse"
VAR goal = ""
VAR worked_today = 0

// ---------- meters ----------
VAR heat = 0
VAR solidarity = 1
VAR scrip = 2
VAR democracy = 0

// ---------- pocket ----------
VAR has_wallpaper = false
VAR has_toffee = 0
VAR disguise = 0

// ---------- evidence ----------
VAR ev_paystub = false
VAR ev_testlog = false
VAR ev_botmemo = false
VAR ev_file = false

// ---------- what Nib knows ----------
VAR knows_tour = false
VAR knows_bots = false
VAR knows_spy = false
VAR knows_slugsby = false
VAR knows_contract = false
VAR knows_offswitch = false
VAR saw_bot = false

// ---------- people ----------
VAR gramble_met = false
VAR gramble_clue = false
VAR gramble_joined = false
VAR gramble_blocked = 0
VAR gramble_inoc = false

VAR toffo_met = false
VAR toffo_clue = false
VAR toffo_hair = false
VAR toffo_theft = false
VAR toffo_joined = false
VAR toffo_blocked = 0
VAR toffo_inoc = false
VAR toffo_doubt = false

VAR line_joined = false
VAR old_timers = false
VAR testers = false
VAR heard_toffo = false

// ---------- world ----------
VAR injury_seen = false
VAR spoke_up = false
VAR spy_seen = false
VAR spysweets_on = false
VAR office_seen = false
VAR meetings = 0
VAR asked_needs = false

=== function heat_up(n) ===
~ heat = MIN(heat + n, 10)

=== function cool(n) ===
~ heat = MAX(heat - n, 0)

=== function sol(n) ===
~ solidarity = MAX(solidarity + n, 1)

// =====================================================================
//  MONDAY
// =====================================================================

=== intro ===
MONDAY #daycard:Monday
The whistle goes at five. It always goes at five.
In the dark of the Bunkhouse, forty workers roll out of forty bunks built for thirty.
"Goooood morning, family!" #s:wonkmann
The loudspeaker is shaped like a smiling cocoa bean. Mr. Wonkmann's voice comes out of it like syrup out of a drain.
MEMO FROM THE DESK OF W. WONKMANN #memo
It's Productivity Celebration Week! Quotas are up 20%. Smiling is now mandatory. Frowns will be docked by the minute. #memo
I've stirred chocolate in this factory for eleven years. I have never once been celebrated.
~ goal = "Go to your station: the Chocolate River Room"
My station is the Chocolate River Room. Best not be late. #checkpoint
-> DONE

// =====================================================================
//  CHOCOLATE RIVER ROOM
// =====================================================================

=== enter_river ===
{ day == 1 and not injury_seen: -> injury }
{ day == 2 and not spy_seen: -> spysweets_intro }
-> DONE

=== injury ===
~ injury_seen = true
The Chocolate River Room. Everything in here is edible: the grass, the trees, the teacups. Everything except the wages.
Gramble is working the waterfall mixer, the big one. Candyman Pomfrey walks the bank in a pink suit, counting under his breath.
"Quota, quota, quota. Twenty percent, family. Smiles on!" #s:pomfrey
Gramble reaches into the blades to clear a clog. His boot slips on the toffee-grass.
He goes in.
For one second there is only chocolate, moving fast. Then Pip has the oar, I have Pip's belt, and the three of us haul Gramble onto the bank like a very sad cake.
Pomfrey writes something down.
"Eleven gallons of premium, contaminated. Docked: three days." #s:pomfrey
+ [Say nothing.]
    Nobody says anything. It's the loudest sound in the room.
+ ["He nearly DIED."]
    ~ heat_up(1)
    ~ spoke_up = true
    "And the chocolate did die," says Pomfrey. "Write-up for tone." #s:pomfrey
    A few heads on the line turn my way. They noticed. So did Pomfrey.
- They carry Gramble down to the Bunkhouse. The line goes back to stirring. The waterfall doesn't even slow down.
~ goal = "Talk to Gramble in the Bunkhouse"
Gramble has been here longer than anyone. If anyone could make this room stop stirring, it's him.
-> DONE

=== spysweets_intro ===
~ spy_seen = true
Overnight, someone has set a small square sweet on top of every fence post.
The sweets look round. They look at me, specifically.
"Just a little freshness monitoring," Pomfrey beams. "Nothing to worry about, unless you're stale." #s:pomfrey
{ has_wallpaper:
    Talking in here will get noticed now. Good thing wallpaper doesn't talk.
- else:
    Talking in here will get noticed now. I need a quieter way to pass messages.
}
-> DONE

=== river_work ===
~ scrip = scrip + 2
~ worked_today = worked_today + 1
{ shuffle:
    - I stir. The river turns. My shoulders file a complaint with my elbows.
    - Stir, stir, stir. A chocolate bubble pops and says nothing, which is more than I'm allowed to.
    - I stir until the oar and I are the same temperature.
}
Two beans of Scrip, stamped with Mr. Wonkmann's smiling face. They're only good at the Company Store, where the prices are also his.
-> DONE

=== river_line ===
{ line_joined:
    The line gives me small nods as I pass: the kind you give someone on your side.
    ~ actions = actions + 1
    -> DONE
}
{ day == 2 and spysweets_on:
    { has_wallpaper:
        The Spy-Sweets are watching, so I don't talk. I pass a torn corner of wallpaper down the line. Everyone knows lime means yes.
    - else:
        I lean in to whisper and a Spy-Sweet swivels. Somewhere upstairs, a Candyman makes a note.
        ~ heat_up(1)
    }
}
{ gramble_joined:
    "Gramble's with you?" says Pip. #s:pip
    It goes down the line in whispers. Gramble's with you. Gramble's with you. Gramble's with you.
    ~ line_joined = true
    ~ sol(3)
    By the end of the row, three more names are promised for the wall. #joined:River Room line
    ~ goal = "Call a meeting tonight"
- else:
    The line keeps its eyes on the chocolate.
    "Nobody's going first, Nib," Pip mutters. "Not after '71. Gramble's the one they watch. Get Gramble, you get the river." #s:pip
    { not heard_toffo:
        ~ heard_toffo = true
        "And if you want real misery, go look at the tester up in Inventing. Poor kid's more hair than person." #s:pip
    }
}
-> DONE

=== river_pomfrey ===
Pomfrey is polishing his clipboard with his sleeve.
"Nib! Smiling, I hope? Smiles are up twenty percent." #s:pomfrey
+ [Ask what's happening on Friday.]
    ~ knows_tour = true
    "Guests!" he whispers, delighted. "Five children with Golden Tickets. Mr. Wonkmann is choosing an heir, apparently. So stir faster." #s:pomfrey
+ {scrip >= 3} [Slip him 3 Scrip "for the fudge fund". (−2 Heat)]
    ~ scrip = scrip - 3
    ~ cool(2)
    The beans vanish into a pink pocket. "I didn't see that. And I also didn't see whatever you do next." #s:pomfrey
+ [Ask for a raise.]
    ~ heat_up(1)
    "A RAISE!" He writes it down, wheezing. "Write-up for comedy. Oh, that's a good one." #s:pomfrey
+ [Never mind.]
    "Never minding is my favourite thing a worker can do," says Pomfrey. #s:pomfrey
- -> DONE

=== river_mixer ===
The waterfall mixer churns the river into froth. A brass plate on the rail: SAFETY IS EVERYONE'S RESPONSIBILITY (EXCEPT MANAGEMENT'S).
Someone has scratched four small marks into the rail.
{ injury_seen: Next to them, lightly, a fifth, with a question mark. }
-> DONE

=== river_spysweet ===
{ spysweets_on:
    A square sweet on a fence post. It looks round. It looks at me. I look back. It wins.
- else:
    The sweet on this post is facing the fence now. It seems very interested in the fence.
}
-> DONE

// =====================================================================
//  BUNKHOUSE
// =====================================================================

=== bunk_nib ===
My bunk: third from the stove, second from the top, a mattress stuffed with rejected nougat.
+ [Take a nap. (1 action, −1 Heat)]
    ~ actions = actions - 1
    ~ cool(1)
    Forty winks, in a bunk built for thirty.
+ [Get up.]
- -> DONE

=== bunk_stub ===
Gramble's pay slip is tucked under his tin cup.
PAY PERIOD WEEK 38. DEDUCTIONS: LOSS OF PRODUCT (SELF), 3 DAYS. BUNK RENT. BRACE RENTAL (LIQUORICE). NET PAY: 4 BEANS. #memo
~ gramble_clue = true
Four beans. After eleven years.
+ {not ev_paystub} [Copy it onto a wrapper. #hint:evidence]
    ~ ev_paystub = true
    I copy it down on the back of a wrapper, every number. #ev:Gramble's docked pay slip
+ [Leave it.]
- -> DONE

=== bunk_wall ===
{ solidarity <= 1:
    A bare patch of wall by the stove. Someone scratched NIB WAS HERE into it years ago. It was me.
    A union wall needs names. Right now it has one.
- else:
    The Union Wall: {solidarity} names in chalk by the stove, under a drawing of a fist holding a spoon.
    { solidarity >= 6: It's starting to look less like graffiti and more like a list. | }
    We need 21 for a majority of the floor.
}
-> DONE

=== bunk_speaker ===
The cocoa-bean loudspeaker smiles down at forty bunks. It smiles all night, too.
"Remember, family: a happy worker is a worker!" #s:wonkmann
-> DONE

// ---------- Gramble ----------

=== gramble ===
{ gramble_joined: -> gramble_ally }
{ gramble_blocked == day:
    Gramble is facing the wall. It's a very clear wall.
    ~ actions = actions + 1
    -> DONE
}
{ gramble_met:
    Gramble shifts on his bunk. The liquorice brace creaks.
- else:
    ~ gramble_met = true
    Gramble is propped up in his bunk in a back brace made of liquorice. In eleven years, I have never seen him lie down in daylight.
}
"Don't make the face," he says. "Everyone's been making the face." #s:gramble
-> listen

= listen
+ [How's the back? #hint:listen]
    "Like a pretzel somebody sat on. Twice." #s:gramble
    "And they docked me three days. For the chocolate I spilled. Into the river. That I fell into." #s:gramble
    -> agitate
+ [What did Pomfrey write on his clipboard? #hint:listen]
    "'Loss of product.'" He snorts. "That's me. I'm the loss of product." #s:gramble
    -> agitate
+ [Gramble. Comrade. The hour of the worker has come. #hint:preach]
    Gramble looks at me for a long time.
    "I've heard that song, kid. The last verse is everybody in the fudge." #s:gramble
    He rolls over to face the wall.
    ~ gramble_blocked = day
    Too big, too soon. Nobody joins a slogan. They join someone who listened.
    -> DONE

= agitate
+ {gramble_clue} [Four beans, Gramble. Net. After eleven years. #hint:agitate]
    He stares at me. "You read my slip?" #s:gramble
    "Somebody should." #s:nib
    "...Four beans." He laughs, and it hurts his back, and he laughs anyway. #s:gramble
    -> hope
+ [Three days' pay. For almost dying. #hint:agitate]
    "When you say it like that, it sounds bad." #s:gramble
    "It is bad." #s:nib
    "...Yeah. It's bad." #s:gramble
    -> hope
+ [Well. Rules are rules.]
    "Exactly. So off you go." #s:gramble
    He shuts his eyes. That's that.
    ~ gramble_blocked = day
    -> DONE

= hope
+ [That mixer's taken four people this year. It isn't just you. #hint:hope]
    "Four." He counts on his fingers. "Tamsin. Pip's cousin. The twins, but that was one incident." #s:gramble
+ [If we all stopped, they couldn't dock all of us. #hint:hope]
    "They could try. They've got a lot of docking in them." #s:gramble
- He's quiet. Then, low:
"We tried, you know. In '71. They picked off whoever talked loudest and, well. The Fudge Room was very busy that week." #s:gramble
+ [That's why we don't start with leaders. We start with everyone. #hint:hope]
    ~ democracy = democracy + 1
    "Everyone." He tries the word out. "Everyone's harder to drown." #s:gramble
+ [This time I'll lead. They'll have to get through me first.]
    ~ democracy = democracy - 1
    "That's what Hollis said," says Gramble. "Lovely man. Very brave. Very sticky, at the end." #s:gramble
- -> ask

= ask
+ [Come to the Bunkhouse meeting after the whistle. Just listen. #hint:ask]
    -> join
+ [Put your name on the wall. Tonight. #hint:ask]
    -> join
+ [Just... think about it.]
    "Oh, I will. I'll think about it for another thirty years." #s:gramble
    Too vague. Give people something they can actually say yes to.
    ~ gramble_blocked = day
    -> DONE

= join
~ gramble_joined = true
~ sol(1)
"...Alright," Gramble says. "I'll come. I'll listen. That's all." #s:gramble #joined:Gramble
It isn't all. He's the one the old-timers watch. If Gramble goes, the River Room goes.
~ goal = "Tell the River Room line that Gramble's in"
-> DONE

=== gramble_ally ===
Gramble is re-lacing his brace. He looks almost cheerful, which on him looks like indigestion.
+ {day == 2 and not gramble_inoc} [Warn him about tonight's Song Rehearsal. #hint:inoculate]
    "Tonight they'll sit us down and sing at us. They'll say the union wants your bunk. Your pension. Your spot by the heater." #s:nib
    "My spot by the heater?" #s:gramble
    "They'll say it. It won't be true." #s:nib
    "Huh. Good to know the lie before they tell it." #s:gramble
    ~ gramble_inoc = true
    Warn people about the boss's move before it happens, and it doesn't hit as hard. Organizers call it inoculation.
+ {not knows_contract} [Ask about Loompaland.]
    ~ knows_contract = true
    "Before the contract? Trees you could climb for a week. Cocoa growing wild. Then he turned up in a purple coat, offering beans by the bucket." #s:gramble
    "Nobody read the small print. Nobody could. It was written in chocolate, and it was a hot day." #s:gramble
+ [Ask how the others are feeling.]
    { line_joined:
        "The river lot are talking. First time in years. Nobody's shushing them, either." #s:gramble
    - else:
        "Scared. They'll move if they see the line move. Go and talk to them. Tell 'em I sent you." #s:gramble
    }
+ [Let him rest.]
    ~ actions = actions + 1
    He waves me off. "Go on. Organize something." #s:gramble
- -> DONE

// =====================================================================
//  CORRIDOR OF DOORS
// =====================================================================

=== hall_wallpaper ===
The Corridor of Doors is papered in lickable wallpaper: snozzberry, lime, cola, pear. Management calls it enrichment. Workers call it lunch.
-> options

= options
+ [Lick the snozzberry.]
    It tastes of snozzberry. Nobody knows what a snozzberry is, and it tastes exactly like one.
    -> options
+ {not has_wallpaper} [Tear off a swatch. (1 action) #hint:tool]
    ~ actions = actions - 1
    ~ has_wallpaper = true
    A strip comes away: four flavors, one of each. #get:Lickable Wallpaper
    Every worker knows the flavors. Nobody writes the code down, and that's the point.
    COLA: meet at midnight. LIME: yes. PEAR: careful, someone's listening. SNOZZBERRY: I love you, or occasionally "pass the salt." #memo
    Now I can call a meeting without anyone upstairs hearing about it.
+ [Leave it.]
- -> DONE

=== hall_door ===
A narrow stair going up. At the bottom, a desk. At the desk, Mr. Lintel: a Candyman so pink he's nearly a ham. A sign reads CANDYMEN ONLY.
{ disguise > 0: -> waved_through }
"Workers use the other stairs." #s:lintel
+ {has_toffee > 0} [Eat a Hair Toffee. #hint:tool]
    ~ has_toffee = has_toffee - 1
    ~ disguise = 3
    My scalp prickles. Then a mustache arrives like a rumour: all at once, and everybody believes it.
    "Oh! Morning, sir. Didn't see you there." #s:lintel
    Up I go. It'll only last three actions. #goto:office
+ [Try to walk past anyway.]
    ~ heat_up(1)
    "There are no other stairs," I point out. #s:nib
    "Exactly," says Lintel, and writes down my number. #s:lintel
    { has_toffee == 0: If I looked like management, he wouldn't look twice. }
+ [Leave.]
- -> DONE

= waved_through
"Morning, sir," says Lintel, admiring the mustache. #s:lintel
+ [Head upstairs.]
    Up I go. #goto:office
+ [Not yet.]
- -> DONE

=== hall_fizzy ===
A round door: FIZZY LIFTING DRINKS. It hums. Something behind it burps, politely.
Locked. For now.
-> DONE

=== hall_suggestion ===
A brass box: SUGGESTIONS. Underneath, in smaller letters: All suggestions become the property of Wonkmann Confectionery Works.
+ [Post a suggestion: "Pay us."]
    It goes in with a soft thunk and, I'm fairly sure, a shredder.
+ [Leave it.]
- -> DONE

// =====================================================================
//  INVENTING ROOM
// =====================================================================

=== toffo ===
{ toffo_joined: -> toffo_ally }
{ toffo_blocked == day:
    Toffo sees me coming and hides behind a shelf. His hair doesn't fit behind it.
    ~ actions = actions + 1
    -> DONE
}
{ toffo_met:
    Toffo is trimming his eyebrows with the focus of a bomb technician.
- else:
    ~ toffo_met = true
    The Inventing Room tester is a young man made mostly of hair. It grows while I watch. He holds his scissors like someone who's held a lot of scissors.
}
"Oh no. Are you from Quality? I'm on schedule. I'm so on schedule." #s:toffo
-> listen

= listen
+ [That's... a lot of hair. #hint:listen]
    ~ toffo_hair = true
    "Six weeks of Hair Toffee trials. I shave my eyebrows at lunch. Every lunch." #s:toffo
    -> agitate
+ [What are you working on? #hint:listen]
    ~ toffo_theft = true
    His face lights up. "A gobstopper that never, ever..." He stops. "Sorry. It's not mine. It's his. Everything's his." #s:toffo
    -> agitate
+ [Comrade! The means of production... #hint:preach]
    "The means of production are on my FACE," Toffo hisses. "Please go before somebody sees us talking." #s:toffo
    ~ toffo_blocked = day
    ~ heat_up(1)
    He says it loudly enough that a Candyman looks over.
    -> DONE

= agitate
+ {toffo_clue} [Your test log says "Compensation: exposure to innovation." #hint:agitate]
    "You read that?" He goes pink under the fur. "I read it a lot. I'm very exposed. I've never been paid for a single test hour." #s:toffo
    He looks at me differently now: like someone who got noticed.
    -> hope
+ {toffo_hair} [Six weeks. Were those hours on your pay slip? #hint:agitate]
    "Test hours aren't hours," he recites. "They're a privilege." He hears himself say it. "...That's not true, is it." #s:toffo
    -> hope
+ {toffo_theft} [You invented that gobstopper, and he signs it. #hint:agitate]
    "He signs everything. He signed the birthday card I made for myself." #s:toffo
    -> hope
+ [Nice work if you can get it. Free candy!]
    "...Yes," says Toffo. "Lucky me." #s:toffo
    He goes back to his scissors. I've missed something.
    ~ toffo_blocked = day
    -> DONE

= hope
"If I make trouble, they'll just replace me." He glances at the dust sheet in the corner. "They've got something." #s:toffo
+ {saw_bot} [I looked under the sheet. One of forty. #hint:hope]
    "You LOOKED?" A long breath. "Then you know. I built its hands. I built the hands that'll do my job." #s:toffo
    "Then you know how it works. Nobody else does." #s:nib
    ~ knows_offswitch = true
    "...It has an off switch," he whispers. "I put one in. Nobody asked me to." #s:toffo
+ [They can't replace all of us at once. Not if we move together. #hint:hope]
    "All of us." He pulls a hair off his tongue. "That's a lot of us." #s:toffo
+ [The robot's years away. Relax.]
    ~ toffo_doubt = true
    "It's under a sheet twenty feet from us," says Toffo flatly. #s:toffo
- -> ask

= ask
+ [Come to the Bunkhouse after the whistle. You won't be the only one. #hint:ask]
    { toffo_doubt:
        ~ toffo_doubt = false
        ~ toffo_blocked = day
        "...Maybe," he says. It sounds like no. #s:toffo
        I brushed off the thing he's most afraid of. Next time, take the fear seriously.
        -> DONE
    }
    -> join
+ [Just give me some Hair Toffee.]
    His face shuts like a shop at five o'clock.
    ~ has_toffee = has_toffee + 1
    ~ democracy = democracy - 1
    ~ toffo_blocked = day
    "Oh. That's what this was." He drops one wrapped toffee in my palm. "Take it. Everybody takes something." #s:toffo #get:Hair Toffee
    -> DONE

= join
~ toffo_joined = true
~ sol(1)
"Okay," Toffo says. "Okay. I'll come." #s:toffo #joined:Toffo
{ toffo_clue:
    ~ has_toffee = has_toffee + 3
    He digs in his apron and presses three wrapped toffees into my hand. "One for reading my log. Nobody reads my log." #s:toffo #get:Hair Toffee ×3
- else:
    ~ has_toffee = has_toffee + 2
    He digs in his apron and presses two wrapped toffees into my hand. #s:toffo #get:Hair Toffee ×2
}
"Hair Toffee. It lasts about three actions. Don't use it on your eyebrows." #s:toffo
~ goal = "Call a meeting tonight"
-> DONE

=== toffo_ally ===
Toffo waves with his whole head of hair.
+ {day == 2 and not toffo_inoc} [Warn him about tonight's Song Rehearsal. #hint:inoculate]
    "Tonight they'll say the union just gets you replaced faster." #s:nib
    "But the bot's already..." He stops. "Oh. They'll use my own fear against me." #s:toffo
    "And now you'll see it coming." #s:nib
    ~ toffo_inoc = true
    Warn people about the boss's move before it happens, and it doesn't hit as hard. Organizers call it inoculation.
+ {has_toffee == 0} [Ask for more Hair Toffee.]
    ~ has_toffee = has_toffee + 1
    "They count them," he says, and hands me one anyway. #s:toffo #get:Hair Toffee
+ {saw_bot and not knows_offswitch} [Ask about the thing under the sheet.]
    ~ knows_offswitch = true
    He checks over both shoulders. "It has an off switch. I put one in. Nobody asked me to." #s:toffo
+ [Just check in.]
    ~ actions = actions + 1
    "Still hairy. Still here." #s:toffo
- -> DONE

=== inv_clipboard ===
A clipboard hangs on the test chair.
TEST SUBJECT: TOFFO. DAYS IN TRIAL: 42. SIDE EFFECTS: YES. COMPENSATION: EXPOSURE TO INNOVATION. #memo
~ toffo_clue = true
+ {not ev_testlog} [Tear off the carbon copy. #hint:evidence]
    ~ ev_testlog = true
    It comes away with a very satisfying rip. Nobody looks up. #ev:Toffo's test log
+ [Leave it.]
- -> DONE

=== inv_sheet ===
{ saw_bot:
    Still there. Still under the sheet. Still one of forty.
    -> DONE
}
Something under a dust sheet in the corner. About my height. About my shape.
+ [Lift the corner. (+1 Heat) #hint:risky]
    ~ saw_bot = true
    ~ heat_up(1)
    A face like mine, only polished. Stencilled on its chest: LOOMPA-BOT MK I. REPLACEMENT SERIES. UNIT 1 OF 40.
    I lower the sheet very gently, the way you would over someone sleeping.
+ [Leave it.]
- -> DONE

=== inv_jar ===
A glass jar: HAIR TOFFEE. PROTOTYPE. DO NOT EAT (EXCEPT TOFFO).
+ [Pocket one. (+2 Heat) #hint:risky]
    ~ has_toffee = has_toffee + 1
    ~ heat_up(2)
    { toffo_joined:
        Toffo sees, and sighs. "You could just ask." #s:toffo #get:Hair Toffee
    - else:
        Toffo sees. He doesn't say anything. He doesn't need to. #get:Hair Toffee
    }
+ [Leave it.]
- -> DONE

=== inv_vault ===
A steel vault with a keyhole at knee height. Squirrel height. Stencilled on the door: EVERLASTING GOBSTOPPER. PROPERTY OF W. WONKMANN.
Toffo glances at it the way you'd glance at your own name spelled wrong.
-> DONE

// =====================================================================
//  CANDYMEN OFFICE
// =====================================================================

=== enter_office ===
{ office_seen:
    Pastel carpet. Pastel desks. Nobody looks up.
- else:
    ~ office_seen = true
    The Candymen Office. Pastel carpet, pastel desks, and pastel men, all with mustaches exactly like mine.
    Nobody looks twice at a mustache up here.
    ~ goal = "Find out what management is planning"
}
My upper lip itches. I don't have long.
-> DONE

=== office_memos ===
The OUTBOX tray. The top memo is stamped in pink: CONFIDENTIAL.
RE: LOOMPA-BOT MK I. Forty units ordered. Deploy immediately after Friday's Golden Ticket Tour, once an heir is chosen. DO NOT INFORM STAFF. Staff may "feel things." W.W. #memo
~ knows_tour = true
~ knows_bots = true
+ [Pocket it. (+1 Heat) #hint:evidence]
    ~ ev_botmemo = true
    ~ heat_up(1)
    It goes in my sock. #ev:Loompa-Bot memo
+ [Memorise it and put it back.]
    Friday. Forty. After the tour. I say it three times in my head.
- -> DONE

=== office_files ===
Personnel files, alphabetical, in candy-striped folders.
+ {not ev_file} [Find Gramble's file.]
    GRAMBLE. 1971: "Agitator. Recommend: Fudge Room." A second stamp across it: "Recommendation carried out (on others)." #memo
    + + [Take it. (+1 Heat) #hint:evidence]
        ~ ev_file = true
        ~ heat_up(1)
        It goes up my sleeve. #ev:Gramble's 1971 file
    + + [Put it back.]
        I put it back. I won't forget it, though.
    - -
+ [Look up my own file.]
    NIB. Stirrer, River Room. {heat >= 5: NOTES: "Watch closely. Possible attitude." | NOTES: "Adequate. Unremarkable. Smiles: 61%."} #memo
    { heat >= 5: That's not good. | Unremarkable. Let's keep it that way. }
- -> DONE

=== office_monitors ===
A wall of little screens, one for every Spy-Sweet in the factory.
{ day == 1:
    ~ knows_spy = true
    Most of them just show static. A crate by the wall is stencilled SPY-SWEETS. INSTALL TUESDAY. RIVER ROOM FIRST.
    So that's tomorrow's surprise.
    -> DONE
}
{ not spysweets_on:
    The River Room feed still shows a fence. It's riveting.
    -> DONE
}
The River Room feed is a sea of bowed heads. One of them is Pip, picking his nose.
+ [Nudge the River Room sweets to face the fence. #hint:sabotage]
    ~ spysweets_on = false
    A little dial, a little click. The River Room feed is now a lovely study of fence.
    Anyone can talk in the River Room today.
+ [Leave them.]
- -> DONE

=== office_candyman ===
The Candyman at the next desk leans over. "New? Great mustache. Very on-brand." #s:candyman
+ [Ask what the big news is.]
    ~ knows_slugsby = true
    "A consultant's coming. A Mr. Slugsby. Specialist in family harmony. At the last factory he visited, the family stopped harmonising altogether." #s:candyman
+ [Ask what he thinks of the workers.]
    "Lovely little people. Very musical. You'd hardly know they were there." #s:candyman
    He means it kindly, which is the worst part.
- -> DONE

=== office_exit ===
I straighten my mustache and walk out like I own the place. #goto:hall
Nobody owns this place. Well. Somebody does. For now.
-> DONE

=== caught ===
~ disguise = 0
~ heat_up(3)
My mustache drops into a Candyman's tea. Everyone watches it land.
"That," says the Candyman, "is not regulation." #s:candyman
They march me down the stairs by the collar and drop me in the corridor. #goto:hall
-> DONE

// =====================================================================
//  EVENING, NIGHT, NEXT DAY
// =====================================================================

=== evening ===
The whistle. Forty pairs of tired feet shuffle down to the Bunkhouse.
{ worked_today == 0:
    ~ heat_up(2)
    Pomfrey noticed my oar standing idle all day. That goes in a file somewhere.
}
{ day == 2: -> rehearsal }
-> committee

=== rehearsal ===
Before anyone can sit down, the loudspeaker crackles: MANDATORY SONG REHEARSAL. Everybody up.
Pomfrey conducts. The song is new. It's about a greedy little worker who asked for more and got fed to the furnace. It rhymes "union" with "ruin" and gets away with it.
"Remember, family," Pomfrey says between verses. "A union is a scheme to take your bunk, your heater spot, your pension. And the bots... well. The bots never ask for anything." #s:pomfrey
{ gramble_joined:
    { gramble_inoc:
        Gramble catches my eye and mouths "heater spot." He nearly laughs. He heard the lie before they told it.
    - else:
        Gramble goes quiet at "pension." He doesn't look at me for the rest of the song.
        ~ sol(-1)
    }
}
{ line_joined and not gramble_inoc:
    The River Room line watches Gramble go quiet, and they go quiet too.
    ~ sol(-1)
}
{ toffo_joined:
    { toffo_inoc:
        At "bots," Toffo mouths "off switch" at me and hums along perfectly.
    - else:
        At "bots," Toffo goes white under all that hair.
        ~ sol(-1)
    }
}
{ gramble_joined or toffo_joined:
    { (gramble_joined and not gramble_inoc) or (toffo_joined and not toffo_inoc):
        I knew this was coming. I could have warned them.
    - else:
        Everyone I warned holds steady. The song lands on nobody.
    }
}
+ [Sing along. Loudly. With the wrong words. (+1 Heat)]
    ~ heat_up(1)
    ~ sol(1)
    I sing "ruin" as "RUIN FOR WONKMANN." Two people behind me snort into their song sheets, and one young worker starts singing it too.
+ [Mouth the words. Stay invisible.]
    I mouth the words. I've had eleven years of practice.
- -> committee

=== committee ===
Lights-out soon. There's time for one more thing.
{ not gramble_joined and not toffo_joined:
    There's nobody to meet with yet.
}
+ {has_wallpaper and (gramble_joined or toffo_joined)} [Call a secret meeting: cola on the wallpaper means midnight. #hint:tool]
    -> meeting
+ {not has_wallpaper and (gramble_joined or toffo_joined)} [Call a meeting by word of mouth. (+2 Heat)]
    ~ heat_up(2)
    Word of mouth travels fast. That's the problem. It travels upstairs too.
    -> meeting
+ [Rest. (−1 Heat)]
    ~ cool(1)
    I lie in my bunk and listen to forty people breathing.
    -> night

=== meeting ===
~ meetings = meetings + 1
Midnight, behind the boiler, where it's warm and loud enough to hide a whisper.
{ gramble_joined and not old_timers:
    ~ old_timers = true
    ~ sol(2)
    Gramble has brought the old-timers: two ancient stirrers who haven't spoken above a mutter since '71. #joined:The old-timers
}
{ toffo_joined and not testers:
    ~ testers = true
    ~ sol(1)
    Toffo has brought another tester, a woman whose tongue is permanently blue from the Three-Course Gum trials. #joined:The testers
}
Everyone looks at me. Nobody has ever looked at me like that before. I'm not sure I like it.
+ [Tell them the plan. #hint:command]
    ~ democracy = democracy - 1
    I tell them the plan. They nod. They nod the way people nod at Pomfrey.
+ [Ask them what they need first. #hint:listen]
    ~ democracy = democracy + 1
    "Guards on the mixer," says an old-timer. "Paid test hours," says Toffo. "Lunch," says everyone else.
    { not asked_needs:
        ~ asked_needs = true
        ~ sol(1)
        It's a start. A list. Our list. Somebody's cousin asks if they can come next time. #joined:Somebody's cousin
    - else:
        The list gets longer. That's a good sign.
    }
- -> night

=== night ===
Night. The factory hums. The Candymen go home. The Spy-Sweets, mostly, close their eyes.
+ {day == 1 and not saw_bot} [Sneak up to the Inventing Room and look under the sheet. (+1 Heat) #hint:risky]
    ~ saw_bot = true
    ~ heat_up(1)
    The Inventing Room at night is all ticking and dripping. I lift the dust sheet in the corner.
    A face like mine, only polished. Stencilled on its chest: LOOMPA-BOT MK I. REPLACEMENT SERIES. UNIT 1 OF 40.
+ {day == 1 and not has_wallpaper} [Sneak down the Corridor of Doors and tear off a wallpaper swatch. (+1 Heat) #hint:risky]
    ~ has_wallpaper = true
    ~ heat_up(1)
    Four flavors in my pocket, and no one saw. #get:Lickable Wallpaper
+ [Sleep. (−1 Heat)]
    ~ cool(1)
    I sleep like a stone. A tired stone.
- -> end_of_day

=== end_of_day ===
{ day >= 2: -> slice_end }
~ day = day + 1
~ actions = 6
~ worked_today = 0
~ disguise = 0
~ spysweets_on = true
~ room = "bunkhouse"
-> morning

=== morning ===
TUESDAY #daycard:Tuesday
The whistle. Five o'clock. It's always five o'clock.
MEMO FROM THE DESK OF W. WONKMANN #memo
Freshness monitors (Spy-Sweets) have been installed in the Chocolate River Room. Unnecessary chatter is productivity theft. #memo
P.S. Tonight: MANDATORY SONG REHEARSAL. Attendance is compulsory. Joy is compulsory. #memo
{ knows_spy: I saw the crate yesterday, so at least the surprise isn't a surprise. }
Management has just told me their next two moves. That's a gift.
{ gramble_joined or toffo_joined:
    ~ goal = "Warn your people about tonight's rehearsal"
- else:
    ~ goal = "Find someone who'll say yes"
}
If I get to my people before tonight, the song won't land. #checkpoint
-> DONE

=== slice_end ===
WEDNESDAY #daycard:Wednesday
Wednesday comes in with the whistle, like always.
But some things aren't like always. There are {solidarity} names on the wall by the stove.
{ democracy >= 2:
    They're starting to ask each other, not only me. That's the whole trick.
}
{ democracy <= -1:
    They keep looking to me for answers. That should worry me more than it does.
}
{ knows_bots:
    Forty bots. Friday. After the tour. The clock is running.
- else:
    Something's coming on Friday. Everyone upstairs is smiling too hard.
}
To be continued: THE COMMITTEE. #end
-> DONE

=== reassigned ===
~ goal = ""
The Candymen come for me between one action and the next. They're very polite about it.
"Reassigned," says Pomfrey, not unkindly. "Nut Sorting. The Bad Nut chute. The furnace is only lit on Thursdays, so, fingers crossed!" #s:pomfrey
The chute is dark, and long, and smells of burnt almonds. #gameover
-> DONE
