import { describeProviders } from "../../utils/ai/providers";

// Which presets exist and which keys are set. Names and booleans only, never key values.
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED", message: "Only GET requests are accepted" });
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ providers: describeProviders() });
}
