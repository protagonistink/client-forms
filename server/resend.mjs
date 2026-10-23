function getResendApiKey(env) {
  return env.RESEND_API_KEY || "";
}

export function hasResendApiKey(env) {
  return Boolean(getResendApiKey(env));
}

// Answers come straight from the form, so escape them before they go into HTML.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml({ answers, brief, notionPageUrl }) {
  const title = escapeHtml(brief.title(answers));
  const sectionBlocks = brief.sections.filter(
    (s) => s.type !== "welcome" && s.type !== "submit"
  )
    .map((section) => {
      const questionRows = section.questions
        .map((question) => {
          const answer = answers[question.id]?.trim() || "(not answered)";
          const isBlank = !answers[question.id]?.trim();
          return `
          <div style="margin-bottom:20px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:0.05em;">
              ${escapeHtml(question.label)}
            </p>
            ${
              question.hint
                ? `<p style="margin:0 0 6px;font-size:12px;color:#888;white-space:pre-wrap;">${escapeHtml(question.hint)}</p>`
                : ""
            }
            <p style="margin:0;font-size:15px;color:${isBlank ? "#aaa" : "#2d2d2d"};white-space:pre-wrap;line-height:1.6;">
              ${escapeHtml(answer)}
            </p>
          </div>`;
        })
        .join("");

      return `
        <div style="margin-bottom:32px;">
          <h2 style="margin:0 0 16px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #e5e5e5;padding-bottom:8px;">
            ${escapeHtml(section.label)}
          </h2>
          ${questionRows}
        </div>`;
    })
    .join("");

  const notionLink = notionPageUrl
    ? `<p style="margin:12px 0 0;font-size:14px;"><a href="${escapeHtml(notionPageUrl)}" style="color:#fff;">Open in Notion →</a></p>`
    : `<p style="margin:12px 0 0;font-size:14px;color:#e08a80;">Not saved to Notion. This email is the only copy.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#1a1a1a;padding:32px 40px;">
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">${title}</h1>
      <p style="margin:6px 0 0;font-size:14px;color:#999;">Received ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      ${notionLink}
    </div>
    <div style="padding:40px;">
      ${sectionBlocks}
    </div>
    <div style="padding:24px 40px;background:#fafafa;border-top:1px solid #e5e5e5;">
      <p style="margin:0;font-size:12px;color:#aaa;">Sent via Protagonist Ink Creative Brief form</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBriefEmail({ answers, brief, env, notionPageUrl }) {
  const html = buildEmailHtml({ answers, brief, notionPageUrl });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getResendApiKey(env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Protagonist Ink <hello@pkthewriter.com>",
      to: ["patrick@protagonist.ink"],
      subject: brief.title(answers),
      html,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Resend request failed.");
  }

  return payload.id;
}
