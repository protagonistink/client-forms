const NOTION_VERSION = "2022-06-28";
const DEFAULT_FALLBACK_PARENT_PAGE_ID = "402bc8907b7481d292d7e7a2eb8da372"; // Client Work › Client Sprint Creative Briefs
const DEFAULT_NOTIFY_USER_ID = "1a0d872b-594c-81de-acdb-000258c062fd";

function getNotionToken(env) {
  return env.NOTION_TOKEN || env.VITE_NOTION_TOKEN || "";
}

function getFallbackParentPageId(env) {
  return env.NOTION_FALLBACK_PARENT_PAGE_ID || DEFAULT_FALLBACK_PARENT_PAGE_ID;
}

function getNotifyUserId(env) {
  return env.NOTION_NOTIFY_USER_ID || DEFAULT_NOTIFY_USER_ID;
}

function buildBlocks(sections, answers) {
  const blocks = [];

  sections.forEach((section) => {
    if (section.type === "welcome" || section.type === "submit") {
      return;
    }

    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: section.label } }],
        color: "default",
      },
    });

    section.questions.forEach((question) => {
      const answer = answers[question.id]?.trim();

      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: question.label } }],
          color: "blue",
        },
      });

      if (question.hint) {
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: question.hint },
                annotations: { color: "gray" },
              },
            ],
          },
        });
      }

      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
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

async function createSubmissionNotification({ createdPageId, notifyText, notifyUserId, parentPageId, token }) {
  if (!notifyUserId) {
    return;
  }

  await notionRequest("/comments", token, {
    method: "POST",
    body: JSON.stringify({
      parent: { page_id: parentPageId },
      rich_text: [
        {
          type: "mention",
          mention: {
            type: "user",
            user: { id: notifyUserId },
          },
        },
        {
          type: "text",
          text: { content: ` ${notifyText}` },
        },
        {
          type: "mention",
          mention: {
            type: "page",
            page: { id: createdPageId },
          },
        },
      ],
    }),
  });
}

export function hasNotionToken(env) {
  return Boolean(getNotionToken(env));
}

// Creates the brief page under the client page (or the fallback parent) and
// @mentions Patrick on the parent. Returns { id, url }.
export async function createBriefInNotion({ answers, brief, clientPageId, env }) {
  const token = getNotionToken(env);
  const notifyUserId = getNotifyUserId(env);
  const parentPageId = clientPageId || getFallbackParentPageId(env);

  const createdPage = await notionRequest("/pages", token, {
    method: "POST",
    body: JSON.stringify({
      parent: { page_id: parentPageId },
      icon: { type: "emoji", emoji: "🎭" },
      properties: {
        title: {
          title: [{ type: "text", text: { content: brief.title(answers) } }],
        },
      },
    }),
  });

  const blocks = buildBlocks(brief.sections, answers);

  for (let index = 0; index < blocks.length; index += 100) {
    await notionRequest(`/blocks/${createdPage.id}/children`, token, {
      method: "PATCH",
      body: JSON.stringify({ children: blocks.slice(index, index + 100) }),
    });
  }

  try {
    await createSubmissionNotification({
      createdPageId: createdPage.id,
      notifyText: brief.notifyText,
      notifyUserId,
      parentPageId,
      token,
    });
  } catch (error) {
    console.error("Failed to create Notion submission notification", error);
  }

  return { id: createdPage.id, url: createdPage.url };
}
