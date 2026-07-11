"use client";

// ============================================================
// White-Label Branding store
// Storage key: dgr-academy-branding
// Mirrors the relevant fields from admin settings so that the
// public site can read them on every page load.
// ============================================================

export interface BrandingConfig {
  academyName: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  faviconUrl: string;
}

const KEY = "dgr-academy-branding";

export const DEFAULT_BRANDING: BrandingConfig = {
  academyName: "DGR eLearning",
  logoUrl: "",
  primaryColor: "",
  accentColor: "",
  faviconUrl: "",
};

export function getBranding(): BrandingConfig {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_BRANDING;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BRANDING, ...parsed };
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveBranding(config: BrandingConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent("dgr-branding-updated"));
}

export function subscribeToBranding(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("dgr-branding-updated", handler);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
  });
  return () => {
    window.removeEventListener("dgr-branding-updated", handler);
  };
}

/**
 * Convert a hex color (#abc123) to a space-separated HSL triple,
 * which Tailwind expects for its CSS variables (--primary, etc.).
 * Returns null if the input is not a valid hex color.
 */
export function hexToHslTriple(hex: string): string | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
