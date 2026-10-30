// Offline vector export. Geometry is unchanged from the original inline sculptures.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
const design = readFileSync(
  new URL("../DESIGN.md", import.meta.url),
  "utf8",
).replaceAll("\r\n", "\n");
const tokens = parse(design.match(/^---\n([\s\S]*?)\n---/)[1]).colors;
const artCss = readFileSync(
  new URL("../app/project-art.css", import.meta.url),
  "utf8",
);
const orange = artCss.match(/--art-orange-deep:\s*(#[0-9a-f]+)/i)[1];

const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a) => {
  const l = Math.hypot(...a) || 1;
  return a.map((x) => x / l);
};
const sub = (a, b) => a.map((x, i) => x - b[i]);
const rotate = ([x, y, z]) => {
  const y1 = y * Math.cos(0.9) - z * Math.sin(0.9);
  const z1 = y * Math.sin(0.9) + z * Math.cos(0.9);
  const x1 = x * Math.cos(-0.35) + z1 * Math.sin(-0.35);
  const z2 = -x * Math.sin(-0.35) + z1 * Math.cos(-0.35);
  return [
    x1 * Math.cos(-0.35) - y1 * Math.sin(-0.35),
    x1 * Math.sin(-0.35) + y1 * Math.cos(-0.35),
    z2,
  ];
};
const center = (t) => [
  0.72 * (Math.sin(t) + 2 * Math.sin(2 * t)),
  0.72 * (Math.cos(t) - 2 * Math.cos(2 * t)),
  -0.72 * Math.sin(3 * t),
];
function surface(kind, u, v) {
  if (kind === "ribbon") {
    const w = (v / Math.PI - 1) * 0.85;
    return [
      (2 + w * Math.cos(u / 2)) * Math.cos(u),
      (2 + w * Math.cos(u / 2)) * Math.sin(u),
      w * Math.sin(u / 2),
    ];
  }
  if (kind === "knot") {
    const c = center(u),
      tangent = norm(sub(center(u + 0.001), center(u - 0.001)));
    const n = norm(cross(tangent, [0, 0, 1])),
      b = norm(cross(tangent, n));
    return c.map(
      (x, i) => x + 0.43 * (n[i] * Math.cos(v) + b[i] * Math.sin(v)),
    );
  }
  return [
    (1.8 + 0.7 * Math.cos(v)) * Math.cos(u),
    (1.8 + 0.7 * Math.cos(v)) * Math.sin(u),
    0.7 * Math.sin(v),
  ];
}
function mesh(kind) {
  const faces = [],
    nu = 64,
    nv = kind === "ribbon" ? 8 : 14;
  const light = norm([-0.4, -0.65, 1]);
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const p = [
        [i, j],
        [i + 1, j],
        [i + 1, j + 1],
        [i, j + 1],
      ].map(([u, v]) =>
        rotate(surface(kind, (u / nu) * Math.PI * 2, (v / nv) * Math.PI * 2)),
      );
      const n = norm(cross(sub(p[1], p[0]), sub(p[3], p[0])));
      const diffuse = Math.abs(
        n.reduce((sum, value, k) => sum + value * light[k], 0),
      );
      const brightness = Math.min(
        1,
        0.12 + diffuse * 0.72 + Math.pow(diffuse, 18) * 0.3,
      );
      faces.push({
        points: p
          .map(([x, y, z]) => {
            const perspective = 9 / (9 - z);
            return `${(200 + x * 59 * perspective).toFixed(2)},${(200 + y * 59 * perspective).toFixed(2)}`;
          })
          .join(" "),
        depth: p.reduce((s, v) => s + v[2], 0) / 4,
        shade: Math.round((1 - brightness) * 100),
      });
    }
  return faces.sort((a, b) => a.depth - b.depth);
}

const settings = [
  ["mini-apps", "ring", orange, tokens.paper],
  ["bots", "ring", tokens.ink, tokens["primary-light"]],
  ["automation", "knot", tokens["primary-deep"], tokens["ink-inverse"]],
  ["training", "ribbon", tokens["primary-deep"], tokens.paper],
];
const out = new URL("../public/media/sculptures/", import.meta.url);
mkdirSync(out, { recursive: true });
for (const [id, kind, shadow, light] of settings) {
  const polygons = mesh(kind)
    .map((face) => {
      const color = `color-mix(in srgb, ${shadow} ${face.shade}%, ${light})`;
      return `<polygon points="${face.points}" fill="${color}" stroke="${color}" stroke-width=".5"/>`;
    })
    .join("");
  writeFileSync(
    new URL(id + ".svg", out),
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none" stroke-linejoin="round">${polygons}</svg>\n`,
  );
  console.log("sculpture: " + id);
}
