import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import {
  TEMPLATES,
  DEFAULT_THEME,
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  resolveTheme,
} from "../utility/templates";

// Crossed-out swatch for the "Default" preset (no colour override).
const DEFAULT_SWATCH_STYLE = {
  backgroundColor: "#27272a",
  backgroundImage:
    "linear-gradient(135deg, transparent 46%, #ffffff 46%, #ffffff 54%, transparent 54%)",
};

const ColorRow = ({ label, value, presets, fallback, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="w-24 text-sm text-white">{label}</span>
    {presets.map((preset) => {
      const selected = (preset.value || "") === (value || "");
      return (
        <button
          key={preset.name}
          type="button"
          title={preset.name}
          aria-label={`${label}: ${preset.name}`}
          aria-pressed={selected}
          onClick={() => onChange(preset.value)}
          className={`h-6 w-6 rounded-full border border-white/40 ${
            selected ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
          }`}
          style={preset.value ? { backgroundColor: preset.value } : DEFAULT_SWATCH_STYLE}
        />
      );
    })}
    {/* Native picker needs a valid #rrggbb value, hence the fallback for "default". */}
    <input
      type="color"
      title="Custom"
      aria-label={`${label}: custom`}
      value={value || fallback}
      onChange={(e) => onChange(e.target.value)}
      className="h-6 w-8 cursor-pointer rounded border border-white/40 bg-transparent"
    />
  </div>
);

const Appearance = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const theme = resolveTheme(resumeData.theme);

  const setTheme = (patch) =>
    setResumeData((prev) => ({
      ...prev,
      theme: { ...DEFAULT_THEME, ...(prev.theme || {}), ...patch },
    }));

  return (
    <div className="flex-col-gap-2 mb-2">
      <h2 className="input-title">Template & colours</h2>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((template) => {
          const active = theme.template === template.id;
          return (
            <button
              key={template.id}
              type="button"
              title={template.title}
              aria-pressed={active}
              onClick={() => setTheme({ template: template.id })}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                active
                  ? "bg-white font-semibold text-zinc-900"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {template.label}
            </button>
          );
        })}
      </div>
      <ColorRow
        label="Accent"
        value={theme.accent}
        presets={ACCENT_PRESETS}
        fallback="#000000"
        onChange={(accent) => setTheme({ accent })}
      />
      <ColorRow
        label="Background"
        value={theme.background}
        presets={BACKGROUND_PRESETS}
        fallback="#ffffff"
        onChange={(background) => setTheme({ background })}
      />
    </div>
  );
};

export default Appearance;
