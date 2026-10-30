import React, { useEffect, useState } from "react";
import { EMPTY_AI_SETTINGS, loadAISettings, saveAISettings } from "../ai/settingsStorage";

// Enter in these fields must not submit the surrounding <form> in builder.jsx.
const stopEnter = (e) => {
  if (e.key === "Enter") e.preventDefault();
};

// Fill the model field with the preset default the first time a provider is selected.
function withModelDefault(settings, providers) {
  const preset = providers.find((p) => p.id === settings.provider);
  if (!preset || settings.models[settings.provider] !== undefined) return settings;
  return {
    ...settings,
    models: { ...settings.models, [settings.provider]: preset.defaultModel || "" },
  };
}

const Row = ({ id, label, children }) => (
  <div className="flex flex-wrap items-center gap-2">
    <label htmlFor={id} className="w-24 text-sm text-white">
      {label}
    </label>
    {children}
  </div>
);

const AISettings = () => {
  const [providers, setProviders] = useState([]);
  const [settings, setSettings] = useState(EMPTY_AI_SETTINGS);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai-config")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data.providers) ? data.providers : [];
        const stored = loadAISettings();
        const usable = (id) => list.some((p) => p.id === id && p.configured);
        const firstUsable = list.find((p) => p.configured);
        const provider = usable(stored.provider) ? stored.provider : firstUsable ? firstUsable.id : "";
        const next = withModelDefault({ ...stored, provider }, list);
        saveAISettings(next);
        setProviders(list);
        setSettings(next);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (patch) => {
    const next = withModelDefault({ ...settings, ...patch }, providers);
    saveAISettings(next);
    setSettings(next);
  };

  const current = providers.find((p) => p.id === settings.provider) || null;
  const model = typeof settings.models[settings.provider] === "string" ? settings.models[settings.provider] : "";
  const anyKey = providers.some((p) => p.keyRequired && p.configured);

  let hint = "The choice is stored in this browser, not in the resume JSON.";
  if (status === "loading") hint = "Checking configured providers…";
  else if (status === "error") hint = "Could not load /api/ai-config. Is the dev server running?";
  else if (!anyKey) hint = "No API key found in .env.local: cloud providers are disabled (see README). Local Ollama / LM Studio work without a key.";
  else if (current && !current.defaultModel && !model) hint = `Enter the model name for ${current.label}.`;

  return (
    <div className="flex-col-gap-2 mb-2">
      <h2 className="input-title">AI assistant</h2>
      <Row id="ai-provider" label="Provider">
        <select
          id="ai-provider"
          value={settings.provider}
          onChange={(e) => update({ provider: e.target.value })}
          disabled={status !== "ready"}
          className="other-input mb-0 min-w-[12rem] flex-1"
        >
          {!settings.provider && <option value="">Select provider</option>}
          {providers.map((p) => (
            <option key={p.id} value={p.id} disabled={!p.configured}>
              {p.label}
              {p.configured ? "" : ` (no key: set ${p.keyEnv})`}
            </option>
          ))}
        </select>
      </Row>
      <Row id="ai-model" label="Model">
        <input
          id="ai-model"
          type="text"
          value={model}
          placeholder={current && current.defaultModel ? current.defaultModel : "model name"}
          onChange={(e) => update({ models: { ...settings.models, [settings.provider]: e.target.value } })}
          onKeyDown={stopEnter}
          disabled={status !== "ready" || !settings.provider}
          spellCheck={false}
          className="other-input mb-0 min-w-[12rem] flex-1"
        />
      </Row>
      {current && current.needsBaseUrl && (
        <Row id="ai-base-url" label="Base URL">
          <input
            id="ai-base-url"
            type="text"
            value={settings.customBaseUrl}
            placeholder="http://localhost:8080/v1"
            onChange={(e) => update({ customBaseUrl: e.target.value })}
            onKeyDown={stopEnter}
            spellCheck={false}
            className="other-input mb-0 min-w-[12rem] flex-1"
          />
        </Row>
      )}
      <p className="text-xs text-zinc-300">{hint}</p>
    </div>
  );
};

export default AISettings;
