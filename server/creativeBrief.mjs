import { getBrief } from "../shared/briefSchema.mjs";
import { createBriefInNotion, hasNotionToken } from "./notion.mjs";
import { hasResendApiKey, sendBriefEmail } from "./resend.mjs";

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

// The questionnaire goes to Patrick's inbox. Sprint briefs also go to Notion
// and can succeed if either delivery route is available.
export async function handleCreativeBriefRequest(req, res, env) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return json(res, 400, { error: "Invalid request body." });
  }

  const { answers, clientPageId, packageId } = payload;
  if (!answers || typeof answers !== "object") {
    return json(res, 400, { error: "Missing answers payload." });
  }

  const brief = getBrief(packageId);
  const notionEnabled = brief.id === "sprint" && hasNotionToken(env);
  const emailEnabled = hasResendApiKey(env);
  if (!notionEnabled && !emailEnabled) {
    return json(res, 500, { error: "No delivery route is configured on the server." });
  }

  const errors = [];
  let notionPage = null;
  let emailId = null;

  if (notionEnabled) {
    try {
      notionPage = await createBriefInNotion({ answers, brief, clientPageId, env });
    } catch (error) {
      console.error("Failed to save brief to Notion", error);
      errors.push(`Notion: ${error.message}`);
    }
  }

  if (emailEnabled) {
    try {
      emailId = await sendBriefEmail({ answers, brief, env, notionPageUrl: notionPage?.url });
    } catch (error) {
      console.error("Failed to email brief", error);
      errors.push(`Email: ${error.message}`);
    }
  }

  if (!notionPage && !emailId) {
    return json(res, 500, { error: errors.join(" ") || "Failed to send brief." });
  }

  return json(res, 200, { ok: true, pageId: notionPage?.id || null, emailId });
}
