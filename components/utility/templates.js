// Single source for template ids/labels and theme presets.
// Ids are stored in resumeData.theme.template inside saved JSON files: do not rename them.
export const TEMPLATES = [
  {
    id: "ats",
    label: "ATS",
    title: "ATS: two columns, static layout, PDF text in reading order",
  },
  {
    id: "template1",
    label: "Classic",
    title: "Classic: two columns, drag-and-drop entries, editable headings",
  },
  {
    id: "template2",
    label: "Single column",
    title: "Single column: static layout, PDF text in reading order",
  },
];

// Empty accent/background = default look (no colour override).
export const DEFAULT_THEME = { template: "ats", accent: "", background: "" };

export const ACCENT_PRESETS = [
  { name: "Default", value: "" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Blue", value: "#1d4ed8" },
  { name: "Teal", value: "#0f766e" },
  { name: "Green", value: "#166534" },
  { name: "Burgundy", value: "#9f1239" },
  { name: "Graphite", value: "#374151" },
];

export const BACKGROUND_PRESETS = [
  { name: "Default", value: "" },
  { name: "Cream", value: "#fffbeb" },
  { name: "Light gray", value: "#f3f4f6" },
  { name: "Light blue", value: "#eff6ff" },
  { name: "Light green", value: "#f0fdf4" },
];

// Merge a (possibly missing or partial) theme from resumeData with defaults.
export const resolveTheme = (theme) => ({ ...DEFAULT_THEME, ...(theme || {}) });
