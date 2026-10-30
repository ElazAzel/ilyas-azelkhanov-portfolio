import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

/** Test the exact export, including the subdirectory built into its assets. */
export async function serveExport() {
  const root = resolve("out");
  const home = await readFile(resolve(root, "index.html"), "utf8");
  const basePath = home.match(/src="([^"]*?)\/_next\//)?.[1] ?? "";
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".avif": "image/avif",
    ".woff2": "font/woff2",
    ".webmanifest": "application/manifest+json",
  };
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://local");
      if (basePath && !url.pathname.startsWith(`${basePath}/`))
        throw Error("Outside deployment");
      let path = resolve(
        root,
        `.${decodeURIComponent(url.pathname.slice(basePath.length))}`,
      );
      if (path !== root && !path.startsWith(root + sep))
        throw Error("Outside export");
      if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
      res.writeHead(200, {
        "content-type": types[extname(path)] ?? "application/octet-stream",
      });
      res.end(await readFile(path));
    } catch {
      res.writeHead(404, { "content-type": "text/html" });
      res.end(
        await readFile(resolve(root, "404.html")).catch(() => "Not found"),
      );
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    home,
    basePath,
    origin,
    url: origin + basePath,
    close: () => new Promise((done) => server.close(done)),
  };
}
