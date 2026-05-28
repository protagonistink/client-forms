import { handleCreativeBriefRequest } from "../server/resend.mjs";

export default async function handler(req, res) {
  return handleCreativeBriefRequest(req, res, process.env);
}
