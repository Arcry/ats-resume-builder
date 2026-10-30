// Provider/model choice for AI suggestions. Lives in localStorage (per browser),
// never inside the resume JSON that Save Data writes to disk.
const STORAGE_KEY = "aiSettings";

export const EMPTY_AI_SETTINGS = { provider: "", models: {}, customBaseUrl: "" };

export function loadAISettings() {
  if (typeof window === "undefined") return EMPTY_AI_SETTINGS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      provider: typeof parsed.provider === "string" ? parsed.provider : "",
      models:
        parsed.models && typeof parsed.models === "object" && !Array.isArray(parsed.models)
          ? parsed.models
          : {},
      customBaseUrl: typeof parsed.customBaseUrl === "string" ? parsed.customBaseUrl : "",
    };
  } catch (error) {
    return EMPTY_AI_SETTINGS;
  }
}

export function saveAISettings(settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// Fields sent with every /api/suggestions request. Base URL is only meaningful for "custom";
// the server ignores it for every other preset.
export function toRequestFields(settings) {
  const model = settings.models[settings.provider];
  return {
    provider: settings.provider,
    model: typeof model === "string" ? model : "",
    baseUrl: settings.provider === "custom" ? settings.customBaseUrl : "",
  };
}
