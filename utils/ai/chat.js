// Minimal OpenAI-compatible chat client: POST <baseUrl>/chat/completions.
// The request deliberately contains only `model` and `messages`:
// - no `temperature` / `top_p`: Anthropic's compatibility endpoint rejects temperature < 1
//   and top_p != 0.99 with HTTP 400 on Claude 4.7+;
// - no `max_tokens`: newer OpenAI models reject it (they want `max_completion_tokens`),
//   and that parameter is not understood by every provider.
// Suggestions are short, so provider defaults are fine.

const TIMEOUT_MS = 120000; // local models can be slow

export class AIError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = "AIError";
    this.code = code;
    this.status = status;
  }
}

function joinUrl(baseUrl, path) {
  return baseUrl.replace(/\/+$/, "") + path;
}

// Never let the key value through, even if a provider echoes it back.
function redact(text, secret) {
  return secret ? text.split(secret).join("[redacted]") : text;
}

// Providers disagree on the error shape: {error:{message}}, {error:"..."},
// [{error:{message}}] (Gemini), {message}.
function providerMessage(body) {
  const first = Array.isArray(body) ? body[0] : body;
  if (!first || typeof first !== "object") return "";
  const err = first.error;
  if (typeof err === "string") return err;
  if (err && typeof err.message === "string") return err.message;
  if (typeof first.message === "string") return first.message;
  return "";
}

export async function chatCompletion({ baseUrl, apiKey, keyEnv, model, prompt }) {
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  let response;
  try {
    response = await fetch(joinUrl(baseUrl, "/chat/completions"), {
      method: "POST",
      headers,
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (error && error.name === "TimeoutError") {
      throw new AIError("TIMEOUT", 504, `No response from ${baseUrl} within ${TIMEOUT_MS / 1000}s`);
    }
    const reason = error && error.message ? error.message : "network error";
    throw new AIError("NETWORK_ERROR", 502, `Could not reach ${baseUrl}: ${redact(reason, apiKey)}`);
  }

  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch (error) {
    body = null;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Do not forward the provider text: some providers echo a masked key fragment.
      const hint = keyEnv ? `: check ${keyEnv} in .env.local` : "";
      throw new AIError("PROVIDER_ERROR", response.status, `Authentication failed (HTTP ${response.status})${hint}`);
    }
    const detail = providerMessage(body) || response.statusText || "";
    throw new AIError(
      "PROVIDER_ERROR",
      response.status,
      `Provider error (HTTP ${response.status})${detail ? `: ${redact(detail, apiKey)}` : ""}`
    );
  }

  const choice = body && Array.isArray(body.choices) ? body.choices[0] : null;
  const content = choice && choice.message ? choice.message.content : null;
  if (typeof content !== "string" || content.trim() === "") {
    throw new AIError("PROVIDER_ERROR", 502, "Empty response from provider");
  }
  return content;
}
