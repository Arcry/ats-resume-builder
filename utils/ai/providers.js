// Preset table for OpenAI-compatible providers. Server-only: imported by API routes.
// `keyEnv` is the name of a variable in .env.local; key values never leave the server.
// `baseUrl` of cloud and local presets is fixed here on purpose: the client must not be able
// to point a stored key at another host. Only the "custom" preset takes its URL from the client.
export const PROVIDERS = [
  { id: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", keyEnv: "OPENAI_API_KEY", keyRequired: true, defaultModel: "gpt-6-luna" },
  { id: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", keyEnv: "OPENROUTER_API_KEY", keyRequired: true, defaultModel: "openai/gpt-6-luna" },
  { id: "anthropic", label: "Anthropic", baseUrl: "https://api.anthropic.com/v1", keyEnv: "ANTHROPIC_API_KEY", keyRequired: true, defaultModel: "claude-sonnet-5-5" },
  { id: "gemini", label: "Google Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", keyEnv: "GEMINI_API_KEY", keyRequired: true, defaultModel: "gemini-3.7-flash" },
  { id: "groq", label: "Groq", baseUrl: "https://api.groq.com/openai/v1", keyEnv: "GROQ_API_KEY", keyRequired: true, defaultModel: "llama-3.3-70b-versatile" },
  { id: "deepseek", label: "DeepSeek", baseUrl: "https://api.deepseek.com", keyEnv: "DEEPSEEK_API_KEY", keyRequired: true, defaultModel: "deepseek-flash" },
  { id: "mistral", label: "Mistral", baseUrl: "https://api.mistral.ai/v1", keyEnv: "MISTRAL_API_KEY", keyRequired: true, defaultModel: "mistral-small-latest" },
  { id: "ollama", label: "Ollama (local)", baseUrl: "http://localhost:11434/v1", keyEnv: null, keyRequired: false, defaultModel: "" },
  { id: "lmstudio", label: "LM Studio (local)", baseUrl: "http://localhost:1234/v1", keyEnv: null, keyRequired: false, defaultModel: "" },
  { id: "custom", label: "Custom", baseUrl: null, keyEnv: "AI_CUSTOM_API_KEY", keyRequired: false, defaultModel: "" },
];

export function getProvider(id) {
  return PROVIDERS.find((p) => p.id === id) || null;
}

export function isConfigured(provider) {
  return !provider.keyRequired || Boolean(process.env[provider.keyEnv]);
}

// Public view for GET /api/ai-config: variable names and flags only, never values.
export function describeProviders() {
  return PROVIDERS.map((p) => ({
    id: p.id,
    label: p.label,
    defaultModel: p.defaultModel,
    keyEnv: p.keyEnv,
    keyRequired: p.keyRequired,
    needsBaseUrl: p.baseUrl === null,
    configured: isConfigured(p),
  }));
}
