import { getProvider } from "./providers";
import { chatCompletion, AIError } from "./chat";

const MIN_CONTENT_LENGTH = 10;

// Prompt text is unchanged from the previous Gemini implementation.
export function buildSuggestionPrompt(section, currentContent) {
  return `You are a friendly resume writing assistant. Look at this ${section} content and suggest 2 slightly improved versions. 
    Keep the same meaning and information, but make it flow better. Use natural, conversational language - no complex jargon.
    Make it sound like a real person wrote it.

    Important guidelines:
    - Keep the same key points and achievements
    - Use simple, clear language
    - Make it sound natural and conversational
    - Keep a similar length
    - Don't add new information
    
    Current content:
    ${currentContent}

    Format your response as:
    Option 1:
    [first natural improvement]

    Option 2:
    [second natural improvement]`;
}

// Resolves the client's choice against the preset table. The base URL comes from the table
// for every preset except "custom"; the API key always comes from the server environment.
function resolveRequest({ provider: providerId, model, baseUrl }) {
  const provider = getProvider(typeof providerId === "string" ? providerId : "");
  if (!provider) {
    throw new AIError("VALIDATION_ERROR", 400, "Unknown provider: choose one in the AI assistant block");
  }

  const apiKey = provider.keyEnv ? process.env[provider.keyEnv] || "" : "";
  if (provider.keyRequired && !apiKey) {
    throw new AIError("NOT_CONFIGURED", 400, `No API key for ${provider.label}: set ${provider.keyEnv} in .env.local`);
  }

  let resolvedBaseUrl = provider.baseUrl;
  if (resolvedBaseUrl === null) {
    const candidate = typeof baseUrl === "string" ? baseUrl.trim() : "";
    if (!/^https?:\/\//i.test(candidate)) {
      throw new AIError("VALIDATION_ERROR", 400, "Custom provider needs a Base URL starting with http:// or https://");
    }
    resolvedBaseUrl = candidate;
  }

  const resolvedModel = (typeof model === "string" && model.trim()) || provider.defaultModel;
  if (!resolvedModel) {
    throw new AIError("VALIDATION_ERROR", 400, `Model is required for ${provider.label}: enter it in the AI assistant block`);
  }

  return { provider, apiKey, baseUrl: resolvedBaseUrl, model: resolvedModel };
}

export async function getSuggestions({ section, content, provider, model, baseUrl }) {
  if (typeof section !== "string" || section.trim() === "") {
    throw new AIError("VALIDATION_ERROR", 400, "Missing required field: section");
  }
  if (typeof content !== "string" || content.trim() === "") {
    throw new AIError("CONTENT_ERROR", 400, "Please write something first to get suggestions");
  }
  if (content.trim().length < MIN_CONTENT_LENGTH) {
    throw new AIError("CONTENT_ERROR", 400, "Please write at least a few words to get meaningful suggestions");
  }

  const request = resolveRequest({ provider, model, baseUrl });
  const suggestions = await chatCompletion({
    baseUrl: request.baseUrl,
    apiKey: request.apiKey,
    keyEnv: request.provider.keyEnv,
    model: request.model,
    prompt: buildSuggestionPrompt(section, content),
  });
  return { suggestions, provider: request.provider.id, model: request.model };
}
