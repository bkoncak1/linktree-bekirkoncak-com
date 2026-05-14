// Reads src/data/profile.yaml and writes src/generated/redirects.json,
// a flat slug -> destination URL map consumed by the Worker.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import yaml from "yaml";

const profile = yaml.parse(readFileSync("src/data/profile.yaml", "utf8"));

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const redirects = {};
for (const link of profile.links ?? []) {
  const slug = link.slug ?? slugify(link.title);
  if (!slug) continue;
  if (redirects[slug]) {
    throw new Error(`Duplicate slug "${slug}" in profile.yaml`);
  }
  redirects[slug] = link.url;
}

const out = "src/generated/redirects.json";
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(redirects, null, 2) + "\n");
console.log(`[redirects] wrote ${Object.keys(redirects).length} entries to ${out}`);
