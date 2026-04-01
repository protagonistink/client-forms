import { SECTIONS } from "../shared/briefSchema.mjs";

const NOTION_VERSION = "2022-06-28";
const DEFAULT_FALLBACK_PARENT_PAGE_ID = "47b924a37f5b4d629ee0e0cca8330e67";

function getNotionToken(env) {
  return env.NOTION_TOKEN || env.VITE_NOTION_TOKEN || "";
}

function getFallbackParentPageId(env) {
  return env.NOTION_FALLBACK_PARENT_PAGE_ID || DEFAULT_FALLBACK_PARENT_PAGE_ID;
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

function buildBlocks(answers) {
  const blocks = [];

  SECTIONS.forEach((section) => {
    if (section.type === "welcome" || section.type === "submit") {
      return;
    }

    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: section.label } }],
        color: "gray",
      },
    });

    section.questions.forEach((question) => {
      const answer = answers[question.id]?.trim();

      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `${question.label}\n` },
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

  return blocks;
}

async function notionRequest(path, token, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Notion request failed.");
  }

  return payload;
}

async function createBriefInNotion({ answers, clientPageId, fallbackParentPageId, token }) {
  const parentPageId = clientPageId || fallbackParentPageId;

  const createdPage = await notionRequest("/pages", token, {
    method: "POST",
    body: JSON.stringify({
      parent: { page_id: parentPageId },
      icon: { type: "emoji", emoji: "🎭" },
      properties: {
        title: {
          title: [{ type: "text", text: { content: "Creative Brief" } }],
        },
      },
    }),
  });

  const blocks = buildBlocks(answers);

  for (let index = 0; index < blocks.length; index += 100) {
    await notionRequest(`/blocks/${createdPage.id}/children`, token, {
      method: "PATCH",
      body: JSON.stringify({ children: blocks.slice(index, index + 100) }),
    });
  }

  return createdPage.id;
}

export async function handleCreativeBriefRequest(req, res, env) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const token = getNotionToken(env);
  if (!token) {
    return json(res, 500, { error: "Missing NOTION_TOKEN on the server." });
  }

  const fallbackParentPageId = getFallbackParentPageId(env);

  try {
    const { answers, clientPageId } = await readJsonBody(req);

    if (!answers || typeof answers !== "object") {
      return json(res, 400, { error: "Missing answers payload." });
    }

    const pageId = await createBriefInNotion({
      answers,
      clientPageId,
      fallbackParentPageId,
      token,
    });
    return json(res, 200, { ok: true, pageId });
  } catch (error) {
    return json(res, 500, { error: error.message || "Failed to create brief." });
  }
}
