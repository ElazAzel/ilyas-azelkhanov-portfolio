import type { ServiceId } from "@/content/pricing";

type V = [number, number, number];
type Face = { points: string; depth: number; shade: number };
const cross = (a: V, b: V): V => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V): V => {
  const l = Math.hypot(...a) || 1;
  return a.map((x) => x / l) as V;
};
const sub = (a: V, b: V): V => a.map((x, i) => x - b[i]!) as V;
const rotate = ([x, y, z]: V): V => {
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
const center = (t: number): V => [
  0.72 * (Math.sin(t) + 2 * Math.sin(2 * t)),
  0.72 * (Math.cos(t) - 2 * Math.cos(2 * t)),
  -0.72 * Math.sin(3 * t),
];
function surface(kind: string, u: number, v: number): V {
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
      (x, i) => x + 0.43 * (n[i]! * Math.cos(v) + b[i]! * Math.sin(v)),
    ) as V;
  }
  return [
    (1.8 + 0.7 * Math.cos(v)) * Math.cos(u),
    (1.8 + 0.7 * Math.cos(v)) * Math.sin(u),
    0.7 * Math.sin(v),
  ];
}
function mesh(kind: string): Face[] {
  const faces: Face[] = [],
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
        rotate(surface(kind, (u! / nu) * Math.PI * 2, (v! / nv) * Math.PI * 2)),
      );
      const n = norm(cross(sub(p[1]!, p[0]!), sub(p[3]!, p[0]!)));
      const diffuse = Math.abs(
        n.reduce((sum, value, k) => sum + value * light[k]!, 0),
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
const meshes = {
  ring: mesh("ring"),
  knot: mesh("knot"),
  ribbon: mesh("ribbon"),
};

/** Projected 3D surfaces with lighting. Vectors remain sharp at every viewport. */
export function ProjectSculpture({
  id,
  className = "",
}: {
  id: ServiceId;
  className?: string;
}) {
  const shape =
    id === "automation" ? "knot" : id === "training" ? "ribbon" : "ring";
  return (
    <div
      className={`project-sculpture sculpture--${id} ${className}`}
      aria-hidden="true"
    >
      <div className="sculpture-shadow" />
      {id === "websites" ? (
        <svg className="sculpture-object" viewBox="0 0 400 400" fill="none">
          <path
            d="M78 344V167a122 122 0 0 1 244 0v177h-61V167a61 61 0 0 0-122 0v177H78Z"
            fill="var(--sculpture-shadow)"
            transform="translate(28 -20)"
          />
          <path
            d="m322 344 28-20V147a122 122 0 0 0-56-103l-28 20a122 122 0 0 1 56 103v177Z"
            fill="var(--sculpture-mid)"
          />
          <path
            d="M78 344V167a122 122 0 0 1 244 0v177h-61V167a61 61 0 0 0-122 0v177H78Z"
            fill="var(--sculpture-light)"
          />
          <path
            d="m139 344 28-20V147a61 61 0 0 1 56-61 61 61 0 0 0-84 57v201Z"
            fill="var(--sculpture-mid)"
          />
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={i}
              d={`M${81 + i * 4} 342V167a${119 - i * 4} ${119 - i * 4} 0 0 1 ${238 - i * 8} 0v175`}
              stroke="var(--sculpture-shadow)"
              strokeOpacity=".14"
              strokeWidth=".6"
            />
          ))}
        </svg>
      ) : (
        <svg
          className="sculpture-object"
          viewBox="0 0 400 400"
          fill="none"
          strokeLinejoin="round"
        >
          {meshes[shape].map((face, i) => (
            <polygon
              key={i}
              points={face.points}
              fill={`color-mix(in srgb, var(--sculpture-shadow) ${face.shade}%, var(--sculpture-light))`}
              stroke={`color-mix(in srgb, var(--sculpture-shadow) ${face.shade}%, var(--sculpture-light))`}
              strokeWidth=".5"
            />
          ))}
        </svg>
      )}
      <span className="sculpture-orbit" />
    </div>
  );
}
