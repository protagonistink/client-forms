import { SECTIONS } from "../shared/briefSchema.mjs";

function getResendApiKey(env) {
  return env.RESEND_API_KEY || "";
}

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function buildEmailHtml(answers) {
  const sectionBlocks = SECTIONS.filter(
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
              ${question.label}
            </p>
            ${
              question.hint
                ? `<p style="margin:0 0 6px;font-size:12px;color:#888;">${question.hint}</p>`
                : ""
            }
            <p style="margin:0;font-size:15px;color:${isBlank ? "#aaa" : "#2d2d2d"};white-space:pre-wrap;line-height:1.6;">
              ${answer}
            </p>
          </div>`;
        })
        .join("");

      return `
        <div style="margin-bottom:32px;">
          <h2 style="margin:0 0 16px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #e5e5e5;padding-bottom:8px;">
            ${section.label}
          </h2>
          ${questionRows}
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#1a1a1a;padding:32px 40px;">
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Submitted Creative Brief</h1>
      <p style="margin:6px 0 0;font-size:14px;color:#999;">Received ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
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

async function sendBriefEmail({ answers, apiKey }) {
  const html = buildEmailHtml(answers);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Protagonist Ink <hello@pkthewriter.com>",
      to: ["patrick@protagonist.ink"],
      subject: "Submitted Creative Brief",
      html,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Resend request failed.");
  }

  return payload.id;
}

export async function handleCreativeBriefRequest(req, res, env) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const apiKey = getResendApiKey(env);
  if (!apiKey) {
    return json(res, 500, { error: "Missing RESEND_API_KEY on the server." });
  }

  try {
    const { answers } = await readJsonBody(req);

    if (!answers || typeof answers !== "object") {
      return json(res, 400, { error: "Missing answers payload." });
    }

    const emailId = await sendBriefEmail({ answers, apiKey });
    return json(res, 200, { ok: true, emailId });
  } catch (error) {
    return json(res, 500, { error: error.message || "Failed to send brief." });
  }
}
