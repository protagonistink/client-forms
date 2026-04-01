import { useState, useEffect } from "react";
import { SECTIONS } from "../shared/briefSchema.mjs";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const INK = "#2C2C2C";
const RUST = "#C83C2F";
const WARM_WHITE = "#FAFAFA";
const COOL_GRAY = "#9C9EA2";

function getClientPageId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("client") || null;
}

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
  const response = await fetch("/api/creative-brief", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answers,
      clientPageId,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to create brief page.");
  }

  return payload.pageId;
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
