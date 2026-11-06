import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { isHttpUrl } from "../src/lib/http-url.mjs";

describe("isHttpUrl", () => {
  it("accepts absolute http and https urls", () => {
    for (const url of [
      "https://example.com",
      "https://example.com/path?q=1&b=2",
      "http://127.0.0.1:43147/updates/2026-09-06/",
      "https://news.ycombinator.com/item?id=49745940",
    ]) {
      assert.equal(isHttpUrl(url), true, url);
    }
  });

  it("rejects non-http schemes, relative urls, and non-strings", () => {
    for (const url of [
      "javascript:alert(1)",
      "javascript://example.com/%0aalert(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
      "ftp://example.com/file",
      "mailto:ed@example.com",
      "/updates/2026-09-06/",
      "example.com",
      " https://example.com",
      "https://example.com ",
      "",
      null,
      undefined,
    ]) {
      assert.equal(isHttpUrl(url), false, String(url));
    }
  });

  it("accepts every source url already published", () => {
    const files = readdirSync("content/updates").filter((name) => name.endsWith(".json"));
    assert.ok(files.length > 0);
    for (const file of files) {
      const data = JSON.parse(readFileSync(`content/updates/${file}`, "utf8"));
      for (const section of data.sections ?? []) {
        for (const source of section.sources ?? []) {
          assert.equal(isHttpUrl(source.url), true, `${file} ${source.url}`);
        }
      }
    }
  });
});
