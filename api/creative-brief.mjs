import { handleCreativeBriefRequest } from "../server/notion.mjs";

export default async function handler(req, res) {
  return handleCreativeBriefRequest(req, res, process.env);
}
