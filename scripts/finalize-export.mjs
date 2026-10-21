// Next 16.4.2 emits nested segment files while its static client requests
// dotted filenames (segment-value-encoding.js). Add aliases for plain hosting.
import { copyFile, readdir, readFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out/", import.meta.url));
let aliases = 0;

async function flatten(directory, segmentRoot) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) {
      await flatten(source, segmentRoot ?? (entry.name.startsWith("__next.") ? source : undefined));
    } else if (segmentRoot && entry.name.endsWith(".txt")) {
      const route = dirname(segmentRoot);
      const target = join(route, relative(route, source).replace(/[\\/]/g, "."));
      const existing = await readFile(target).catch((error) => {
        if (error.code !== "ENOENT") throw error;
        return null;
      });
      if (existing && !existing.equals(await readFile(source))) throw new Error(`Conflicting segment alias: ${target}`);
      if (!existing) { await copyFile(source, target); aliases++; }
    }
  }
}

await flatten(out);
console.log(`Static export: ${aliases} segment aliases added.`);
