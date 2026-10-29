import type { MoodId, RoleId } from '../types'

type Engineer = Exclude<RoleId, 'manager'>
export type EndReason = 'answer' | 'aborted' | 'error' | 'refusal'

// Every line fits the team column (about 44 characters) so none is cut off.

// What the engineers on the job say, and what the manager (you) says, per mood of the request.
export const MOOD_LINES: Record<MoodId, { team: string[]; boss: string[] }> = {
  panic: {
    team: [
      "Oh good, prod is on fire. My favorite.", "Sure, let me drop my sandwich. Again.", "Who deployed on Friday? Show yourself.",
      "Cool. Cool cool cool. Not cool.", "My blood pressure just did a deploy.", "I was told there would be no fires.",
      "Is it DNS? Please let it be DNS.", "This is fine. 🔥 Everything is fine.", "I knew that hack would come back for me.",
      "ASAP? You mean before I resign?", "Brb, aging ten years real quick.", "Somebody find the runbook. We have one?",
      "Great, my therapist gets a raise.", "Of course it broke. It is Tuesday.", "Rolling back. Questions are for cowards.",
      "Love fixing prod with one eye open.", "Who has prod access? Not me. Lucky me.", "Urgent, says the guy who sat on it.",
      "Nothing says career like a 3am fire.", "My pager has more friends than me.", "Pushing a hotfix with sweaty palms.",
      "Remember, we said no Friday deploys.", "I am not panicking. You are panicking.", "Grabbing logs and my last nerve.",
    ],
    boss: [
      "I need this fixed yesterday. Ideally sooner.", "The client is screaming. Make it stop.", "All hands on deck. Yes, even you.",
      "The CEO pinged me. You know what to do.", "Drop everything. Pick it up after.", "We lose money every second you blink.",
      "Fix first. I will assign blame later.", "Do NOT tell sales. They will tweet it.", "I promised them this never happens.",
      "Why is my phone hot? Fix it.", "Weekend plans? Cute. Cancel them.", "Is anyone NOT on this? Why not?",
    ],
  },
  dread: {
    team: [
      "Ah yes, my weekend. Gone. Delicious.", "I have seen this code. It saw me back.", "Tell my family the CI was red.",
      "Who wrote this? ...oh no. Past me.", "I should have been a goat farmer.", "This file is longer than my will.",
      "No tests. Brave. Stupid, but brave.", "The comments are in a dead language.", "Do not touch it. It is load-bearing.",
      "Updating my resume. Just warming up.", "Here be dragons. And Perl.", "The last person who tried quit. Twice.",
      "Estimate: two weeks to heat death.", "Opening the file... closing the file.", "Git blame says: someone named temp.",
      "The README says good luck. That is it.", "I need a whiteboard and a priest.", "Somewhere a regex is laughing at me.",
      "Rewrite? Sure. Hold my resignation.", "It is legacy code all the way down.", "Migrating? I can barely migrate to bed.",
      "This monolith has its own zip code.", "Small change, they said. They lied.", "I am not crying, it is the code smell.",
    ],
    boss: [
      "Small change, right? Tiny. Barely a change.", "How hard can it be? Do not answer.", "Just rewrite it. Quick win, folks.",
      "Done by Friday? I already said yes.", "Think of it as a learning experience.", "The intern said two days. Be the intern.",
      "It is just moving code around. Easy.", "Let us modernize everything. Today.", "I told the board this was trivial.",
      "We refactor later. Later is now.", "The vendor said plug and play. Lol.", "Zero downtime, obviously. Obviously.",
    ],
  },
  annoyed: {
    team: [
      "Works on my machine. Ship my machine.", "Another bug? I am shocked. Not really.", "*sigh so deep it has a stack trace*",
      "Who touched my code? Confess.", "It is not a bug. It is a surprise.", "Did anyone read the error? No? Cool.",
      "I fixed this last week. Out of spite.", "Cannot reproduce. Case closed. Bye.", "Have you tried not breaking it?",
      "Clear your cache. Clear your mind.", "Off by one. My life is off by one.", "Error says: something went wrong. Thanks.",
      "Groundhog day, but with stack traces.", "Null again. My spirit animal.", "One line fix. Four hours to find it.",
      "Who merged without review? Hands up.", "It passed CI. CI is a liar.", "400-line stack trace. Light reading.",
      "It only breaks on Tuesdays. Like me.", "Flaky test? Flaky test writer.", "Let me guess. A missing semicolon.",
      "Adding a TODO to fix my TODOs.", "Fixed it. Broke two more. Balance.", "Sure, I love fixing other people's art.",
    ],
    boss: [
      "The customer found ANOTHER bug. Wow.", "Why is this broken again? Again?", "Can we fix it for good this time? Lol.",
      "QA says it still breaks. QA hates us.", "I thought we fixed this. I told people.", "Support has 40 tickets. And opinions.",
      "Can someone own this? Not me. You.", "This should not happen in prod. Yet.", "More tests, maybe? Wild idea, I know.",
      "Root cause, please. Not a band-aid.", "The demo is in an hour. No pressure.", "Same bug, different day. Great.",
    ],
  },
  confused: {
    team: [
      "Define somehow. Use small words.", "Is there a ticket, or just vibes?", "Requirements? In this economy?",
      "Can you draw it? With crayons?", "So... what are we building, boss?", "Who is the user? Is it you? Again?",
      "Acceptance criteria: it works. Nice.", "Five questions. Then fifty more.", "Sounds like a meeting. Kill me.",
      "Mockup? Napkin? Interpretive dance?", "Cool, I will just guess. Again.", "Did you mean the other thing?",
      "Wait, which repo? We have 47.", "So, like Uber, but for confusion?", "Reading between the lines. Nothing.",
      "Can we scope it before I lose scope?", "Building it on pure vibes. Wish me luck.", "Making it flexible. Meaning: vague.",
      "Sure. And by when? And why? And what?", "Interpreting creatively. You were warned.", "Nodding like I understood. I did not.",
      "Spec is a sticky note. It fell off.", "Magic? I left my wand at home.", "Ah yes, just make it work. Genius.",
    ],
    boss: [
      "You know what I mean. You do not?", "Make it pop. Somehow. Figure it out.", "Just do the thing. The thing!",
      "Like the other one, but better.", "I will know it when I see it.", "Use your judgement. Not that one.",
      "Make it more... modern. Like, AI.", "Something with AI, maybe? Yes.", "The client wants more energy.",
      "Simple but powerful. And cheap.", "Dynamic but static. Obviously.", "Do it the agile way. Whatever it is.",
    ],
  },
  bored: {
    team: [
      "Riveting. Truly the peak of my career.", "Ten years of experience for this.", "Sure, right after my nap.",
      "Living the dream. The dream is boring.", "Wake me up when it compiles.", "Another thrilling day in the code mines.",
      "Renaming x to y. Hold me back.", "Lint warnings. My only friends.", "I could do this asleep. Watch me.",
      "Fixing a typo with a full CI run.", "This is a job for a regex. Or a temp.", "Commit message: stuff. Fight me.",
      "Five minutes of work, an hour of CI.", "Adjusting whitespace with great purpose.", "Peak engineering. Frame it.",
      "Counting ceiling tiles. 214. Again.", "Updating docs nobody will ever read.", "Bumping the version. Bump. Wow.",
      "Tabs or spaces? Who cares. I do. Sadly.", "Yawning in TypeScript. Strict mode.", "Polishing a README like it matters.",
      "Quick, before I fall into a coma.", "My skills, wasted. Beautifully.", "Gonna need a coffee for this nothing.",
    ],
    boss: [
      "Quick one. Five minutes. Maybe six.", "Small housekeeping. You love those.", "Low priority, but do it right now.",
      "Can you just tidy this up a bit?", "Docs matter, team! Allegedly.", "Easy win for the sprint chart.",
      "Someone has to do it. You, I mean.", "Cleanup Friday! Try to look excited.", "Just a tiny polish. Tiny.",
      "Great for team velocity. Trust me.", "While you are in there, also...", "Not urgent. But today. Before lunch.",
    ],
  },
  excited: {
    team: [
      "Greenfield! No one to blame but me!", "Finally, something fun. Suspicious.", "Hold my coffee. Actually, hold two.",
      "New repo! Smells like fresh bugs.", "I have ideas. Terrible, brilliant ideas.", "Can I use the new framework? Please?",
      "This is why I got into tech. Rare.", "Clearing my calendar. And my morals.", "Sketching an architecture. Of chaos.",
      "No legacy code? Am I in heaven?", "Already arguing about the project name.", "Hackathon mode: no sleep, no tests.",
      "Picking a logo before writing code.", "Open-source it! No. Absolutely not.", "Rewrite it in Rust? Kidding. Unless?",
      "My keyboard is ready. My brain is not.", "Fresh code. Ruin it later, together.", "Starting with tests, for once. Lol.",
      "This goes in my portfolio. And my LinkedIn.", "Day one, commit one, bug one.", "Side-project energy. Main-project budget.",
      "Weekend? Overrated. This is fun. Help.", "Building it right this time. Sure.", "Let us gooo 🚀 into production bugs.",
    ],
    boss: [
      "Big new idea, team! Brace yourselves.", "This will impress the board. Hopefully.", "Let us build something cool. Cheap too.",
      "We are going to disrupt! Something.", "Think big, ship small, bill large.", "This could be our next unicorn. Or donkey.",
      "I already told marketing. Oops.", "Innovation time! Budget: zero.", "Saw this in a conference talk. Do it.",
      "Move fast. Break things. Fix them too.", "Prototype first. Polish never.", "This is our moonshot. No pressure.",
    ],
  },
  flattered: {
    team: [
      "Aww, you said please. Still no raise?", "Manners! Who hurt you into being nice?", "For you? Anything. Within budget.",
      "Best manager ever. Said under duress.", "Happy to help. Mostly. Partly.", "You said please, so I will half-try.",
      "Saving this for my perf review.", "A thank-you? In this economy?", "Okay that made my day. Tiny day.",
      "Kindness detected. Suspicion rising.", "I will write tests. Maybe. Probably not.", "Screenshotting that thanks for HR.",
      "You had me at please. Lost me at Friday.", "Gold star for manners. Here. ⭐", "Feeling appreciated. It is weird.",
      "Bumping you up the list. One slot.", "Flattery works. Disgustingly well.", "With a smile. A tired, forced smile.",
      "Nice words. Now pay me in pizza.", "Polite AND demanding. Impressive.",
    ],
    boss: [
      "Could you please... before lunch?", "Thanks in advance. Yes, in advance.", "I appreciate you. Now hurry.",
      "You are the best. Prove it.", "Whenever you can. So, now.", "Great work lately. Keep it up. Forever.",
      "Kindly have a look. Kindly now.", "Pizza on me after. Small pizza.", "Thanks for your patience. Keep it.",
      "You make it look easy. Do it again.", "I owe you a coffee. I will forget.", "Grateful for this team. Mostly.",
    ],
  },
  neutral: {
    team: [
      "On it. Emotionally? Not on it.", "Let me grab a coffee. Or five.", "Sure thing, boss. Sigh.",
      "Adding it to the sprint. The sprint cries.", "Okay, looking. Squinting, really.", "Roger that. Roger is tired.",
      "Checking now. Checking out soon.", "Give me a minute. Or a month.", "Sounds doable. Famous last words.",
      "Opening my editor. And a snack.", "Will report back. Eventually.", "Hmm. Let me pretend I know this.",
      "Noted. And ignored. Kidding. Mostly.", "Pulling latest. Hello, merge conflicts.", "Reading the code. It reads me back.",
      "Copy that. Paste that. Ship that.", "Fair enough. Unfair, but enough.", "Taking a look. A long, slow look.",
      "I can do that. Should I? Different question.", "Queued up. Behind my existential dread.",
    ],
    boss: [
      "New task. You are welcome.", "Here is the next one. Chop chop.", "Who can pick this up? You. Now.",
      "Quick request. They are never quick.", "One more for the board. And the pile.", "Adding this to the backlog. Of doom.",
      "Let us get this done. You, I mean.", "Next item. The list never ends.", "When you get a chance. Like, now.",
      "Small favor, team. Big favor, really.", "Let us sync. I will talk, you listen.", "Got something for you. Lucky you.",
    ],
  },
}

// What each engineer says while busy on the job, and while watching someone else's.
export const ROLE_LINES: Record<Engineer, { work: string[]; idle: string[] }> = {
  designer: {
    work: [
      "nudging a pixel. It nudged back...", "picking the 40th shade of blue...", "fighting about border-radius...",
      "redoing it in Figma. Fourth time...", "kerning like my life depends on it...", "making dark mode darker...",
      "adding whitespace. More. MORE...", "two identical greys. Choosing...", "icon 2% rounder. Huge impact...",
      "renaming 300 Figma layers...", "contrast check. It failed. Ignoring...", "gradient added. Gradient regretted...",
      "drawing it on a napkin. Pro move...", "asking users. They want a button...",
    ],
    idle: [
      "Make it look nice. You will not.", "Not my problem. Gloriously.", "Judging your fonts in silence.",
      "Browsing Dribbble for research.", "Is that Comic Sans? Is it?!", "Waiting for make it pop. It is coming.",
      "Pixels look fine. Your code does not.", "Collecting palettes. And grudges.", "Watching you ignore the design system.",
      "Rearranging my desk. Aesthetically.", "Silently redesigning your face.", "Updating my portfolio. Exit plan.",
    ],
  },
  frontend: {
    work: [
      "fighting CSS. CSS is winning...", "centering a div. Day three...", "npm install-ing the internet...",
      "clearing the cache. Again. And again...", "adding a useEffect. Regret loading...", "removing the useEffect...",
      "fixing Safari. Why, Safari, why...", "z-index: 99999. Still behind...", "making it responsive. It is not...",
      "console.log('here') x47...", "re-reading the React docs. Weeping...", "upgrading 147 deps. 146 broke...",
      "wrapping it in one more div...", "arguing with TypeScript. Losing...",
    ],
    idle: [
      "Phew. Not front-end. I live!", "Not my ticket. Bye.", "Learning a new framework. It died.",
      "It is a back-end bug. Obviously.", "Tweaking my theme. Very busy.", "Closing 47 tabs. Opening 48.",
      "Pretending to review a PR. Approved.", "Snacking with intent.", "Customizing my terminal. Again.",
      "Watching a conference talk on 2x.", "Refactoring dotfiles. Priority one.", "My CSS is perfect. Don't look.",
    ],
  },
  backend: {
    work: [
      "writing a migration. Praying...", "reading 3,000 lines of logs...", "adding an index. Feeling powerful...",
      "blaming the ORM. Loudly...", "tuning a query. It got slower...", "drawing boxes and arrows...",
      "retry with backoff. And hope...", "mocking the third-party API...", "added a cache. Now two problems...",
      "chasing a race condition. It won...", "EXPLAIN ANALYZE. Explain myself...", "handling the null. Every null...",
      "versioning the API. v2-final-final...", "writing tests. Kidding. Integration...",
    ],
    idle: [
      "The API is fine. Probably. Maybe.", "Not my ticket. Never was.", "Reading Hacker News. Research.",
      "Server says 200. Not my problem.", "Optimizing a query no one runs.", "Arguing about microservices. Alone.",
      "Rewriting it in Go. In my head.", "Watching logs scroll. Zen.", "It is a front-end bug. Surely.",
      "Tea in hand. Latency in check.", "Thinking about caching. Forever.", "My endpoints are perfect. Mostly.",
    ],
  },
  devops: {
    work: [
      "watching the pipeline. Watching...", "restarting the pod. Classic...", "YAML. YAML everywhere. Help...",
      "reading the cloud bill. Crying...", "bumping memory. Problem solved...", "rotating secrets. Spinning...",
      "waiting for Docker. Still waiting...", "fixing the CI cache. Again...", "adding another dashboard...",
      "renewing the SSL cert. On time!...", "scaling to 3 replicas. Of pain...", "rolling back. Just in case...",
      "writing Terraform. It writes me...", "adding a health check. Mine...",
    ],
    idle: [
      "Uptime 99.9%. Leave me alone.", "Not my ticket. Do not page me.", "Nobody touch prod. I mean it.",
      "Admiring a green pipeline. Rare.", "Polishing my dashboards. Shiny.", "Counting containers. Sleepily.",
      "Deleting unused cloud stuff. Joy.", "Reading the on-call rota. Gulp.", "Automating my coffee machine.",
      "Archiving logs. Nobody reads them.", "Hoping the pager stays asleep.", "It is a code problem, not infra.",
    ],
  },
}

// The manager (you) while the team works.
export const BOSS_WORK_LINES = [
  "Any updates? How about now? Now?", "Quick sync in 5? It will be 50.", "Is it done yet? Asking for the CEO.",
  "Updating the roadmap. With fiction.", "Just checking in. Again. Hi.", "ETA? Give me a number. Any number.",
  "Can we demo it soon? Like, now?", "Blocked? Unblock yourself.", "Booking a meeting about the meeting.",
  "Telling the client soon. Very soon.", "Making a Gantt chart. Of lies.", "Percentage done? Round up.",
  "Adding a few tiny requirements.", "Looking over your shoulder. Helpfully.", "Sending a motivational 👍. You are welcome.",
  "Reply-all with a status? Please.",
]

// Everyone, when the turn ends.
export const DONE_LINES: Record<EndReason, { team: string[]; boss: string[] }> = {
  answer: {
    team: [
      "Ship it. Before anyone tests it.", "Done. Never touching it again.", "Works on my machine. Good luck.",
      "High fives! Do not look at the code.", "Merged. Deployed. Fled.", "Green checks. Suspiciously green.",
      "Closing the ticket with violence.", "Taking the rest of the day. Bye.", "Smoother than expected. Worrying.",
      "Another one bites the dust. For now.", "Standup will love this. Or not.", "Victory coffee. Cold. As always.",
      "All tests pass. I trust nothing.", "Nailed it. Mostly. Kinda.", "Pushed to main. Bravely. Stupidly.",
      "If it breaks, it was not me.",
    ],
    boss: [
      "Great work, team! 🎉 Now do it faster.", "That is what I like to see. More of it.", "Telling the client. Taking credit.",
      "Pizza tonight! One slice each.", "Fantastic. Next sprint is bigger.", "Adding it to my slides as my idea.",
      "Now, about that other thing...", "You are rockstars. Underpaid ones.",
    ],
  },
  aborted: {
    team: [
      "Oh, NOW you change your mind?", "Stopping. Wasting my life is fine.", "All that for nothing. Love it.",
      "Scope change. Again. Shocking.", "Stashing changes. And my feelings.", "I was ONE line from done.",
      "Pivoting. Like a spinning chair.", "Ctrl+Z on my whole afternoon.", "Back to the backlog. Graveyard.",
      "Saved as draft. Forever.", "Noted. Screaming internally.", "Deleting my branch. And my hopes.",
    ],
    boss: [
      "Stop! New priorities. Again.", "Hold on, the client changed their mind.", "Park it. Forever, probably.",
      "Actually, wait. Never mind. Wait.", "Pause that. Do this. Then that.", "Revisit next sprint. Or never.",
      "Hmm, never mind. You did not see that.", "Plot twist: we do not need it.",
    ],
  },
  error: {
    team: [
      "Everything is broken. Calming.", "I need a vacation. Or a new job.", "Not it! Not it! Not it!",
      "Rolling back. Rolling eyes.", "Who unplugged the server? Kevin?", "The error has an error.",
      "Have we tried praying? To the cloud?", "I blame the cloud. Always.", "Time to read the docs. Ugh.",
      "Staring at the screen. It stares back.", "It worked 5 minutes ago. I swear.", "Opening an incident. And a snack.",
    ],
    boss: [
      "Who broke it?! Not me. Someone.", "What happened?! Use small words.", "Postmortem tomorrow. 7am. Fun.",
      "Do not tell the client. Ever.", "No panic. Panic later, in private.", "Fixable by EOD? Say yes.",
      "I need an explanation. A good one.", "Deep breath, team. Then fix it.",
    ],
  },
  refusal: {
    team: [
      "Nope. Not doing that. Not paid enough.", "HR would like a word. Many words.", "Hard pass. Concrete-hard.",
      "Hmm, no. Big no. Huge.", "That is a no from me, dawg.", "Legal just fainted.",
      "Let us find a less jail-y way.", "My ethics module says lol no.", "Respectfully: absolutely not.",
      "Not in my codebase. Not today.", "Pretending I did not read that.", "Escalating to my lawyer. Kidding.",
    ],
    boss: [
      "Okay, maybe not that one. Ahem.", "Fair. Let us rethink. Quietly.", "Noted. We never spoke of this.",
      "Back to the drawing board. Again.", "Scrapping it. Shredding it too.", "Maybe I asked too much. Maybe.",
      "Let us check with legal first. Gulp.", "Point taken. Pride wounded.",
    ],
  },
}

// Handing the ball on: `{to}` is the role it goes to, `{from}` the role it came from.
export const PASS_LINES = [
  "Your problem now, {to}. 🏀", "Good luck, {to}. You'll need it.", "Yeeting it to {to}. Catch, loser.",
  "{to}, catch! Or don't. Not mine now.", "Tossed it over the wall to {to}.", "{to}, it's all yours. Sorry not sorry.",
  "Assigned to {to}. Muting Slack.", "Tag, {to}, you're it. Forever.", "Handed off to {to}. Fleeing now.",
  "{to}, it works. Mostly. Probably.", "Not my problem. {to}'s problem.", "Pushed my branch. {to}, enjoy the mess.",
  "Your court, {to}. It's on fire.", "Bye! {to} has it. Don't call me.", "{to}, I left you a little surprise.",
  "Over to {to}. I tested nothing.",
]

export const RECEIVE_MOODS = ['annoyed', 'dread', 'confused', 'excited'] as const
export type ReceiveMood = (typeof RECEIVE_MOODS)[number]

export const RECEIVE_LINES: Record<ReceiveMood, string[]> = {
  annoyed: [
    "Why is this MY problem now?", "Thanks a lot, {from}. Really.", "Of course it lands on me.",
    "{from} left me a crime scene.", "I was literally logging off.", "Who approved this handoff? Nobody.",
    "Did {from} even run it? Once?", "Great. Just great. Fantastic.", "One quiet hour. That's all I asked.",
    "Fine. FINE. Give it here.", "{from}, we need to talk. Outside.", "There goes lunch. Thanks, {from}.",
  ],
  dread: [
    "Oh no. It's my turn. Oh no.", "What did {from} do to it?!", "Scared to open this. Opening anyway.",
    "Worse than expected. Much worse.", "{from} said mostly done. LOL.", "Wish me luck. And a lawyer.",
    "No comments. Not one. Wow.", "Brace yourselves. Opening now.", "Held together with tape and hope.",
    "Opening it with my eyes closed.", "{from} already left the chat.", "Deep breaths. Shallow hopes.",
  ],
  confused: [
    "What am I supposed to do with this?", "{from}, what does this even do?", "Handoff doc? Hello? Anyone?",
    "Which part is mine? All of it?", "Where do I even start? Hell?", "Reading {from}'s code like a mystery.",
    "Is this the right branch? Any branch?", "Who has the context? Not me.", "Quick sync? Long sync? Any sync?",
    "Got the ball, not the rules.", "{from} named everything temp. Cool.", "Is this working or just vibing?",
  ],
  excited: [
    "My turn! Finally, competence arrives.", "Nice, {from}. I'll fix your bits.", "Clean? From {from}? Who are you?",
    "Watch and learn, {from}. Watch.", "Been waiting. Bored to tears.", "Ball received. Showtime, losers.",
    "{from} set me up. Shockingly well.", "Ooh, the fun part. Mine. All mine.", "Leave it to me. As usual.",
    "Warming up my keyboard. And my ego.", "Time to shine ✨ Try to keep up.", "I'll make {from} look bad. Easy.",
  ],
}

// The manager (you) calling the handoff.
export const BOSS_PASS_LINES = [
  "{to}, you're up. Don't mess it up.", "Teamwork! Keep it moving. Faster.", "Handing off to {to}. Pray.",
  "{to}, what's your ETA? Wrong. Faster.", "Progress! {to}, it's yours now.", "Next stop: {to}. Last stop, hopefully.",
  "Keep the momentum, {to}! Any momentum.", "Board says {to} has it. Good luck.", "{to}, no pressure. All the pressure.",
  "Smooth handoff. Almost professional.", "Ping me when {to} is done. Or not.", "One step closer. To what, who knows.",
]
