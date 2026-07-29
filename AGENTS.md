# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable design decisions

- Selected target: the second displayed concept — a strict dark editorial system with oversized typography, a 12-column grid, hairlines, restrained violet accents, and embedded product interfaces.
- The site must feel authored and precise, not generically AI-generated. Avoid glossy gradients, glass cards, decorative blobs, fake metrics, invented client details, and excessive animation.
- Use `public/media/higgsfield-editorial-grid.png` only as a low-contrast texture.
- The final implementation is the production Next.js App Router site from the brief, not a disposable Vite demo.
- On phones, the portfolio should feel like a focused native-style product: use a compact app bar, persistent bottom tab navigation, safe-area spacing, screen-like section grouping, and touch-first controls while preserving the dark editorial visual system.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
