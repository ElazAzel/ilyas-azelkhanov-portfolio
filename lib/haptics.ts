// Haptic feedback on phones.
// Android: Vibration API. iOS Safari has no Vibration API; since iOS 18 toggling a native
// <input type="checkbox" switch> produces a system haptic, so we click a hidden one.
// It is a non-standard side effect: if a future iOS removes it, nothing breaks, the tap is just silent.

type Kind = "light" | "medium" | "success";

const PATTERN: Record<Kind, number | number[]> = { light: 8, medium: 16, success: [10, 40, 14] };
let iosLabel: HTMLLabelElement | null = null;

function iosSwitch(): HTMLLabelElement | null {
  if (iosLabel) return iosLabel;
  if (typeof document === "undefined") return null;
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.tabIndex = -1;
  label.setAttribute("aria-hidden", "true");
  label.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;clip-path:inset(50%)";
  label.appendChild(input);
  document.body.appendChild(label);
  iosLabel = label;
  return label;
}

export function haptic(kind: Kind = "light") {
  if (typeof navigator === "undefined") return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
    navigator.vibrate(PATTERN[kind]);
    return;
  }
  if (!matchMedia("(pointer: coarse)").matches) return;
  const label = iosSwitch();
  label?.click();
  if (kind === "success") window.setTimeout(() => label?.click(), 60);
}
