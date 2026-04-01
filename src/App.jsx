import { useState, useEffect } from "react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const INK = "#2C2C2C";
const RUST = "#C83C2F";
const WARM_WHITE = "#FAFAFA";
const COOL_GRAY = "#9C9EA2";

// ─── Notion config ────────────────────────────────────────────────────────────
// Token comes from the environment. Client page ID comes from the URL: ?client=PAGE_ID
const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN;
const NOTION_VERSION = "2022-06-28";

function getClientPageId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("client") || null;
}

// ─── Questions ────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "intro",
    type: "welcome",
    title: "Let's build your brief.",
    subtitle:
      "This isn't a CV or a polished pitch — it's raw material for your story. Answer in your real voice, without trying to sound \u201cofficial.\u201d",
    cta: "Let's go",
  },
  {
    id: "project",
    label: "THE PROJECT",
    questions: [
      {
        id: "what_you_do",
        label: "In your own words, how do you describe what you do when you\u2019re talking to peers or your audience?",
        hint: "Don\u2019t polish it. A messy brain dump is perfect.",
        type: "textarea",
        required: true,
      },
      {
        id: "why_now",
        label: "What\u2019s not working about the current version of your brand?",
        hint: "What triggered the need to evolve it?",
        type: "textarea",
        required: true,
      },
      {
        id: "platforms",
        label: "Where do you mostly show up and do business right now?",
        hint: "List the main places: platforms, websites, communities, collaborations, and any IRL spaces or events.",
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
        label: "Who\u2019s your main audience right now?",
        hint: "Think of the kind of person who follows you closely or actually buys from you. Describe them like real people: what are they hoping to feel, fix, escape, learn, or become when they come to you?",
        type: "textarea",
        required: true,
      },
      {
        id: "why_they_choose_you",
        label: "When someone decides to pay you, what\u2019s usually happening?",
        hint: "What do they say they\u2019re paying for when they choose you?",
        type: "textarea",
        required: true,
      },
      {
        id: "biggest_objection",
        label: "What\u2019s the biggest hesitation you hear before someone commits?",
        hint: "If you had to name the most common \u201calmost, but\u2026\u201d reason \u2014 price, uncertainty, time, fear of judgment, not clear on what they get \u2014 what is it?",
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
        hint: "List 2 to 5 creators or brands in your space \u2014 names, handles, links. Don\u2019t overthink it.",
        type: "textarea",
        required: false,
      },
      {
        id: "what_makes_you_different",
        label: "What makes you the right choice over them?",
        hint: "One clear sentence. Not future-you \u2014 who you actually are right now.",
        type: "textarea",
        required: true,
      },
      {
        id: "proof_points",
        label: "Back it up.",
        hint: "Give 2 to 3 specifics: a skill you own, a track record, a niche audience you already have, something you do that others don\u2019t or won\u2019t.",
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
        label: "What feels confusing or \u201coff\u201d about your brand right now?",
        hint: "Where do you notice inconsistency? Visuals, voice, content, offers, the audience you\u2019re attracting, or the opportunities you\u2019re getting? And if this project goes well, what problem does it solve for you?",
        type: "textarea",
        required: true,
      },
      {
        id: "brand_words",
        label: "If someone had to describe your brand in just 4\u20136 words, what would you want those words to be?",
        hint: "",
        type: "textarea",
        required: true,
      },
      {
        id: "feels_like",
        label: "What are 3 references you want this to feel like?",
        hint: "Brands, creators, films, photographers, fashion, hotels \u2014 anything. For each one, tell me what you\u2019re borrowing: mood, pacing, color, tone, confidence, elegance, intimacy, edge.",
        type: "textarea",
        required: true,
      },
      {
        id: "avoid",
        label: "What are 3 things you absolutely don\u2019t want to be associated with anymore?",
        hint: "Clich\u00e9s in your space, certain aesthetics, certain language, content angles \u2014 anything that makes you cringe.",
        type: "textarea",
        required: true,
      },
      {
        id: "core_identity",
        label: "What\u2019s the core of you that can\u2019t change no matter how the brand evolves?",
        hint: "Values, tone, the kind of experience you create, what you stand for, what you\u2019ll never compromise.",
        type: "textarea",
        required: false,
      },
      {
        id: "platform_restrictions",
        label: "Are there any rules we have to design around?",
        hint: "Anything you can\u2019t say or show publicly \u2014 platform restrictions, privacy, legal boundaries, or personal limits.",
        type: "textarea",
        required: false,
      },
      {
        id: "existing_assets",
        label: "What should I look at before I start?",
        hint: "Share any existing assets: photos, logos, old bios, past brand decks, color preferences, favorite posts, links to accounts, or anything that represents you at your best.",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "deliverables",
    label: "WHAT WE\u2019RE BUILDING & WHERE WE\u2019RE GOING",
    questions: [
      {
        id: "deliverables",
        label: "What are we making together, exactly?",
        hint: "List the deliverables you want at the end of this project. Be as specific as you can. (Ex: a new positioning statement, an updated bio, content pillars, a website, a brand voice guide, etc.)",
        type: "textarea",
        required: true,
      },
      {
        id: "if_this_works",
        label: "If this works, what does it unlock for you over the next 12 months?",
        hint: "Income, audience, opportunities, lifestyle, privacy \u2014 whatever matters most to you.",
        type: "textarea",
        required: true,
      },
      {
        id: "anything_else",
        label: "Anything else I should know that might affect the strategy?",
        hint: "Weird context, sensitivities, sacred cows, things you\u2019ve already tried, hard constraints, or instincts you want me to respect \u2014 or push back on.",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "submit",
    type: "submit",
    title: "That\u2019s everything.",
    subtitle: "I\u2019ll review this and we\u2019ll talk. Expect me to push back on a few things \u2014 that\u2019s the job.",
  },
];

// ─── Build flat step list ──────────────────────────────────────────────────────
function buildSteps(sections) {
  const steps = [];
  sections.forEach((section) => {
    if (section.type === "welcome" || section.type === "submit") {
      steps.push({ type: section.type, section });
    } else {
      section.questions.forEach((q, qi) => {
        steps.push({ type: "question", section, question: q, isFirst: qi === 0 });
      });
    }
  });
  return steps;
}

const STEPS = buildSteps(SECTIONS);
const TOTAL_QUESTIONS = STEPS.filter((s) => s.type === "question").length;

// ─── Notion submit ─────────────────────────────────────────────────────────────
async function submitToNotion(answers, clientPageId) {
  if (!NOTION_TOKEN) {
    throw new Error("Missing VITE_NOTION_TOKEN. Add it to your local .env file before submitting.");
  }

  // 1. Create a new "Creative Brief" page inside the client's project page
  const createRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { page_id: clientPageId },
      icon: { type: "emoji", emoji: "🎭" },
      properties: {
        title: [{ type: "text", text: { content: "Creative Brief" } }],
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.message || "Failed to create brief page");
  }

  const newPage = await createRes.json();
  const briefPageId = newPage.id;

  // 2. Build content blocks from answers
  const blocks = [];

  SECTIONS.forEach((section) => {
    if (section.type === "welcome" || section.type === "submit") return;

    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: section.label } }],
        color: "gray",
      },
    });

    section.questions.forEach((q) => {
      const answer = answers[q.id]?.trim();

      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: q.label + "\n" },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: { content: answer || "(not answered)" },
              annotations: { color: answer ? "default" : "gray" },
            },
          ],
        },
      });
    });

    blocks.push({ object: "block", type: "divider", divider: {} });
  });

  // 3. Append blocks to the new brief page (max 100 at a time)
  const chunkSize = 100;
  for (let i = 0; i < blocks.length; i += chunkSize) {
    const chunk = blocks.slice(i, i + chunkSize);
    const appendRes = await fetch(
      `https://api.notion.com/v1/blocks/${briefPageId}/children`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": NOTION_VERSION,
        },
        body: JSON.stringify({ children: chunk }),
      }
    );
    if (!appendRes.ok) {
      const err = await appendRes.json();
      throw new Error(err.message || "Failed to write brief content");
    }
  }

  return briefPageId;
}

// ─── Components ───────────────────────────────────────────────────────────────
function ProgressBar({ answered, total }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <div style={{ width: "100%", height: 2, background: `${INK}15` }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: RUST,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function SectionPill({ label }) {
  return (
    <div style={{
      display: "inline-block",
      fontFamily: "'Satoshi', system-ui, sans-serif",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.12em",
      color: RUST,
      textTransform: "uppercase",
      marginBottom: 20,
    }}>
      {label}
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", disabled = false }) {
  const base = {
    fontFamily: "'Satoshi', system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "13px 28px",
    transition: "all 0.2s",
    opacity: disabled ? 0.4 : 1,
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={
        variant === "primary"
          ? { ...base, background: RUST, color: WARM_WHITE }
          : { ...base, background: "transparent", color: INK, border: `1px solid ${INK}30` }
      }
    >
      {children}
    </button>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const clientPageId = getClientPageId();
  const current = STEPS[step];
  const answeredCount = STEPS.filter(
    (s) => s.type === "question" && answers[s.question?.id]?.trim()
  ).length;

  // Inject fonts
  useEffect(() => {
    const links = [
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap",
      "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap",
    ];
    links.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  function transition(newStep, dir) {
    setDirection(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(newStep);
      setVisible(true);
    }, 200);
  }

  function next() {
    if (step < STEPS.length - 1) transition(step + 1, 1);
  }

  function prev() {
    if (step > 0) transition(step - 1, -1);
  }

  function canAdvance() {
    if (current.type !== "question") return true;
    if (!current.question.required) return true;
    return !!answers[current.question.id]?.trim();
  }

  async function handleSubmit() {
    if (!clientPageId) {
      setError("No client page ID found in the URL. Make sure you're using the right link.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitToNotion(answers, clientPageId);
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const slide = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateY(0)"
      : direction > 0 ? "translateY(16px)" : "translateY(-16px)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  };

  if (submitted) {
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={slide}>
            <div style={pill}>Brief received</div>
            <h1 style={display}>Your story's in good hands.</h1>
            <p style={{ ...body, color: `${INK}70`, marginTop: 16, maxWidth: 420 }}>
              Patrick will review this and be in touch. Expect a real conversation — and probably a few pointed questions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      {/* Header */}
      <div style={header}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 500, color: INK }}>
          Protagonist Ink
        </span>
      </div>

      {/* Progress */}
      <ProgressBar answered={answeredCount} total={TOTAL_QUESTIONS} />

      {/* Card */}
      <div style={card}>
        <div style={slide}>

          {/* Welcome */}
          {current.type === "welcome" && (
            <div>
              <div style={pill}>Creator · Influencer · Adult Entertainer</div>
              <h1 style={display}>{current.section.title}</h1>
              <p style={{ ...body, color: `${INK}70`, marginTop: 16, maxWidth: 480 }}>
                {current.section.subtitle}
              </p>
              <div style={{ marginTop: 40 }}>
                <Btn onClick={next}>{current.section.cta} →</Btn>
              </div>
            </div>
          )}

          {/* Question */}
          {current.type === "question" && (
            <div>
              {current.isFirst && <SectionPill label={current.section.label} />}
              <h2 style={question}>{current.question.label}</h2>
              {current.question.hint && (
                <p style={hint}>{current.question.hint}</p>
              )}
              <div style={{ marginTop: 24 }}>
                <textarea
                  autoFocus
                  value={answers[current.question.id] || ""}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [current.question.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canAdvance()) next();
                  }}
                  rows={4}
                  style={textarea}
                  onFocus={(e) => (e.target.style.borderColor = RUST)}
                  onBlur={(e) => (e.target.style.borderColor = `${INK}20`)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                <Btn onClick={next} disabled={!canAdvance()}>OK →</Btn>
                {!current.question.required && (
                  <span style={{ fontFamily: "'Satoshi', system-ui", fontSize: 11, color: COOL_GRAY }}>
                    or skip
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "'Satoshi', system-ui", fontSize: 11, color: COOL_GRAY, marginTop: 10 }}>
                ⌘ + Enter to continue
              </p>
            </div>
          )}

          {/* Submit */}
          {current.type === "submit" && (
            <div>
              <div style={pill}>{answeredCount} of {TOTAL_QUESTIONS} answered</div>
              <h1 style={display}>{current.section.title}</h1>
              <p style={{ ...body, color: `${INK}70`, marginTop: 16, maxWidth: 480 }}>
                {current.section.subtitle}
              </p>
              {!clientPageId && (
                <p style={{ fontFamily: "'Satoshi', system-ui", fontSize: 13, color: RUST, marginTop: 16 }}>
                  Something's off with your link. Let Patrick know so he can send you a new one.
                </p>
              )}
              {error && (
                <p style={{ fontFamily: "'Satoshi', system-ui", fontSize: 13, color: RUST, marginTop: 16 }}>
                  Error: {error}
                </p>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
                <Btn onClick={handleSubmit} disabled={submitting || !clientPageId}>
                  {submitting ? "Sending..." : "Submit brief →"}
                </Btn>
                <Btn variant="secondary" onClick={prev}>← Review</Btn>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom nav */}
      {current.type === "question" && (
        <div style={nav}>
          <button onClick={prev} style={navBtn}>← Back</button>
          <span style={{ fontFamily: "'Satoshi', system-ui", fontSize: 11, color: `${INK}30` }}>
            {step} / {STEPS.length - 2}
          </span>
          <button
            onClick={next}
            disabled={!canAdvance() && current.question.required}
            style={{ ...navBtn, color: canAdvance() ? INK : `${INK}30` }}
          >
            Skip →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const wrap = {
  minHeight: "100vh",
  background: WARM_WHITE,
  display: "flex",
  flexDirection: "column",
};
const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 32px",
  borderBottom: `1px solid ${INK}08`,
};
const card = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: 640,
  width: "100%",
  margin: "0 auto",
  padding: "48px 32px",
  boxSizing: "border-box",
};
const display = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "clamp(2rem, 5vw, 3.2rem)",
  fontWeight: 500,
  color: INK,
  lineHeight: 1.15,
  margin: 0,
};
const question = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
  fontWeight: 400,
  color: INK,
  lineHeight: 1.3,
  margin: 0,
};
const body = {
  fontFamily: "'Satoshi', system-ui, sans-serif",
  fontSize: 16,
  lineHeight: 1.6,
  color: INK,
  margin: 0,
};
const hint = {
  fontFamily: "'Satoshi', system-ui, sans-serif",
  fontSize: 13,
  color: COOL_GRAY,
  lineHeight: 1.5,
  margin: "8px 0 0",
  fontStyle: "italic",
};
const textarea = {
  width: "100%",
  background: "transparent",
  border: `1.5px solid ${INK}20`,
  borderRadius: 2,
  outline: "none",
  fontFamily: "'Satoshi', system-ui, sans-serif",
  fontSize: 16,
  color: INK,
  padding: "12px 14px",
  resize: "vertical",
  lineHeight: 1.6,
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};
const pill = {
  display: "inline-block",
  fontFamily: "'Satoshi', system-ui, sans-serif",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.12em",
  color: RUST,
  textTransform: "uppercase",
  marginBottom: 20,
};
const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 32px",
  borderTop: `1px solid ${INK}08`,
};
const navBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "'Satoshi', system-ui, sans-serif",
  fontSize: 12,
  color: COOL_GRAY,
  letterSpacing: "0.06em",
};
