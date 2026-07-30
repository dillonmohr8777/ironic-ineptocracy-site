import { readdir, readFile, writeFile } from "node:fs/promises";
import { relative, join, sep } from "node:path";

const root = process.cwd();
const START = "<!-- immersive-expansion:start -->";
const END = "<!-- immersive-expansion:end -->";

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
      ...otherDispatches,
      ["/world", "/images/world-map-1024.webp", "Pressure map", "Trace the wider system", "See where the dispatch connects to the novel's institutions, leverage, and human cost."],
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

  html = html.replace(new RegExp(`${START}[\\s\\S]*?${END}`, "g"), "");
  html = html.replace(
    /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g,
    "https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;700&display=swap"
  );

  if (html.includes("</main>")) {
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
