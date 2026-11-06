import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const FORBIDDEN = [
  "auth.efortune.tech",
  "coolify.efortune.tech",
  "/srv/netbird",
  "coolify.version=4.3.17",
  "WebAdmin",
  "dreadstorm/daily-pulse",
];

describe("published briefs", () => {
  it("do not publish live control-plane hostnames, callbacks, or host paths", () => {
    const files = readdirSync("content/updates").filter((name) => name.endsWith(".json"));
    assert.ok(files.length > 0);

    for (const file of files) {
      const body = readFileSync(`content/updates/${file}`, "utf8");
      for (const needle of FORBIDDEN) {
        assert.equal(body.includes(needle), false, `${file} still contains ${needle}`);
      }
    }
  });
});
