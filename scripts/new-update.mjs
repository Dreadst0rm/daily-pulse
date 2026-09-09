#!/usr/bin/env node
/**
 * Scaffold today's (or --date YYYY-MM-DD) update JSON.
 * Usage: npm run new-update
 *        npm run new-update -- --date 2026-09-06
 *        npm run new-update -- --force
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const updatesDir = join(root, "content", "updates");

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs(argv) {
  const args = { date: todayUtc(), force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--date") {
      args.date = argv[i + 1];
      i += 1;
    } else if (token.startsWith("--date=")) {
      args.date = token.slice("--date=".length);
    } else if (token === "--force") {
      args.force = true;
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

function template(date) {
  return {
    date,
    title: "Title of today’s brief",
    summary: "Two or three sentences. This becomes the TL;DR callout.",
    tone: "neutral",
    sections: [
      {
        heading: "What changed",
        bullets: [
          "First observation. Prefer public sources over unsourced numbers.",
          "Second observation.",
        ],
        sources: [
          {
            label: "Source name",
            url: "https://example.com/article",
          },
        ],
      },
      {
        heading: "What to do with it",
        bullets: ["Action a busy operator can take without extra context."],
      },
    ],
    bottomLine: "One paragraph an operator can act on. Do not invent live metrics.",
  };
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Scaffold a daily update JSON file.

Usage:
  npm run new-update
  npm run new-update -- --date 2026-09-06
  npm run new-update -- --force

Writes content/updates/YYYY-MM-DD.json
`);
    return;
  }

  if (!args.date || !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error(`--date must be YYYY-MM-DD (got ${JSON.stringify(args.date)})`);
  }

  await mkdir(updatesDir, { recursive: true });
  const dest = join(updatesDir, `${args.date}.json`);

  if ((await exists(dest)) && !args.force) {
    throw new Error(`${dest} already exists. Pass --force to overwrite.`);
  }

  const body = `${JSON.stringify(template(args.date), null, 2)}\n`;
  await writeFile(dest, body, "utf8");

  console.log(`Wrote ${dest}`);
  console.log("Edit the file, then run: npm run build");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
