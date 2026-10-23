// Each brief is chosen by the link: ?package=<id>. No package (or an unknown
// one) falls back to the original creative brief. To add a package (the Read,
// the Arc), add its sections and an entry in BRIEFS below.

const CREATIVE_SECTIONS = [
  {
    id: "intro",
    type: "welcome",
    title: "Let's sketch out your story.",
    subtitle:
      "Answer as best you can, as real as possible. Unfiltered brain dumps create perfect raw material for your brand.",
    cta: "Let's go",
  },
  {
    id: "project",
    label: "THE PROJECT",
    questions: [
      {
        id: "what_you_do",
        label: "In your own words, how do you describe what you do when you're talking to others in your industry? What about to your audience?",
        hint: "(Don't polish it. A messy brain dump is perfect.)",
        type: "textarea",
        required: true,
      },
      {
        id: "why_now",
        label: "What's not working about the current version of your brand?",
        hint: "What's making you want to evolve it?",
        type: "textarea",
        required: true,
      },
      {
        id: "platforms",
        label: "Where do you mostly show up and do business right now?",
        hint: "List the main places: platforms, websites, communities, collaborations, and any IRL spaces/events.",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "audience",
    label: "YOUR AUDIENCE",
    questions: [
      {
        id: "primary_audience",
        label: "Who's your main audience right now? Who follows you closely or actually buys from you?",
        hint: "Describe them like real people: what are they hoping to feel, fix, escape, learn, or become when they come to you and your content?",
        type: "textarea",
        required: true,
      },
      {
        id: "why_they_choose_you",
        label: "When someone decides to hire you, what's usually happening?",
        hint: "What do they say they're paying for when they choose you?",
        type: "textarea",
        required: true,
      },
      {
        id: "biggest_objection",
        label: "What's the biggest hesitation you hear before someone commits?",
        hint: "(Price, uncertainty, time, fear of judgment, not clear on what they get, etc.)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "positioning",
    label: "COMPETITION & POSITIONING",
    questions: [
      {
        id: "competitors",
        label: "Who else does what you do?",
        hint: "List 2 to 5 creators or brands in your space (names, handles, links). Don't overthink it.",
        type: "textarea",
        required: false,
      },
      {
        id: "what_makes_you_different",
        label: "What makes you the right choice over them?",
        hint: "One clear sentence. Not future-you, who you actually are right now.",
        type: "textarea",
        required: true,
      },
      {
        id: "proof_points",
        label: "Back up that answer.",
        hint: "Give 2 to 3 specifics: a skill you own, a track record, a niche audience you already have, something you do that others don't or won't.",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "brand",
    label: "YOUR BRAND CHARACTER",
    questions: [
      {
        id: "whats_off",
        label: "What feels confusing or \"off\" about your brand right now? Where do you notice inconsistency?",
        hint: "(Ex: Visuals, voice, content, offers, audience, opportunities)",
        type: "textarea",
        required: true,
      },
      {
        id: "brand_words",
        label: "If someone had to describe your brand in just 4-6 words, what would you want those words to be?",
        hint: "",
        type: "textarea",
        required: true,
      },
      {
        id: "feels_like",
        label: "What are 3 references you want this to feel like?",
        hint: "(Ex: brands, creators, films, photographers, fashion, hotels - anything)\n\nFor each one, tell me what you're borrowing (mood, pacing, color, tone, confidence, elegance, intimacy, edge, etc.).",
        type: "textarea",
        required: true,
      },
      {
        id: "avoid",
        label: "What are 3 things you absolutely don't want to be associated with anymore?",
        hint: "(Industry clichés, aesthetics, language, content, anything that makes you cringe.)",
        type: "textarea",
        required: true,
      },
      {
        id: "core_identity",
        label: "What's the core of you that can't change no matter how the brand evolves?",
        hint: "(Values, tone, the experience you create, what you stand for)",
        type: "textarea",
        required: false,
      },
      {
        id: "platform_restrictions",
        label: "Are there any rules we have to build around? Anything you can't say or show publicly?",
        hint: "(Platform restrictions, privacy, legal boundaries, or personal limits)",
        type: "textarea",
        required: false,
      },
      {
        id: "existing_assets",
        label: "What should I look at before I start?",
        hint: "Share any existing assets: old bios, brand decks, photography, social media, etc.",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "deliverables",
    label: "WHAT WE'RE BUILDING & WHERE WE'RE GOING",
    questions: [
      {
        id: "deliverables",
        label: "What specific deliverables are most important to you at the end of this project?",
        hint: "",
        type: "textarea",
        required: true,
      },
      {
        id: "if_this_works",
        label: "If this works, what does it unlock for you over the next 12 months (income, audience, opportunities, lifestyle, privacy, etc.)?",
        hint: "",
        type: "textarea",
        required: true,
      },
      {
        id: "anything_else",
        label: "Anything else I should know?",
        hint: "(Any weird context, sensitivities, \"sacred cows,\" things you've already tried, hard constraints, or instincts you want me to respect (or push back on)?)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "submit",
    type: "submit",
    title: "That's everything.",
    subtitle: "I'll review this before we talk through it on our upcoming discovery call. Expect me to push back on a few things (that's the job).",
  },
];

// The Sprint: three weeks of messaging and up to three pages of copy, for
// teams whose direction is already set. Sent after the deposit is paid.
const SPRINT_SECTIONS = [
  {
    id: "intro",
    type: "welcome",
    title: "Let's get your story onto the page.",
    subtitle:
      "This is the brief for your Sprint. Answer as best you can, as real as possible. Unfiltered brain dumps give me the best raw material for your copy.",
    cta: "Let's go",
  },
  {
    id: "project",
    label: "THE PROJECT",
    questions: [
      {
        id: "organization",
        label: "Where do you work?",
        hint: "",
        type: "text",
        required: true,
      },
      {
        id: "what_you_do",
        label: "In your own words, how do you describe what you do when you're talking to others in your industry? What about to your audience?",
        hint: "(Don't polish it. A messy brain dump is perfect.)",
        type: "textarea",
        required: true,
      },
      {
        id: "site_problem",
        label: "What's your current website getting wrong?",
        hint: "Where does it lose people, undersell you, or leave you explaining in the meeting what the site should have said on its own?",
        type: "textarea",
        required: true,
      },
      {
        id: "where_headed",
        label: "Where are you headed next, and what does the website need to help make happen?",
        hint: "Think about the next year: a launch, a new offer, a new audience, a fundraise, a bigger market. The site should tell that story, not the one you've outgrown.",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "audience",
    label: "YOUR AUDIENCE",
    questions: [
      {
        id: "primary_audience",
        label: "Who's your main audience right now? Who actually hires you, buys from you, or funds you?",
        hint: "Describe them like real people: what are they hoping to feel, fix, escape, learn, or become when they come to you?",
        type: "textarea",
        required: true,
      },
      {
        id: "why_they_choose_you",
        label: "When someone decides to hire you, what's usually happening?",
        hint: "What do they say they're paying for when they choose you?",
        type: "textarea",
        required: true,
      },
      {
        id: "biggest_objection",
        label: "What's the biggest hesitation you hear before someone commits?",
        hint: "(Price, uncertainty, time, fear of judgment, not clear on what they get, etc.)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "positioning",
    label: "COMPETITION & POSITIONING",
    questions: [
      {
        id: "competitors",
        label: "Who else does what you do?",
        hint: "List 2 to 5 organizations or brands in your space (names, links). Don't overthink it.",
        type: "textarea",
        required: false,
      },
      {
        id: "what_makes_you_different",
        label: "What makes you the right choice over them?",
        hint: "One clear sentence. Not future-you, who you actually are right now.",
        type: "textarea",
        required: true,
      },
      {
        id: "proof_points",
        label: "What info do you have to back up that answer?",
        hint: "Give 2 to 3 specifics the copy can stand on: results, numbers, a track record, press, awards, clients you're allowed to name. Tell me if any of it can't be said publicly.",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "pages",
    label: "THE PAGES",
    questions: [
      {
        id: "pages",
        label: "Which pages are we writing, and what does each one have to do?",
        hint: "Up to three (or comparable written materials, if that's what we agreed). For each one, name it and tell me its job: what should a visitor understand or do by the end of it?",
        type: "textarea",
        required: true,
      },
      {
        id: "design_build",
        label: "Who's designing and building the site?",
        hint: "Names and how to reach them, where they are (not started, wireframes, design underway, built and waiting on words) and the platform, if you know it.",
        type: "textarea",
        required: true,
      },
      {
        id: "links",
        label: "Send me the links.",
        hint: "Your current website, pitch decks, one-pagers, past copy, anything you've already written about the work. Google Drive or Dropbox links are fine.",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "voice",
    label: "YOUR VOICE",
    questions: [
      {
        id: "brand_words",
        label: "If someone had to describe your brand in just 4-6 words, what would you want those words to be?",
        hint: "",
        type: "textarea",
        required: true,
      },
      {
        id: "sounds_like",
        label: "What are 3 references you want this to sound like?",
        hint: "(Ex: brands, websites, writers, publications, anything with a voice you admire.)\n\nFor each one, tell me what you're borrowing (tone, confidence, warmth, pacing, edge, etc.).",
        type: "textarea",
        required: false,
      },
      {
        id: "avoid",
        label: "What are 3 things you absolutely don't want to sound like?",
        hint: "(Industry clichés, jargon, buzzwords, overblown claims, anything that makes you cringe.)",
        type: "textarea",
        required: true,
      },
      {
        id: "platform_restrictions",
        label: "Are there any rules we have to build around? Anything you can't say or show publicly?",
        hint: "(Platform restrictions, privacy, legal boundaries, or personal limits)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "going",
    label: "WHERE WE'RE GOING",
    questions: [
      {
        id: "if_this_works",
        label: "If this works, what does it unlock for you over the next 12 months?",
        hint: "(Clients, funding, partnerships, hires, fewer meetings spent explaining yourself, etc.)",
        type: "textarea",
        required: true,
      },
      {
        id: "anything_else",
        label: "Anything else I should know?",
        hint: "(Any weird context, sensitivities, \"sacred cows,\" things you've already tried, hard constraints, or instincts you want me to respect (or push back on)?)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "submit",
    type: "submit",
    title: "That's everything.",
    subtitle: "I'll review this before our kickoff call. Expect me to push back on a few things (that's the job).",
  },
];

export const BRIEFS = {
  creative: {
    id: "creative",
    pill: "New Project Questionnaire",
    sections: CREATIVE_SECTIONS,
    // Shown on the submit screen when the link has no ?client= page.
    showFallbackNote: true,
    received: {
      pill: "All set",
      title: "Your story's in good hands.",
      body: "I'll look at your answers and reach out to set up next steps. I can't wait to dive in to your project.",
      signoff: "— Patrick",
    },
    title: () => "Submitted Creative Brief",
    notifyText: "New submitted creative brief is ready for review.",
  },
  sprint: {
    id: "sprint",
    pill: "Sprint Brief",
    sections: SPRINT_SECTIONS,
    // The deposit-paid email link carries no client page, so skip the note.
    showFallbackNote: false,
    received: {
      pill: "Brief received",
      title: "Your story's in good hands.",
      body: "Thanks for answering! It can feel like a lot. We'll review everything before our call and come with questions.",
    },
    title: (answers) => {
      const organization = answers.organization?.trim().slice(0, 120);
      return organization ? `Sprint Brief · ${organization}` : "Sprint Brief";
    },
    notifyText: "New Sprint brief is ready for review.",
  },
};

export const DEFAULT_BRIEF_ID = "creative";

export function getBrief(packageId) {
  const id = typeof packageId === "string" ? packageId.trim().toLowerCase() : "";
  return Object.hasOwn(BRIEFS, id) ? BRIEFS[id] : BRIEFS[DEFAULT_BRIEF_ID];
}
