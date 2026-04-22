const PREVIEW_KEY = "nourish-preview-mode";

export function isPreviewModeEnabled() {
  const stored = localStorage.getItem(PREVIEW_KEY);
  if (stored === null) {
    localStorage.setItem(PREVIEW_KEY, "true");
    return true;
  }

  return stored === "true";
}

export function setPreviewMode(enabled: boolean) {
  localStorage.setItem(PREVIEW_KEY, String(enabled));
}
