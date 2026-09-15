// Fails the deploy early, and legibly, when wrangler.toml still has the
// placeholder ids. Without this the first sign of trouble is a Cloudflare
// API error reading "Invalid uuid [code: 7400]", which says nothing useful.
import { readFileSync } from "node:fs";

const toml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
const missing = [...toml.matchAll(/^\s*(id|database_id)\s*=\s*"(REPLACE_[^"]*)"/gm)];

if (missing.length) {
  console.error(`
wrangler.toml still has placeholder ids:

${missing.map((m) => "  " + m[1] + ' = "' + m[2] + '"').join("\n")}

Nothing has created the KV namespace and D1 database yet. Create them and
paste the real ids in:

  npx wrangler kv namespace create POSTS
  npx wrangler d1 create posts

Copy the printed id into the matching block in wrangler.toml, commit, and
push. Leave the bindings named POSTS and DB — the code looks for those.
`);
  process.exit(1);
}
console.log("wrangler.toml: bindings look configured");
