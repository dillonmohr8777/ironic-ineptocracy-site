import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const origin = "https://ironicineptocracy.com";
const published = "2026-07-30";

const articles = [
  {
    slug: "what-is-ineptocracy",
    seoTitle: "What Is an Ineptocracy? Meaning, Origin & Examples",
    title: "What Is an Ineptocracy?",
    description: "Ineptocracy means government or leadership by the incompetent. See the term's origin, how it differs from kakistocracy, and why political satire uses it.",
    kicker: "Definition file // plain English",
    deck: "A government can fail by accident, by design, or by rewarding the people least capable of admitting the difference.",
    image: "/images/social/generated-scenes/final/mcnulty-white-house-protest-feed.png",
    alt: "A fictional political protest outside the White House in the world of The Ironic Ineptocracy.",
    keywords: ["ineptocracy meaning", "what is ineptocracy", "ineptocracy examples", "ineptocracy origin", "ineptocracy definition government", "ineptocracy government"],
    lead: "<strong>Ineptocracy</strong> means government or leadership by incompetent people. The word combines <em>inept</em> with the suffix <em>-cracy</em>, meaning rule or power. In political satire, it describes a system where failure is not an isolated mistake but the operating culture.",
    body: `
      <h2>What does ineptocracy mean in plain English?</h2>
      <p>An ineptocracy is a government characterized by incompetent leaders or the broader condition of being governed by people who cannot perform the work their authority requires. That definition is narrower than “bad government.” A government can be cruel, corrupt, or authoritarian while remaining brutally competent. Ineptocracy points directly at incapacity.</p>
      <div class="intel-box"><strong>Plain-language test</strong><p>If the same leaders repeatedly fail upward, promote loyalty over ability, treat consequences as public-relations problems, and make ordinary people absorb the cost, you are looking at the logic of an ineptocracy.</p></div>
      <p>The term is usually derogatory. It is not a formal constitutional category. It is a compact piece of political language that turns a pattern of failure into something people can name, question, and satirize.</p>

      <h2>Where does the word ineptocracy come from?</h2>
      <p>The word combines <em>inept</em>, meaning unskilled or incapable, with <em>-cracy</em>, a suffix used for systems of rule or power. Dictionaries and word-reference sources describe it as a derogatory name for government by incompetent people. It is political shorthand, not a formally defined constitutional model.</p>
      <p>That origin explains why the word travels well in satire. It sounds like the name of a system because it is built like the names of systems, but its diagnosis is performance: the people with authority cannot meet the demands of the authority they hold.</p>

      <h2>What are examples of ineptocracy?</h2>
      <p>A fictional ineptocracy might ignore repeated warnings until a preventable crisis becomes inevitable, promote loyal officials after visible failures, or preserve a broken program because admitting the error would be politically expensive. Another example is a public agency that cannot deliver its mandate but continues awarding contracts, producing slogans, and punishing the people most exposed to its mistakes.</p>
      <p>The important distinction is repetition. One error does not establish an ineptocracy. The pattern appears when failure becomes self-protecting: consequences move downward, rewards move upward, and the system learns how to excuse the mistake without learning how to prevent the next one.</p>

      <h2>Ineptocracy vs. kakistocracy, kleptocracy, and oligarchy</h2>
      <p>These words overlap, but they diagnose different problems. The distinction matters because a system can be more than one of them at once.</p>
      <div class="comparison-wrap"><table class="comparison-table">
        <caption class="sr-only">How ineptocracy compares with related forms of government</caption>
        <thead><tr><th>Term</th><th>Core meaning</th><th>The central question</th></tr></thead>
        <tbody>
          <tr><td><strong>Ineptocracy</strong></td><td>Rule marked by incompetence</td><td>Can the people in charge perform the job?</td></tr>
          <tr><td><strong>Kakistocracy</strong></td><td>Rule by the worst or least qualified</td><td>Why were the least suitable people elevated?</td></tr>
          <tr><td><strong>Kleptocracy</strong></td><td>Rule used for theft and private enrichment</td><td>Who is extracting public wealth?</td></tr>
          <tr><td><strong>Oligarchy</strong></td><td>Rule concentrated among a small group</td><td>How few people control the decisions?</td></tr>
          <tr><td><strong>Plutocracy</strong></td><td>Rule or control by the wealthy</td><td>How directly does wealth become political power?</td></tr>
        </tbody>
      </table></div>
      <p>The Ironic Ineptocracy uses the title as a fictional diagnosis. The novel asks what happens when visible incompetence creates room for invisible competence: donors, contractors, propagandists, and private actors who know exactly how to profit from public failure.</p>

      <h2>Why political satire needs words like ineptocracy</h2>
      <p>Satire works by compressing a complicated structure into an image, phrase, character, or contradiction that readers can recognize immediately. “Ineptocracy” does that work in five syllables. It converts a pile of hearings, excuses, slogans, and failed procedures into one accusation: the people with authority cannot do the work, and the system keeps rewarding them anyway.</p>
      <p>That compression does not replace analysis. It opens the door to it. Once the pattern has a name, readers can ask who benefits from the failure, who pays for it, and why the people making the largest mistakes remain insulated from the consequences.</p>

      <h2>How the novel turns the definition into a thriller</h2>
      <p>Darnell Covington is seventeen, mathematically gifted, and Harvard-bound. His competence makes him visible to institutions that do not know how to value a person without first assigning a use. Around him, public systems fail loudly while private power moves with discipline.</p>
      <p>That contrast is the thriller engine. The danger is not only that the government is incompetent. The danger is that somebody else may be competent enough to convert the chaos into ownership.</p>
      <div class="intel-box"><strong>The shortest answer</strong><p>An ineptocracy is government by the incompetent. A satirical ineptocracy is what happens when that incompetence becomes a repeatable machine with slogans, paperwork, winners, and an invoice.</p></div>`,
    faq: [
      ["Is ineptocracy a real word?", "Yes. Ineptocracy is an established derogatory noun for government characterized by incompetent leaders or governance by the incompetent."],
      ["What is an example of ineptocracy?", "A fictional example is a government that repeatedly ignores expert warnings, promotes the officials responsible for preventable failures, and makes ordinary people absorb the consequences."],
      ["What is the origin of ineptocracy?", "Ineptocracy combines inept, meaning unskilled or incapable, with -cracy, a suffix referring to rule or power."],
      ["What is the difference between ineptocracy and kakistocracy?", "Ineptocracy emphasizes incompetence in government. Kakistocracy emphasizes rule by the worst or least qualified people. A system can fit both descriptions."],
      ["Is The Ironic Ineptocracy nonfiction?", "No. The Ironic Ineptocracy is a work of political satire and fiction by Dillon Mohr."],
    ],
    sources: [
      ["Wiktionary: ineptocracy definition and etymology", "https://en.wiktionary.org/wiki/ineptocracy"],
      ["Collins English Dictionary: ineptocracy word submission and usage note", "https://www.collinsdictionary.com/submission/2601/ineptocracy"],
    ],
  },
  {
    slug: "political-satire-books-government-incompetence",
    seoTitle: "Political Satire Books About Government Incompetence",
    title: "Political Satire Books About Government Incompetence",
    description: "A reader-first guide to political satire books about incompetent government, bureaucracy, propaganda, private power, and institutional failure.",
    kicker: "Reading file // political satire",
    deck: "The sharpest political satire does not merely call leaders stupid. It shows how stupidity acquires a budget, a slogan, and armed protection.",
    image: "/images/social/generated-scenes/final/boston-protest-darnell-javon-feed.png",
    alt: "Two fictional young men at a Boston protest in a political satire scene.",
    keywords: ["political satire books", "political satire novels", "political humor books", "political comedy books", "modern political satire novels", "books about government incompetence"],
    lead: "<strong>Political satire books about government incompetence</strong> use humor, exaggeration, irony, and absurd systems to show how failure becomes normal. The strongest examples combine a readable story with a precise target: bureaucracy, propaganda, corruption, war, private influence, or leadership that keeps failing upward.",
    body: `
      <h2>What makes a political satire book work?</h2>
      <p>A political satire needs more than a foolish politician. It needs a system that makes the foolishness consequential. The joke becomes durable when incompetence survives because procedure protects it, money rewards it, media reframes it, or exhausted citizens begin treating it as normal.</p>
      <p>Readers searching for modern political satire novels often want two things at once: the intellectual charge of political fiction and the forward motion of a thriller. That combination is difficult. A lecture stops the story. A story with no argument loses the satire.</p>
      <div class="intel-box"><strong>Reader test</strong><p>The satire is working when the institution feels absurd and believable at the same time. You laugh first, then recognize the form on your own desk.</p></div>

      <h2>Five lanes inside political satire</h2>
      <div class="comparison-wrap"><table class="comparison-table">
        <caption class="sr-only">Five political satire traditions and the pressures they expose</caption>
        <thead><tr><th>Satirical lane</th><th>What it exposes</th><th>What readers feel</th></tr></thead>
        <tbody>
          <tr><td>Bureaucratic satire</td><td>Rules that protect process from reality</td><td>Frustration, recognition, dark humor</td></tr>
          <tr><td>Dystopian satire</td><td>Control presented as safety or progress</td><td>Dread mixed with absurdity</td></tr>
          <tr><td>War satire</td><td>Contradictory orders and expendable people</td><td>Shock, anger, disbelief</td></tr>
          <tr><td>Media satire</td><td>Performance replacing information</td><td>Suspicion and comic discomfort</td></tr>
          <tr><td>Oligarchic satire</td><td>Private wealth quietly writing public choices</td><td>Recognition of hidden leverage</td></tr>
        </tbody>
      </table></div>

      <h2>Books and traditions worth reading</h2>
      <h3>Animal Farm</h3>
      <p>George Orwell's allegory remains an efficient model for showing how revolutionary language can be edited until hierarchy returns wearing a new slogan. Its clarity makes it useful for readers beginning with political satire.</p>
      <h3>Catch-22</h3>
      <p>Joseph Heller turns military bureaucracy into a self-protecting logical trap. The system is funny because its contradictions are obvious and terrifying because the contradictions still control bodies.</p>
      <h3>It Can't Happen Here</h3>
      <p>Sinclair Lewis uses an American political setting to examine how authoritarian language can arrive through familiar institutions and recognizable ambition rather than through a distant fantasy.</p>
      <h3>A Case of Exploding Mangoes</h3>
      <p>Mohammed Hanif's dark political satire mixes tyranny, conspiracy, and institutional absurdity. The Booker Prize describes it as a political satire about love, betrayal, tyranny, family, and a conspiracy struggling to happen.</p>
      <h3>The Ironic Ineptocracy</h3>
      <p>Dillon Mohr's novel brings the form into a contemporary thriller structure: a brilliant teenager, a draft machine, donor power, manipulated memory, and public failure that may be functioning exactly as somebody intended.</p>

      <h2>How to choose your next political satire</h2>
      <ol>
        <li><strong>Choose the target.</strong> Decide whether you want bureaucracy, authoritarianism, war, media, or billionaire influence.</li>
        <li><strong>Choose the temperature.</strong> Some satires are primarily funny. Others use humor as a brief release inside a darker thriller.</li>
        <li><strong>Choose the distance.</strong> Allegory creates space; near-future fiction creates recognition; contemporary fiction creates immediate friction.</li>
        <li><strong>Choose the story engine.</strong> If you need momentum, look for conspiracy, pursuit, investigation, or institutional pressure rather than pure social observation.</li>
      </ol>
      <p>The right book is not the one with the loudest political agreement. It is the one that makes the machinery visible without flattening every character into a position statement.</p>`,
    faq: [
      ["What is a political satire book?", "A political satire book uses humor, irony, exaggeration, or absurdity to criticize political behavior, institutions, ideology, or abuses of power."],
      ["Are political satire and dystopian fiction the same?", "No. Political satire is a method or tone, while dystopian fiction is a genre about oppressive or deeply damaged societies. A book can be both."],
      ["What political satire should I read after 1984?", "Readers who want more humor can try Animal Farm, Catch-22, or A Case of Exploding Mangoes. Readers who want a contemporary thriller structure can explore The Ironic Ineptocracy."],
    ],
    sources: [
      ["Penguin: a guide to major dystopian books and satirical traditions", "https://www.penguin.co.uk/discover/articles/best-dystopian-books"],
      ["The Booker Prizes: A Case of Exploding Mangoes", "https://thebookerprizes.com/the-booker-library/books/a-case-of-exploding-mangoes"],
      ["Five Books: P. J. O'Rourke on political satire", "https://fivebooks.com/best-books/p-j-orourke-on-political-satire/"],
    ],
  },
  {
    slug: "books-like-1984-but-funny",
    seoTitle: "Books Like 1984 but Funny: Dark Political Satire",
    title: "Books Like 1984 but Funny",
    description: "Looking for books like 1984 with more dark humor? Compare political satires about propaganda, bureaucracy, surveillance, memory, and power.",
    kicker: "Reader route // dark humor",
    deck: "You want the pressure of Orwell, but you also want the system to be ridiculous enough to laugh at before it closes the door.",
    image: "/images/social/generated-scenes/final/memory-economy-feed.png",
    alt: "A fictional memory-control console from a dark political satire.",
    keywords: ["books like 1984", "books like 1984 but funny", "funny dystopian political books", "dystopian political satire books"],
    lead: "<strong>Books like 1984 but funny</strong> keep Orwell's interest in propaganda, surveillance, controlled language, and political power while adding absurdity, dark comedy, or a faster satirical plot. Start with <em>Animal Farm</em>, <em>Catch-22</em>, <em>Jennifer Government</em>, or a contemporary political satire such as <em>The Ironic Ineptocracy</em>.",
    body: `
      <h2>What makes a book “like 1984”?</h2>
      <p>Readers usually mean one of four things when they ask for books like 1984: a state that controls information, institutions that invade private life, language engineered to restrict thought, or a protagonist trying to preserve an inner truth against an official reality.</p>
      <p>The “but funny” part changes the reading experience. Comedy does not make the stakes smaller. In effective dystopian satire, humor makes the control system easier to see. A ridiculous rule can reveal a serious structure faster than a page of explanation.</p>
      <div class="intel-box"><strong>Fast recommendation</strong><p>Choose <em>Catch-22</em> for bureaucratic logic, <em>Animal Farm</em> for political allegory, <em>Jennifer Government</em> for corporate absurdity, and <em>The Ironic Ineptocracy</em> for a modern thriller about competence, propaganda, and manipulated memory.</p></div>

      <h2>Seven books for readers who want Orwell with dark humor</h2>
      <div class="comparison-wrap"><table class="comparison-table">
        <caption class="sr-only">Books for readers seeking dystopian political satire with dark humor</caption>
        <thead><tr><th>Book</th><th>Shared pressure point</th><th>Comic temperature</th></tr></thead>
        <tbody>
          <tr><td>Animal Farm</td><td>Propaganda, rewritten rules, political hierarchy</td><td>Allegorical and cutting</td></tr>
          <tr><td>Catch-22</td><td>Self-sealing bureaucracy and expendable people</td><td>Absurd and furious</td></tr>
          <tr><td>Jennifer Government</td><td>Corporate power replacing public authority</td><td>Fast and satirical</td></tr>
          <tr><td>A Case of Exploding Mangoes</td><td>Tyranny, conspiracy, and institutional absurdity</td><td>Darkly comic</td></tr>
          <tr><td>It Can't Happen Here</td><td>Authoritarianism through familiar American politics</td><td>Dry and warning-driven</td></tr>
          <tr><td>The Constant Rabbit</td><td>Bureaucracy, prejudice, and normalized cruelty</td><td>Whimsical and chilling</td></tr>
          <tr><td>The Ironic Ineptocracy</td><td>Propaganda, public failure, private power, and memory</td><td>Thriller-paced and confrontational</td></tr>
        </tbody>
      </table></div>

      <h2>Why humor belongs inside dystopian fiction</h2>
      <p>Authoritarian and bureaucratic systems often depend on language that is already unintentionally comic: contradictory directives, inflated titles, patriotic branding, and procedures that continue after their purpose has vanished. Satire does not import absurdity into that world. It notices the absurdity that power requires everyone else to treat as serious.</p>
      <p>Humor also creates contrast. A joke can make the next consequence land harder because the reader has briefly lowered their guard. The best funny dystopian books understand that rhythm. They do not turn suffering into a punch line. They turn the machinery around it into evidence.</p>

      <h2>Where The Ironic Ineptocracy fits</h2>
      <p>The Ironic Ineptocracy is not a retelling of 1984. It shares a concern with official reality, propaganda, and memory, then moves those concerns through donor networks, draft policy, surveillance systems, and a teenager whose intelligence makes him useful to people with power.</p>
      <p>The novel's central satirical contradiction is competence. Public leaders fail visibly. Private actors move efficiently. The question is whether the government is broken or whether its visible failures create exactly the market somebody wanted.</p>

      <h2>How to choose by mood</h2>
      <ul>
        <li><strong>Want the funniest bureaucracy?</strong> Start with Catch-22.</li>
        <li><strong>Want the shortest political allegory?</strong> Start with Animal Farm.</li>
        <li><strong>Want corporate dystopia?</strong> Try Jennifer Government.</li>
        <li><strong>Want conspiracy and tyranny?</strong> Try A Case of Exploding Mangoes.</li>
        <li><strong>Want a contemporary American political thriller?</strong> Open The Ironic Ineptocracy file.</li>
      </ul>`,
    faq: [
      ["Is 1984 a satire?", "1984 is commonly read as dystopian political fiction with satirical elements, especially in its treatment of propaganda, bureaucracy, and controlled language, though its dominant tone is bleak rather than comic."],
      ["What is a funny book similar to 1984?", "Catch-22, Animal Farm, Jennifer Government, and The Constant Rabbit all combine political systems with stronger comic or absurdist elements."],
      ["Is The Ironic Ineptocracy dystopian?", "The Ironic Ineptocracy is a satirical political thriller with dystopian pressure points, including propaganda, surveillance, institutional failure, and manipulated memory."],
    ],
    sources: [
      ["Library Journal: what to read after 1984", "https://www.libraryjournal.com/story/what-to-read-and-watch-after-1984"],
      ["Penguin: the best dystopian books", "https://www.penguin.co.uk/discover/articles/best-dystopian-books"],
      ["The Booker Prizes: A Case of Exploding Mangoes", "https://thebookerprizes.com/the-booker-library/books/a-case-of-exploding-mangoes"],
    ],
  },
  {
    slug: "political-thriller-book-club-questions",
    seoTitle: "Political Thriller Book Club Questions: 20 Prompts",
    title: "20 Political Thriller Book Club Questions",
    description: "Twenty political thriller and political satire book club questions about power, corruption, institutions, propaganda, sacrifice, and moral compromise.",
    kicker: "Reader guide // discussion prompts",
    deck: "The best political book club question does not ask whether you liked the villain. It asks which part of the villain's argument survived the meeting.",
    image: "/images/story/quiz-detector-console-1024.webp",
    alt: "A fictional reader-question console built like a political evidence file.",
    keywords: ["political thriller book club questions", "political satire book club questions", "political fiction discussion questions"],
    lead: "<strong>Political thriller book club questions</strong> should move beyond plot recall and force readers to argue about power, institutions, secrecy, sacrifice, and moral compromise. The twenty prompts below work with most political thrillers and political satires, including <em>The Ironic Ineptocracy</em>.",
    body: `
      <h2>Questions about power and competence</h2>
      <ol>
        <li>Which character had the most power, and which character understood power best?</li>
        <li>Where did incompetence become useful to someone more capable?</li>
        <li>Did the institution fail, or did it produce the outcome its incentives favored?</li>
        <li>Which leader confused authority with competence?</li>
        <li>Who benefited most from describing the crisis as unavoidable?</li>
      </ol>

      <h2>Questions about corruption and private influence</h2>
      <ol start="6">
        <li>Where did access become influence, and where did influence become control?</li>
        <li>Did any character remain technically within the rules while violating their purpose?</li>
        <li>Which relationship carried more political weight than the official chain of command?</li>
        <li>Was the central private actor buying a decision, a dependency, or the range of options?</li>
        <li>Who received the benefits, and who received the invoice?</li>
      </ol>

      <h2>Questions about propaganda, memory, and truth</h2>
      <ol start="11">
        <li>Which slogan did the most work with the least truth?</li>
        <li>What event changed meaning after another character controlled the description?</li>
        <li>Who preserved evidence, and who controlled whether it counted?</li>
        <li>What did the public in the novel know, and what had it merely heard often?</li>
        <li>If one missing document reappeared, whose story would collapse first?</li>
      </ol>

      <h2>Questions about sacrifice and moral compromise</h2>
      <ol start="16">
        <li>Who was treated as expendable before anyone used the word sacrifice?</li>
        <li>Which compromise looked reasonable in the moment but changed the entire moral direction?</li>
        <li>What would you have leaked, hidden, or refused in the protagonist's position?</li>
        <li>Did friendship operate as protection, obligation, or an alternative intelligence network?</li>
        <li>Does the ending deliver justice, survival, compromise, or a better-managed version of the same machine?</li>
      </ol>

      <div class="intel-box"><strong>Keep the room civil</strong><p>Anchor disagreement to a scene, decision, or line from the book. Ask readers to cite the text before they cite the news. Political fiction works best as a shared simulation, not a disguised argument about which person at the table is wrong.</p></div>

      <h2>A 60-minute political thriller book club format</h2>
      <div class="comparison-wrap"><table class="comparison-table">
        <caption class="sr-only">A sixty-minute political thriller book club agenda</caption>
        <thead><tr><th>Time</th><th>Discussion move</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>0–10 minutes</td><td>Choose the most consequential decision</td><td>Begin with the text, not general politics</td></tr>
          <tr><td>10–25 minutes</td><td>Map who had formal and informal power</td><td>Expose the hidden chain of influence</td></tr>
          <tr><td>25–40 minutes</td><td>Debate one moral compromise</td><td>Make readers defend a position</td></tr>
          <tr><td>40–52 minutes</td><td>Audit propaganda and missing evidence</td><td>Test how the story controls truth</td></tr>
          <tr><td>52–60 minutes</td><td>Rewrite one decision</td><td>End with consequence, not consensus</td></tr>
        </tbody>
      </table></div>

      <h2>Questions specific to The Ironic Ineptocracy</h2>
      <p>For groups reading Dillon Mohr's novel, begin with Darnell's intelligence as both gift and liability. Then trace the relationship between public incompetence and Dijon Garnier's private competence. The strongest discussion is not “Who is the villain?” It is “Which system made the villain's method rational?”</p>`,
    faq: [
      ["What are good political thriller book club questions?", "Good questions ask readers to evaluate decisions, power, corruption, institutional incentives, secrecy, and moral compromise. They should support more than one defensible answer."],
      ["How do you discuss politics in a book club without fighting?", "Keep the discussion anchored to the text. Ask members to cite a scene or decision, separate a character's argument from a reader's identity, and treat the novel as a shared thought experiment."],
      ["How many book club questions should you use?", "For a one-hour discussion, select five to eight questions. Use follow-up questions rather than rushing through a long list."],
    ],
    sources: [
      ["The Ironic Ineptocracy reader guide", "https://ironicineptocracy.com/reader-guide"],
      ["Open Library: political corruption fiction subject collection", "https://openlibrary.org/subjects/political_corruption_fiction"],
    ],
  },
  {
    slug: "political-corruption-fiction",
    seoTitle: "Political Corruption Fiction: Books About Power",
    title: "Political Corruption Fiction: How Novels Expose Power",
    description: "A guide to political corruption fiction about bribery, access, billionaire influence, bureaucracy, propaganda, and the systems that make abuse look ordinary.",
    kicker: "Theme file // corruption fiction",
    deck: "The most revealing corruption stories are not about a suitcase of cash. They are about the room being built so the suitcase is unnecessary.",
    image: "/images/social/generated-scenes/final/garnier-mansion-feed.png",
    alt: "A fictional billionaire mansion overlooking a city in a political corruption story.",
    keywords: ["books about political corruption fiction", "political corruption novels", "novels about billionaire influence in politics"],
    lead: "<strong>Political corruption fiction</strong> uses invented characters and systems to show how public authority can be bent by money, access, fear, loyalty, or controlled information. The most powerful novels go beyond obvious bribery and examine corruption that remains legal, procedural, and socially respectable.",
    body: `
      <h2>What counts as political corruption in fiction?</h2>
      <p>In fiction, corruption can be a direct exchange: money for a vote, protection for silence, or a contract for loyalty. But the richer stories examine the architecture around the exchange. Who controls access? Which institution depends on private funding? What information never reaches the public? Which choices are removed before the official decision begins?</p>
      <p>This is why political corruption novels can explain power differently from reporting. Fiction can place the reader inside the rationalizations of the donor, the official, the operative, and the person who pays the cost.</p>

      <h2>Five forms of corruption a novel can reveal</h2>
      <div class="comparison-wrap"><table class="comparison-table">
        <caption class="sr-only">Forms of political corruption commonly explored in fiction</caption>
        <thead><tr><th>Form</th><th>How it works</th><th>Story signal</th></tr></thead>
        <tbody>
          <tr><td>Transactional corruption</td><td>A direct exchange of value for official action</td><td>Money, favors, contracts, protection</td></tr>
          <tr><td>Access corruption</td><td>Some actors reach decision-makers before everyone else</td><td>Private rooms, informal calls, selective urgency</td></tr>
          <tr><td>Dependency corruption</td><td>An institution cannot act against the actor sustaining it</td><td>Funding gaps, private infrastructure, donor leverage</td></tr>
          <tr><td>Informational corruption</td><td>Power controls which facts remain credible or visible</td><td>Edited records, propaganda, destroyed evidence</td></tr>
          <tr><td>Moral corruption</td><td>People adapt their values to survive inside the system</td><td>Small compromises becoming permanent identity</td></tr>
        </tbody>
      </table></div>

      <h2>Why billionaire influence is a strong fiction engine</h2>
      <p>A billionaire antagonist becomes flat when wealth is treated as a superpower with no mechanism. The more interesting question is how wealth changes time, distance, and dependency. A wealthy actor can wait longer, reach a room sooner, absorb losses other people cannot, and make public institutions rely on private capacity.</p>
      <div class="intel-box"><strong>The Garnier position</strong><p>Dijon Garnier does not need to purchase every decision. He needs the system to consider his continued participation more realistic than its own independence.</p></div>
      <p>That distinction drives The Ironic Ineptocracy. Garnier's influence is not only a matter of personality. It is infrastructure. The political thriller emerges when characters realize that removing one man would not automatically remove the dependencies arranged around him.</p>

      <h2>Political corruption books to place on the shelf</h2>
      <p>The Open Library maintains a subject collection for political corruption fiction, showing how the theme crosses crime, conspiracy, social conditions, and institutional stories. Classic and modern political novels approach the subject from different distances: allegory, realism, dystopia, legal thriller, and satire.</p>
      <p>Readers can begin with works such as <em>Animal Farm</em> for corrupted ideals, <em>A Man of the People</em> for political hypocrisy and systemic corruption, <em>The Gilded Age</em> for greed and government, or <em>A Case of Exploding Mangoes</em> for tyranny and conspiracy. The Ironic Ineptocracy adds private technology, manipulated memory, and a draft machine to that conversation.</p>

      <h2>What to look for while reading</h2>
      <ol>
        <li><strong>Follow access.</strong> Note who gets a private meeting and who must use the public process.</li>
        <li><strong>Follow dependency.</strong> Identify what the institution can no longer provide for itself.</li>
        <li><strong>Follow language.</strong> Watch when “partnership,” “stability,” or “necessity” replaces a clearer description.</li>
        <li><strong>Follow memory.</strong> Ask who controls the archive after the event.</li>
        <li><strong>Follow the invoice.</strong> Find the person who absorbs the cost without participating in the decision.</li>
      </ol>
      <p>Political corruption fiction matters when it makes the invisible arrangement visible. The revelation is rarely that a bad person wanted power. It is that an ordinary process learned how to serve that desire without ever printing it on the form.</p>`,
    faq: [
      ["What is political corruption fiction?", "Political corruption fiction is narrative fiction focused on the misuse, capture, or distortion of public authority through money, access, loyalty, secrecy, coercion, or institutional dependency."],
      ["Are political corruption novels always thrillers?", "No. They can be literary fiction, satire, dystopia, crime, legal fiction, or historical fiction. A thriller adds urgency, investigation, danger, or pursuit."],
      ["What is The Ironic Ineptocracy about?", "The Ironic Ineptocracy is a satirical political thriller by Dillon Mohr about brilliance, friendship, donor power, public failure, propaganda, and manipulated memory."],
    ],
    sources: [
      ["Open Library: political corruption fiction", "https://openlibrary.org/subjects/political_corruption_fiction"],
      ["Project Gutenberg: political corruption fiction subject shelf", "https://www.gutenberg.org/ebooks/subject/5576?sort_order=release_date"],
      ["The Booker Prizes: A Case of Exploding Mangoes", "https://thebookerprizes.com/the-booker-library/books/a-case-of-exploding-mangoes"],
    ],
  },
];

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function faqMarkup(items) {
  return items.map(([question, answer]) => `
            <article class="answer-card">
              <h3>${question}</h3>
              <p>${answer}</p>
            </article>`).join("");
}

function sourcesMarkup(items) {
  return items.map(([label, href]) => `<li><a href="${href}" rel="noopener noreferrer">${label}</a></li>`).join("");
}

function render(article) {
  const url = `${origin}/dispatches/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: published,
    dateModified: published,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: "Dillon Mohr", url: `${origin}/press` },
    publisher: { "@type": "Organization", name: "The Ironic Ineptocracy", url: origin },
    image: `${origin}${article.image}`,
    keywords: article.keywords.join(", "),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      { "@type": "ListItem", position: 2, name: "Blog and Dispatches", item: `${origin}/dispatches` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return `<!doctype html>
<html lang="en" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${article.description}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="theme-color" content="#030303" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${article.seoTitle}" />
    <meta property="og:description" content="${article.description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${origin}${article.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.seoTitle}" />
    <meta name="twitter:description" content="${article.description}" />
    <meta name="twitter:image" content="${origin}${article.image}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" type="application/rss+xml" title="The Ironic Ineptocracy Blog and Dispatches" href="/feed.xml" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;700&display=swap" />
    <title>${article.seoTitle} | The Ironic Ineptocracy</title>
    <script type="application/ld+json">${jsonLd(articleSchema)}</script>
    <script type="application/ld+json">${jsonLd(faqSchema)}</script>
    <script type="application/ld+json">${jsonLd(breadcrumbSchema)}</script>
    <link rel="stylesheet" href="/assets/css/site.css?v=20260730-home-flag-only" />
    <script defer src="/assets/js/site.js?v=20260730-home-flag-only"></script>
    <script defer src="/_vercel/insights/script.js"></script>
    <meta name="ga4-measurement-id" content="G-H06CG798DT" />
    <script defer src="/assets/site-analytics.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="classification-bar" aria-hidden="true"><div class="container"><span>The Ironic Ineptocracy &mdash; Case 017</span><span>Blog // Search file</span></div></div>
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="wordmark" href="/">The Ironic <span class="tick">Ineptocracy</span></a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" class="site-nav" aria-label="Primary navigation"><ul>
          <li><a href="/book">Book</a></li><li><a href="/world">World</a></li><li><a href="/characters">Characters</a></li>
          <li><a href="/dispatches" aria-current="page">Blog / Dispatches</a></li><li><a href="/reader-guide">Reader guide</a></li>
          <li><a href="/press">Press</a></li><li class="nav-cta"><a href="/dossier">Enter the dossier</a></li>
        </ul></nav>
      </div>
    </header>
    <main id="main">
      <div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/dispatches">Blog / Dispatches</a></li><li><span aria-current="page">${article.title}</span></li></ol></nav></div>
      <section class="hero hero--interior" aria-labelledby="article-title">
        <div class="container split">
          <div>
            <span class="kicker kicker--signal">${article.kicker}</span>
            <h1 id="article-title">${article.title}</h1>
            <p class="deck">${article.deck}</p>
            <p class="article-meta"><span>By Dillon Mohr</span><span>Updated July 30, 2026</span><span>Reader-safe analysis</span></p>
          </div>
          <figure class="figure-frame reveal"><img src="${article.image}" alt="${article.alt}" width="1080" height="1080" decoding="async" /><figcaption>Public evidence file // ${article.slug.replaceAll("-", " ")}</figcaption></figure>
        </div>
      </section>
      <section class="section" aria-label="Direct answer and article">
        <article class="container editorial-article">
          <div class="answer-brief"><span class="case-label">Bottom line</span><p class="answer-brief__lead">${article.lead}</p></div>
          <div class="prose">${article.body}
            <h2>Frequently asked questions</h2>
            <div class="answer-stack" data-aeo-faq>${faqMarkup(article.faq)}</div>
            <h2>Sources and further reading</h2>
            <ul class="source-list">${sourcesMarkup(article.sources)}</ul>
            <div class="intel-box"><strong>About the author</strong><p>Dillon Mohr is the author of <em>The Ironic Ineptocracy</em>, a satirical political thriller about brilliance, friendship, private money, public failure, propaganda, and manipulated memory.</p></div>
          </div>
        </article>
      </section>
      <section class="cta-band" aria-labelledby="article-cta"><div class="container"><h2 id="article-cta">Keep following the file.</h2><p>Open the novel's world, character dossiers, and reader-only Garnier file.</p><div class="hero__actions"><a class="btn btn--primary" href="/book">Read the book brief</a><a class="btn btn--ghost" href="/dossier">Enter the dossier</a></div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><div class="site-footer__grid"><div><a class="wordmark" href="/">The Ironic <span class="tick">Ineptocracy</span></a><p>A satirical political thriller by Dillon Mohr.</p></div><nav aria-label="Footer navigation"><ul><li><a href="/dispatches">Blog / Dispatches</a></li><li><a href="/reader-guide">Reader guide</a></li><li><a href="/press">Press</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul></nav></div><div class="site-footer__bottom"><span>&copy; 2026 Dillon Mohr.</span><span>This is a work of fiction.</span></div></div></footer>
  </body>
</html>`;
}

for (const article of articles) {
  const directory = join(root, "dispatches", article.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), render(article), "utf8");
  console.log(`Generated SEO dispatch: ${article.slug}`);
}
