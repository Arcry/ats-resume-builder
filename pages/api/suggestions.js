import { getSuggestions } from "../../utils/ai/suggestions";
import { AIError } from "../../utils/ai/chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED", message: "Only POST requests are accepted" });
  }

  const { section, content, provider, model, baseUrl } = req.body || {};

  try {
    const result = await getSuggestions({ section, content, provider, model, baseUrl });
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIError) {
      // Code and status only: provider messages are not logged.
      console.error(`AI suggestions failed: ${error.code} (HTTP ${error.status})`);
      return res.status(error.status).json({ error: error.code, message: error.message });
    }
    console.error("AI suggestions failed:", error && error.name ? error.name : "unknown error");
    return res.status(500).json({ error: "UNKNOWN_ERROR", message: "An unexpected error occurred. Please try again." });
  }
}
