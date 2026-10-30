// Validate the project's actual token contract without a separate schema runtime.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const design = readFileSync(
  new URL("../DESIGN.md", import.meta.url),
  "utf8",
).replaceAll("\r\n", "\n");
const front = design.match(/^---\n([\s\S]*?)\n---/);
assert(front, "DESIGN.md must contain YAML front matter");
const tokens = parse(front[1]);
for (const group of [
  "colors",
  "typography",
  "rounded",
  "spacing",
  "components",
]) {
  assert(
    tokens[group] && typeof tokens[group] === "object",
    `Missing ${group}`,
  );
}
for (const [name, value] of Object.entries(tokens.colors)) {
  assert(/^#[\da-f]{6}$/i.test(value), `Invalid color: ${name}`);
}
for (const [name, style] of Object.entries(tokens.typography)) {
  assert(
    typeof style.fontFamily === "string" && style.fontFamily.length,
    `Missing font: ${name}`,
  );
  assert(
    /^\d+(\.\d+)?(px|rem)$/.test(style.fontSize),
    `Invalid font size: ${name}`,
  );
  assert(
    style.fontWeight >= 100 && style.fontWeight <= 1000,
    `Invalid weight: ${name}`,
  );
  assert(Number(style.lineHeight) > 0, `Invalid line height: ${name}`);
}
for (const group of ["rounded", "spacing"]) {
  for (const [name, value] of Object.entries(tokens[group])) {
    assert(/^\d+(\.\d+)?(px|rem)$/.test(value), `Invalid ${group}: ${name}`);
  }
}
function resolve(value) {
  if (typeof value !== "string") return value;
  const reference = value.match(/^\{([^}]+)\}$/);
  if (!reference) return value;
  const result = reference[1]
    .split(".")
    .reduce((node, key) => node?.[key], tokens);
  assert(result !== undefined, `Unknown design token: ${value}`);
  return result;
}
const luminance = (hex) => {
  const rgb = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
let pairs = 0;
for (const [name, component] of Object.entries(tokens.components)) {
  for (const value of Object.values(component)) resolve(value);
  if (!component.backgroundColor || !component.textColor) continue;
  const fg = luminance(resolve(component.textColor));
  const bg = luminance(resolve(component.backgroundColor));
  const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
  assert(
    ratio >= 4.5,
    `${name}: text contrast ${ratio.toFixed(2)} is below 4.5`,
  );
  pairs++;
}
const generated = JSON.parse(
  readFileSync(new URL("../content/tokens.json", import.meta.url), "utf8"),
);
for (const group of ["colors", "typography", "rounded", "spacing"]) {
  assert.deepEqual(
    generated[group],
    tokens[group],
    `${group} is stale: run pnpm tokens`,
  );
}
console.log(
  `PASS design contract: tokens, references, generated values, ${pairs} text contrast pairs`,
);
