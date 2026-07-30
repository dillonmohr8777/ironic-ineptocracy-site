import { readdir, readFile, writeFile } from "node:fs/promises";
import { relative, join, sep } from "node:path";

const root = process.cwd();
const START = "<!-- immersive-expansion:start -->";
const END = "<!-- immersive-expansion:end -->";
const AEO_START = "<!-- answer-engine:start -->";
const AEO_END = "<!-- answer-engine:end -->";
const SEO_HEAD_START = "<!-- seo-foundation:start -->";
const SEO_HEAD_END = "<!-- seo-foundation:end -->";
const LIBRARY_START = "<!-- search-library:start -->";
const LIBRARY_END = "<!-- search-library:end -->";

const cast = {
  darnell: ["/characters/darnell-covington", "/images/characters/darnell-1024.webp", "Darnell Covington", "The promise"],
  javon: ["/characters/javon-whitfield", "/images/characters/javon-1024.webp", "Javon Whitfield", "The warning"],
  alec: ["/characters/alec-daheim", "/images/characters/alec-1024.webp", "Alec Daheim", "The witness"],
  garnier: ["/characters/dijon-garnier", "/images/characters/garnier-1024.webp", "Dijon Garnier", "The architect"],
  mcnulty: ["/characters/ronald-mcnulty", "/images/characters/mcnulty-1024.webp", "Ronald McNulty", "The performance"],
  avigail: ["/characters/avigail", "/images/characters/avigail-1024.webp", "Avigail", "The conscience"],
  leah: ["/characters/leah", "/images/characters/leah-1024.webp", "Leah", "The fracture"],
  mark: ["/characters/mark", "/images/characters/mark-1024.webp", "Mark", "The pressure"],
  sabrina: ["/characters/sabrina", "/images/characters/sabrina-1024.webp", "Sabrina", "The line"],
};

const routeCards = {
  home: [
    ["/book", "/images/story/javon-darnell-alec-capitol-trio-1024.webp", "Book file", "Start with the charge", "A spoiler-safe brief on the friends, the draft, the money, and the machinery closing around them."],
    ["/characters", "/images/story/supporting-cast-dossier-1024.webp", "Character files", "Meet the people in the file", "Real portrait dossiers connect the people who resist the machine to the people who profit from it."],
    ["/world", "/images/world-map-1024.webp", "World file", "Trace the pressure", "Follow the institutions, slogans, and private rooms that turn ordinary ambition into public damage."],
    ["/dispatches", "/images/story/essays-dossier-desk-1024.webp", "Dispatches", "Read the evidence drops", "Four spoiler-safe investigations translate the novel's systems into questions that follow readers home."],
    ["/dossier", "/images/story/press-kit-desk-1024.webp", "Restricted file", "Open the Garnier Dossier", "Enter the reader channel and unlock the private-power file at the center of the investigation."],
  ],
  book: [cast.darnell, cast.javon, cast.alec].map(([href, image, title, label]) => [
    href, image, label, title, `Open ${title}'s spoiler-safe character file and follow the next pressure point.`,
  ]),
  characters: [
    ...[cast.darnell, cast.javon, cast.garnier, cast.mcnulty, cast.sabrina].map(([href, image, title, label]) => [
      href, image, label, title, `Open ${title}'s real portrait dossier and trace the role this file plays in the larger machine.`,
    ]),
  ],
  dispatches: [
    ["/dispatches/the-file-opens", "/images/story/essays-dossier-desk-1024.webp", "Dispatch 01", "The File Opens", "Begin where the evidence first changes the shape of the story."],
    ["/dispatches/who-gets-spent", "/images/story/javon-darnell-alec-capitol-trio-1024.webp", "Dispatch 02", "Who Gets Spent?", "Follow the logic that turns selection into sacrifice."],
    ["/dispatches/the-memory-economy", "/images/control-room-orange-county-1024.webp", "Dispatch 03", "The Memory Economy", "Enter the systems that decide which version of events survives."],
    ["/dispatches/the-garnier-position", "/images/story/mcnulty-garnier-two-shot-1024.webp", "Dispatch 04", "The Garnier Position", "See what happens when private wealth stops requesting access and begins writing policy."],
    ["/dispatches/what-is-ineptocracy", "/images/social/generated-scenes/final/mcnulty-white-house-protest-feed.png", "Search file", "What Is an Ineptocracy?", "Get the plain-English meaning, related forms of government, and the satirical logic behind the title."],
    ["/dispatches/political-satire-books-government-incompetence", "/images/social/generated-scenes/final/boston-protest-darnell-javon-feed.png", "Reading file", "Political Satire Books About Government Incompetence", "Find political satire that turns bureaucracy, propaganda, and elite failure into story."],
    ["/dispatches/books-like-1984-but-funny", "/images/social/generated-scenes/final/memory-economy-feed.png", "Reader route", "Books Like 1984 but Funny", "Follow the path from controlled reality to dark humor, absurd systems, and contemporary political thrillers."],
    ["/dispatches/political-thriller-book-club-questions", "/images/story/quiz-detector-console-1024.webp", "Reader guide", "20 Political Thriller Book Club Questions", "Use direct prompts about power, corruption, memory, sacrifice, and moral compromise."],
    ["/dispatches/political-corruption-fiction", "/images/social/generated-scenes/final/garnier-mansion-feed.png", "Theme file", "Political Corruption Fiction", "Trace bribery, access, dependency, private power, and the corruption that stays technically legal."],
  ],
  world: [
    ["/characters/darnell-covington", "/images/characters/darnell-1024.webp", "Human cost", "Darnell Covington", "The map matters because a person has to move through it."],
    ["/characters/dijon-garnier", "/images/characters/garnier-1024.webp", "Private power", "Dijon Garnier", "The map bends around the people who can buy a shorter route."],
    ["/dispatches/the-memory-economy", "/images/control-room-orange-county-1024.webp", "System file", "The Memory Economy", "The map becomes permanent when memory itself turns into infrastructure."],
    ["/reader-guide", "/images/story/quiz-detector-console-1024.webp", "Reader route", "Interrogate the world", "Use the guide to carry the novel's pressure points into a group conversation."],
  ],
  utility: [
    ["/book", "/images/story/javon-darnell-alec-capitol-trio-1024.webp", "Primary file", "The book", "Return to the spoiler-safe story brief."],
    ["/characters", "/images/story/supporting-cast-dossier-1024.webp", "People", "Character dossiers", "See the real portraits and connected roles."],
    ["/dispatches", "/images/story/essays-dossier-desk-1024.webp", "Evidence", "Dispatches", "Continue through the thematic evidence drops."],
    ["/dossier", "/images/story/press-kit-desk-1024.webp", "Restricted", "The Garnier Dossier", "Open the private-power reader file."],
  ],
};

const sequences = {
  home: {
    eyebrow: "How the file closes",
    title: "Promise becomes pressure. Pressure becomes policy.",
    image: "/images/control-room-orange-county-1024.webp",
    alt: "A surveillance control room filled with monitors and evidence feeds.",
    steps: [
      ["The promise", "A brilliant kid earns the door and discovers that access is not the same thing as freedom."],
      ["The selection", "Draft papers turn opportunity into obligation while the country calls the pattern fair."],
      ["The machinery", "Money, media, memory, and policy begin speaking in the same calm institutional voice."],
      ["The invoice", "The people with the least control are handed the cost and told it is citizenship."],
    ],
  },
  book: {
    eyebrow: "The narrative engine",
    title: "Four forces pull the story forward.",
    image: "/images/story/javon-darnell-alec-capitol-trio-1024.webp",
    alt: "Darnell, Javon, and Alec stand before the Capitol beneath a fire-lit sky.",
    steps: [
      ["Friendship", "The relationships are not decoration. They are the last honest intelligence network in the file."],
      ["Ambition", "Every door Darnell earns reveals another person deciding what his success should cost."],
      ["Propaganda", "The slogans stay simple because the machinery behind them is not."],
      ["Memory", "Control becomes durable when the public can no longer agree on what happened."],
    ],
  },
  characters: {
    eyebrow: "Relationship map",
    title: "Nobody stands outside the machine.",
    image: "/images/story/supporting-cast-dossier-1024.webp",
    alt: "A dossier board connecting the supporting cast of the novel.",
    steps: [
      ["Those selected", "Some characters are routed through systems built before they arrived."],
      ["Those resisting", "Some recognize the pattern early and pay for refusing its language."],
      ["Those administering", "Some keep the process clean enough that nobody has to call it violence."],
      ["Those purchasing", "Some do not break the rules. They acquire the room where rules are made."],
    ],
  },
  dispatches: {
    eyebrow: "Reading order",
    title: "Each dispatch opens a different layer of the same system.",
    image: "/images/story/essays-dossier-desk-1024.webp",
    alt: "A desk covered in dispatch files, photographs, and marked evidence.",
    steps: [
      ["Open the file", "Learn the language of the evidence before the institution gets to name it."],
      ["Count the cost", "Ask who is selected, who is protected, and who receives the invoice."],
      ["Audit the memory", "Trace the tools that decide which facts remain available to the public."],
      ["Follow the money", "End where private access becomes public consequence."],
    ],
  },
  world: {
    eyebrow: "Pressure system",
    title: "The map is made of leverage.",
    image: "/images/world-map-1024.webp",
    alt: "A dark investigation map showing the novel's connected pressure points.",
    steps: [
      ["Institution", "The visible process supplies the language of legitimacy."],
      ["Capital", "Private money shortens distance and erases friction."],
      ["Media", "Repetition turns the preferred explanation into common sense."],
      ["Body", "Every abstract system resolves somewhere physical."],
    ],
  },
  utility: {
    eyebrow: "Continue the investigation",
    title: "Every supporting file connects back to the story.",
    image: "/images/investigation-map-1024.webp",
    alt: "An investigation map marked with routes, labels, and redactions.",
    steps: [
      ["Read", "Start with the book brief and the spoiler-safe premise."],
      ["Trace", "Move through real portrait files and their relationships."],
      ["Interrogate", "Use dispatches and reader questions to test the system."],
      ["Enter", "Open the restricted dossier and stay on the reader channel."],
    ],
  },
};

const characterRelations = {
  "darnell-covington": ["javon", "alec", "garnier", "mcnulty"],
  "javon-whitfield": ["darnell", "alec", "sabrina", "mark"],
  "alec-daheim": ["darnell", "javon", "garnier", "sabrina"],
  "dijon-garnier": ["mcnulty", "darnell", "alec", "avigail"],
  "ronald-mcnulty": ["garnier", "darnell", "javon", "sabrina"],
  avigail: ["darnell", "leah", "garnier", "sabrina"],
  leah: ["avigail", "darnell", "javon", "mark"],
  mark: ["javon", "darnell", "leah", "sabrina"],
  sabrina: ["javon", "alec", "darnell", "mcnulty"],
};

const characterSequences = {
  "darnell-covington": {
    eyebrow: "Darnell Covington // pressure file",
    title: "Promise becomes property when power writes the terms.",
    image: cast.darnell[1],
    alt: "Real portrait of Darnell Covington.",
    steps: [
      ["Promise", "Seventeen, mathematically adroit, Harvard bound, and suddenly legible to people who confuse promise with property."],
      ["Ownership", "Every institution praising his future quietly begins drafting a claim against it."],
      ["Selection", "The language of opportunity gets colder when somebody else controls the list."],
      ["Agency", "The file turns on whether a brilliant young man can remain the author of his own value."],
    ],
  },
  "javon-whitfield": {
    eyebrow: "Javon Whitfield // pressure file",
    title: "Everybody sees the frame. Almost nobody sees the mind.",
    image: cast.javon[1],
    alt: "Real portrait of Javon Whitfield.",
    steps: [
      ["Presence", "Six foot five, 242 pounds, and carrying the kind of gravity other people mistake for permission."],
      ["Intelligence", "The room keeps reducing him to muscle because recognizing the whole person would change the math."],
      ["Loyalty", "Friendship becomes an intelligence network when official channels stop telling the truth."],
      ["Warning", "Javon sees the hit coming before the people with titles agree that danger exists."],
    ],
  },
  "alec-daheim": {
    eyebrow: "Alec Daheim // pressure file",
    title: "Discipline is useful until conscience interrupts the assignment.",
    image: cast.alec[1],
    alt: "Real portrait of Alec Daheim.",
    steps: [
      ["Discipline", "A disciplined weapon with green eyes, an empty column, and a conscience arriving later than it should."],
      ["Assignment", "Procedure gives him a clean sequence for carrying out somebody else's decision."],
      ["Conscience", "The first fracture appears when obedience and evidence stop describing the same reality."],
      ["Witness", "What he has seen becomes more dangerous than what he was trained to do."],
    ],
  },
  "dijon-garnier": {
    eyebrow: "Dijon Garnier // private-power file",
    title: "Capital stops asking for access when it can own the room.",
    image: cast.garnier[1],
    alt: "Real portrait of Dijon Garnier.",
    steps: [
      ["Capital", "Private capital with a cigar, a mansion, a technological alibi, and a brutal appetite for controllable memory."],
      ["Access", "Distance collapses when every locked door has a price and every gatekeeper has an ambition."],
      ["Technology", "The machine is presented as neutral because neutrality is cheaper than accountability."],
      ["Memory", "Power becomes durable when it can edit not only the record, but the public's confidence in any record at all."],
    ],
  },
  "ronald-mcnulty": {
    eyebrow: "Ronald McNulty // executive file",
    title: "Collapse sounds respectable when procedure delivers the line.",
    image: cast.mcnulty[1],
    alt: "Real portrait of Ronald McNulty.",
    steps: [
      ["Performance", "Reality television ego turns every public consequence into a privately staged scene."],
      ["Authority", "Executive power lets the performance travel farther than competence ever could."],
      ["Procedure", "The damage is narrated in calm administrative language until it feels inevitable."],
      ["Collapse", "McNulty's talent is making institutional failure sound like the only responsible option."],
    ],
  },
  avigail: {
    eyebrow: "Avigail // intervention file",
    title: "Instinct moves before the paperwork can forbid it.",
    image: cast.avigail[1],
    alt: "Real portrait of Avigail.",
    steps: [
      ["Instinct", "Piercing green eyes and the rare instinct to help before permission can be denied."],
      ["Burner phone", "A disposable line becomes more trustworthy than the official channels surrounding it."],
      ["Intervention", "She acts inside the small window between recognizing the pattern and being absorbed by it."],
      ["Paperwork", "The file asks whether help still counts when every form was designed to arrive too late."],
    ],
  },
  leah: {
    eyebrow: "Leah // buried file",
    title: "A route through silence is still a route through danger.",
    image: cast.leah[1],
    alt: "Real portrait of Leah.",
    steps: [
      ["Black file", "A black file contains the facts that respectable systems cannot afford to acknowledge."],
      ["Buried vessel", "The vessel remains useful precisely because the official map pretends it does not exist."],
      ["Pilot", "Leah has the nerve to move people through terrain designed to make them disappear."],
      ["Silence", "Every quiet decision carries the pressure of knowing one wrong signal could kill them."],
    ],
  },
  mark: {
    eyebrow: "Mark // signal file",
    title: "Break the signal. Keep the people intact.",
    image: cast.mark[1],
    alt: "Real portrait of Mark.",
    steps: [
      ["Prosthetic arm", "A prosthetic arm and a bad attitude make the first impression; precision makes the lasting one."],
      ["Basement", "His basement is less a hideout than a workshop for refusing somebody else's network."],
      ["Signals", "He knows which systems must be interrupted before their certainty becomes force."],
      ["People", "The point is never destruction for its own sake. It is creating room for people to remain themselves."],
    ],
  },
  sabrina: {
    eyebrow: "Sabrina // control file",
    title: "Obedience can be manufactured. The line still matters.",
    image: cast.sabrina[1],
    alt: "Real portrait of Sabrina.",
    steps: [
      ["Training", "Blue eyes returned from gray, a Midwestern accent under fire, and a gun hand built on practiced control."],
      ["Control", "The body remembers an order even after the person begins questioning who placed it there."],
      ["Obedience", "Manufactured obedience is powerful because it arrives wearing the shape of personal choice."],
      ["The line", "Sabrina's file lives at the boundary between what was done through her and what she decides next."],
    ],
  },
};

const dispatchSequences = {
  "the-file-opens": {
    eyebrow: "Dispatch 01 // evidence language",
    title: "The first fight is over what the evidence is allowed to mean.",
    image: "/images/story/essays-dossier-desk-1024.webp",
    alt: "Dispatch files and marked evidence spread across an investigation desk.",
    steps: [
      ["Language", "Power names the incident early because the first description is difficult to dislodge."],
      ["The file", "A file is not neutral; inclusion, omission, and order already make an argument."],
      ["Evidence", "The useful question is not only what is present, but who had the authority to preserve it."],
      ["Diagnosis", "Once the pattern has a name, the institution can no longer dismiss every result as isolated."],
    ],
  },
  "who-gets-spent": {
    eyebrow: "Dispatch 02 // human accounting",
    title: "Every system reveals itself in the people it considers spendable.",
    image: "/images/story/javon-darnell-alec-capitol-trio-1024.webp",
    alt: "Three young men stand before the Capitol beneath a fire-lit sky.",
    steps: [
      ["Selection", "The list is framed as objective so nobody has to defend the values embedded inside it."],
      ["Sacrifice", "Public necessity becomes the language used to make private losses feel unavoidable."],
      ["Accounting", "Benefits are counted broadly while the cost is assigned to one body at a time."],
      ["Responsibility", "The moral question begins where procedure ends: who chose, who knew, and who was protected."],
    ],
  },
  "the-memory-economy": {
    eyebrow: "Dispatch 03 // memory market",
    title: "Control the record long enough and reality starts paying rent.",
    image: "/images/control-room-orange-county-1024.webp",
    alt: "A surveillance control room filled with monitors and evidence feeds.",
    steps: [
      ["Capture", "The system gathers more moments than any person can inspect and calls the volume objectivity."],
      ["Edit", "What disappears between capture and presentation is where power does its quietest work."],
      ["Repeat", "The approved version becomes familiar, and familiarity begins impersonating proof."],
      ["Forget", "The final product is not a lie. It is a public that no longer trusts its ability to remember."],
    ],
  },
  "the-garnier-position": {
    eyebrow: "Dispatch 04 // private access",
    title: "Private wealth becomes public policy one quiet room at a time.",
    image: "/images/story/mcnulty-garnier-two-shot-1024.webp",
    alt: "Ronald McNulty and Dijon Garnier pictured together in a private-power file.",
    steps: [
      ["Access", "The first advantage is not money itself, but the ability to arrive before the public conversation begins."],
      ["Capital", "Investment becomes leverage when institutions depend on the people they are meant to regulate."],
      ["Privatization", "A public function is moved behind a private door and accountability loses the address."],
      ["Policy", "By the time the rule is announced, the most important decisions have already been priced."],
    ],
  },
};

const coreAnswers = {
  home: [
    ["What is The Ironic Ineptocracy?", "The Ironic Ineptocracy is a satirical political thriller by Dillon Mohr about brilliance, friendship, donor power, public failure, propaganda, and manipulated memory."],
    ["What does ineptocracy mean?", "Ineptocracy means government or leadership by incompetent people. The novel turns that idea into a thriller about what happens when visible public failure creates room for disciplined private power."],
    ["Where should a new reader begin?", "Begin with the spoiler-safe book file, meet the characters, then open the Blog and Dispatches for thematic essays and reading guides."],
  ],
  book: [
    ["What kind of book is The Ironic Ineptocracy?", "It is a satirical political thriller with dystopian pressure points, dark humor, institutional suspense, and a character-driven story about who pays for public failure."],
    ["Who is the novel about?", "The story centers on Darnell Covington, a brilliant seventeen-year-old whose intelligence makes him visible to institutions and private actors that confuse promise with property."],
    ["Is this page spoiler free?", "Yes. The book file explains the premise, themes, and major pressure points without revealing the ending."],
  ],
  characters: [
    ["Who are the main characters?", "The character files follow Darnell Covington, Javon Whitfield, Alec Daheim, Dijon Garnier, Ronald McNulty, Avigail, Leah, Mark, and Sabrina."],
    ["Are the character images real portraits?", "Yes. Every public character file uses the site's real photographic portrait assets rather than 3D-rendered likenesses."],
    ["Do the character files contain spoilers?", "The public files are designed as spoiler-safe introductions to each character's role, pressure, and relationships."],
  ],
  dispatches: [
    ["Where is the blog?", "The site's blog lives here inside Blog and Dispatches. It combines story-world evidence drops, political satire essays, reading lists, definitions, and book-club resources."],
    ["What topics does the blog cover?", "The blog covers political satire, government incompetence, propaganda, public corruption, private power, memory manipulation, dystopian fiction, and political thriller reading guides."],
    ["Can these essays be read without the novel?", "Yes. Every public dispatch is written to stand alone while also opening a route into the novel's characters and themes."],
  ],
  world: [
    ["What is the World File?", "The World File is a spoiler-safe map of the institutions, routes, slogans, private rooms, and pressure systems surrounding the novel's characters."],
    ["Is The Ironic Ineptocracy set in the United States?", "The novel's public files use American political institutions, cities, symbols, and power structures as central parts of the story world."],
    ["What themes shape the world?", "The world is organized around institutional failure, donor influence, propaganda, surveillance, selection, memory, and the human cost of abstract policy."],
  ],
  utility: [
    ["What is this file connected to?", "This page is part of The Ironic Ineptocracy, Dillon Mohr's satirical political thriller and its spoiler-safe public evidence system."],
    ["Where can readers continue?", "Readers can open the book brief, character dossiers, Blog and Dispatches, reader guide, press file, or restricted Garnier Dossier."],
    ["Is the site content crawlable without JavaScript?", "Yes. The site's primary text, links, answer blocks, and structured article content are present in the server-delivered HTML."],
  ],
};

const routeAnswers = {
  "/dossier": [
    ["What is the Garnier Dossier?", "The Garnier Dossier is a reader-only file about Dijon Garnier, private capital, dependency, controlled memory, and the financial architecture surrounding the novel."],
    ["Who is Dijon Garnier?", "Dijon Garnier is the novel's private-power figure: a wealthy actor whose influence works through access, infrastructure, technology, and institutional dependency."],
    ["How do readers enter the dossier?", "Use the dossier signup form to join the reader channel and receive the private-power file."],
  ],
  "/reader-guide": [
    ["What is the reader guide for?", "The reader guide gives book clubs and individual readers spoiler-safe questions about power, competence, corruption, propaganda, sacrifice, friendship, and memory."],
    ["Can a book club use these questions?", "Yes. The questions are designed to create text-based discussion without requiring every participant to share the same politics."],
    ["Are there more political thriller discussion prompts?", "Yes. The Blog and Dispatches includes a dedicated set of twenty political thriller book club questions."],
  ],
  "/press": [
    ["What is available in the press file?", "The press file contains spoiler-safe book descriptions, author positioning, interview angles, character and theme summaries, and media-ready routes into the project."],
    ["Who wrote The Ironic Ineptocracy?", "Dillon Mohr is the author of The Ironic Ineptocracy."],
    ["What topics can interviews cover?", "Interview topics include political satire, institutional failure, billionaire influence, propaganda, manipulated memory, friendship, and building a novel website as a living dossier."],
  ],
};

const dispatchAnswers = {
  "the-file-opens": [
    ["What is The File Opens about?", "The File Opens introduces The Ironic Ineptocracy as a living dossier and explains why the story begins through leaked evidence rather than a polished book brochure."],
    ["What themes appear in the first dispatch?", "The dispatch introduces public failure, private design, donor power, manipulated memory, and the danger created when intelligence becomes useful to a system."],
    ["Does The File Opens contain spoilers?", "No. It establishes the novel's pressure and public premise without revealing its ending."],
  ],
  "who-gets-spent": [
    ["What does Who Gets Spent examine?", "Who Gets Spent examines how institutions turn selection into sacrifice and distribute public costs to people with the least control."],
    ["What is the Draft Machine?", "The Draft Machine is the novel's system for converting policy, eligibility, and institutional language into human obligation."],
    ["Is this a political satire essay?", "Yes. It is a spoiler-safe political satire dispatch about bureaucracy, sacrifice, responsibility, and institutional accounting."],
  ],
  "the-memory-economy": [
    ["What is the memory economy?", "The memory economy is the system of capturing, editing, repeating, and suppressing events until an approved version becomes easier to access than the truth."],
    ["How does memory connect to political power?", "Political power becomes more durable when it can influence which records survive, which descriptions repeat, and whether the public trusts its own memory."],
    ["Is this dispatch about real technology?", "The dispatch is a fictional and thematic essay from the world of The Ironic Ineptocracy, not a claim about a specific real-world product."],
  ],
  "the-garnier-position": [
    ["What is the Garnier position?", "The Garnier position is the point at which private wealth stops requesting access and begins shaping the options public institutions consider realistic."],
    ["Is Dijon Garnier a politician?", "Garnier's power is private rather than electoral. His influence works through capital, access, infrastructure, technology, and dependency."],
    ["What does this dispatch explore?", "It explores billionaire influence, privatization, institutional dependency, and the quiet route from private access to public consequence."],
  ],
};

function classify(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/book") return "book";
  if (pathname === "/world") return "world";
  if (pathname === "/characters" || pathname.startsWith("/characters/")) return "characters";
  if (pathname === "/dispatches" || pathname.startsWith("/dispatches/")) return "dispatches";
  return "utility";
}

function routeSlug(pathname) {
  return pathname.split("/").filter(Boolean).pop() || "home";
}

function cardsFor(type, pathname) {
  const slug = routeSlug(pathname);
  if (pathname.startsWith("/characters/") && characterRelations[slug]) {
    return characterRelations[slug].map((key) => {
      const [href, image, title, label] = cast[key];
      return [href, image, label, title, `Open ${title}'s real portrait dossier and trace the relationship to this file.`];
    });
  }
  if (pathname.startsWith("/dispatches/") && dispatchSequences[slug]) {
    const otherDispatches = routeCards.dispatches.filter(([href]) => !href.endsWith(`/${slug}`));
    return [
      ...otherDispatches.slice(0, 4),
      ["/world", "/images/world-map-1024.webp", "Pressure map", "Trace the wider system", "See where the dispatch connects to the novel's institutions, leverage, and human cost."],
    ];
  }
  if (pathname.startsWith("/dispatches/")) {
    const otherDispatches = routeCards.dispatches.filter(([href]) => !href.endsWith(`/${slug}`));
    return [
      ...otherDispatches.slice(-4),
      ["/book", "/images/story/javon-darnell-alec-capitol-trio-1024.webp", "Primary file", "Enter the novel", "Connect the public analysis back to the characters and pressure system at the center of the story."],
    ];
  }
  return routeCards[type];
}

function sequenceFor(type, pathname) {
  const slug = routeSlug(pathname);
  if (pathname.startsWith("/characters/") && characterSequences[slug]) return characterSequences[slug];
  if (pathname.startsWith("/dispatches/") && dispatchSequences[slug]) return dispatchSequences[slug];
  return sequences[type];
}

function answersFor(type, pathname) {
  if (routeAnswers[pathname]) return routeAnswers[pathname];
  const slug = routeSlug(pathname);
  if (pathname.startsWith("/characters/") && characterSequences[slug]) {
    const character = characterSequences[slug];
    const name = character.eyebrow.split(" //")[0];
    return [
      [`Who is ${name}?`, character.steps[0][1]],
      [`What role does ${name} play?`, `${name} appears in The Ironic Ineptocracy, a satirical political thriller by Dillon Mohr. This public profile traces the character's pressure, relationships, and place in the larger machine.`],
      [`Does the ${name} character file contain spoilers?`, "No. The public character file is a spoiler-safe introduction and uses the site's real photographic portrait for the character."],
    ];
  }
  if (pathname.startsWith("/dispatches/") && dispatchAnswers[slug]) return dispatchAnswers[slug];
  return coreAnswers[type];
}

function answerMarkup(type, pathname) {
  const answers = answersFor(type, pathname);
  const id = `answers-${routeSlug(pathname).replace(/[^a-z0-9-]/g, "")}`;
  return `
${AEO_START}
      <section class="section section--answers" aria-labelledby="${id}">
        <div class="container answer-grid">
          <header class="answer-grid__header reveal">
            <span class="case-label">Quick answers // citable brief</span>
            <h2 id="${id}">The answer before the machinery.</h2>
            <p class="prose">Direct, spoiler-safe answers for readers, search engines, and AI assistants.</p>
          </header>
          <div class="answer-stack" data-aeo-faq>
            ${answers.map(([question, answer]) => `
            <article class="answer-card reveal">
              <h3>${question}</h3>
              <p>${answer}</p>
            </article>`).join("")}
          </div>
        </div>
      </section>
${AEO_END}`;
}

function seoFoundationMarkup(type, pathname, includeFaq = true) {
  const answers = pathname === "/404" || !includeFaq ? [] : answersFor(type, pathname);
  const robots = pathname === "/404"
    ? "noindex,follow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ironicineptocracy.com/#website",
        name: "The Ironic Ineptocracy",
        url: "https://ironicineptocracy.com/",
        inLanguage: "en-US",
        publisher: { "@id": "https://ironicineptocracy.com/#author" },
      },
      {
        "@type": "Person",
        "@id": "https://ironicineptocracy.com/#author",
        name: "Dillon Mohr",
        url: "https://ironicineptocracy.com/press",
        knowsAbout: ["political satire", "political thrillers", "institutional failure", "propaganda", "political corruption fiction"],
      },
    ],
  };
  const faq = answers.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answers.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  } : null;
  return `
    ${SEO_HEAD_START}
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Dillon Mohr" />
    <link rel="alternate" type="application/rss+xml" title="The Ironic Ineptocracy Blog and Dispatches" href="/feed.xml" />
    <link rel="alternate" type="text/plain" title="AI content index" href="/llms.txt" />
    <script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>${faq ? `
    <script type="application/ld+json">${JSON.stringify(faq).replace(/</g, "\\u003c")}</script>` : ""}
    ${SEO_HEAD_END}`;
}

function dispatchLibraryMarkup() {
  const items = routeCards.dispatches.slice(4);
  return `
${LIBRARY_START}
      <section class="dispatch-library" aria-labelledby="search-library-title">
        <div class="container">
          <span class="case-label">The blog // searchable field notes</span>
          <h2 id="search-library-title">Answers built to escape the file.</h2>
          <p class="prose">Definitions, political satire reading routes, book-club prompts, and corruption-fiction analysis. These are the public blog files.</p>
          <div class="dispatch-library__grid">
            ${items.map(([href, image, label, title, copy]) => `
            <a class="dispatch-library__item reveal" href="${href}" style="--library-image: url('${image}')">
              <span class="case-label">${label}</span>
              <h3>${title}</h3>
              <p>${copy}</p>
            </a>`).join("")}
          </div>
        </div>
      </section>
${LIBRARY_END}`;
}

function cardMarkup([href, image, label, title, copy], index) {
  return `
              <article class="swipe-card depth-card reveal" data-depth-card>
                <a class="swipe-card__media" href="${href}" aria-label="Open ${title}">
                  <img src="${image}" alt="${title} evidence image." loading="lazy" decoding="async" />
                  <span class="swipe-card__index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                </a>
                <div class="swipe-card__copy">
                  <span class="case-label">${label}</span>
                  <h3><a href="${href}">${title}</a></h3>
                  <p>${copy}</p>
                  <a class="text-link" href="${href}">Open this file <span aria-hidden="true">→</span></a>
                </div>
              </article>`;
}

function expansionMarkup(type, pathname) {
  const seq = sequenceFor(type, pathname);
  const cards = cardsFor(type, pathname);
  const id = routeSlug(pathname).replace(/[^a-z0-9-]/g, "");
  return `
${START}
      <section class="case-sequence" aria-labelledby="sequence-title-${id}">
        <div class="container case-sequence__grid">
          <div class="case-sequence__visual reveal" data-parallax>
            <figure class="evidence-stack">
              <img src="${seq.image}" alt="${seq.alt}" loading="lazy" decoding="async" />
              <figcaption>Evidence layer // scroll to examine</figcaption>
            </figure>
          </div>
          <div class="case-sequence__story">
            <header class="case-sequence__header">
              <span class="case-label">${seq.eyebrow}</span>
              <h2 id="sequence-title-${id}">${seq.title}</h2>
            </header>
            ${seq.steps.map(([title, copy], index) => `
            <article class="sequence-step reveal" data-sequence-step>
              <span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>${title}</h3>
                <p>${copy}</p>
              </div>
            </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="swipe-dossier" aria-labelledby="swipe-title-${id}" data-swipe-section>
        <div class="container swipe-dossier__head">
          <div>
            <span class="case-label">Evidence carousel // drag or swipe</span>
            <h2 id="swipe-title-${id}">Follow the next pressure point.</h2>
          </div>
          <div class="swipe-controls" aria-label="Evidence carousel controls">
            <button type="button" data-swipe-prev aria-label="Previous file">←</button>
            <span data-swipe-count aria-live="polite">01 / ${String(cards.length).padStart(2, "0")}</span>
            <button type="button" data-swipe-next aria-label="Next file">→</button>
          </div>
        </div>
        <div class="swipe-rail" data-swipe-rail tabindex="0" aria-label="Related evidence files">
          ${cards.map(cardMarkup).join("")}
        </div>
      </section>
${END}`;
}

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "dist" || entry.name === ".git" || entry.name === "node_modules") continue;
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await walk(absolute));
    else if (entry.name === "index.html" || (dir === root && entry.name === "404.html")) found.push(absolute);
  }
  return found;
}

for (const file of await walk(root)) {
  const rel = relative(root, file).split(sep).join("/");
  const pathname = rel === "index.html" ? "/" : rel === "404.html" ? "/404" : `/${rel.replace(/\/index\.html$/, "")}`;
  const type = classify(pathname);
  let html = await readFile(file, "utf8");

  html = html
    .replace(new RegExp(`${START}[\\s\\S]*?${END}`, "g"), "")
    .replace(new RegExp(`${AEO_START}[\\s\\S]*?${AEO_END}`, "g"), "")
    .replace(new RegExp(`${SEO_HEAD_START}[\\s\\S]*?${SEO_HEAD_END}`, "g"), "")
    .replace(new RegExp(`${LIBRARY_START}[\\s\\S]*?${LIBRARY_END}`, "g"), "")
    .replace(/\s*<meta name="robots"[^>]*\/?>/gi, "")
    .replace(/\s*<meta name="author"[^>]*\/?>/gi, "")
    .replace(/\s*<link rel="alternate" type="application\/rss\+xml"[^>]*\/?>/gi, "")
    .replace(/\s*<link rel="alternate" type="text\/plain"[^>]*\/?>/gi, "")
    .replace(/\s*<meta name="google-site-verification" content="REPLACE-WITH-GSC-TOKEN"\s*\/?>/gi, "")
    .replace(/\s*<meta name="meta-pixel-id" content="REPLACE-WITH-PIXEL-ID"\s*\/?>/gi, "")
    .replace(/(<a[^>]+href="\/dispatches"[^>]*>)Dispatches(<\/a>)/g, "$1Blog / Dispatches$2");
  html = html.replace(
    /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g,
    "https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;700&display=swap"
  );
  html = html
    .replace(/\/assets\/css\/site\.css(?:\?[^"]*)?/g, "/assets/css/site.css?v=20260730-flag-seo4")
    .replace(/\/assets\/js\/site\.js(?:\?[^"]*)?/g, "/assets/js/site.js?v=20260730-flag-seo4");

  const hasAuthoredFaq = html.includes("data-aeo-faq");
  html = html.replace("</head>", `${seoFoundationMarkup(type, pathname, !hasAuthoredFaq)}\n  </head>`);

  if (html.includes("</main>")) {
    if (pathname === "/dispatches") {
      html = html.replace("</main>", `${dispatchLibraryMarkup()}\n    </main>`);
    }
    if (pathname !== "/404" && !hasAuthoredFaq) {
      html = html.replace("</main>", `${answerMarkup(type, pathname)}\n    </main>`);
    }
    const insertion = expansionMarkup(type, pathname);
    const ctaIndex = html.indexOf('<section class="cta-band"');
    if (ctaIndex >= 0) html = `${html.slice(0, ctaIndex)}${insertion}\n\n      ${html.slice(ctaIndex)}`;
    else html = html.replace("</main>", `${insertion}\n    </main>`);
  }

  html = html
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
  await writeFile(file, html, "utf8");
  console.log(`Expanded ${pathname} as ${type}`);
}
