import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { linkifyProse } from "../src/lib/linkify.ts";

function hrefs(text) {
  return linkifyProse(text)
    .filter((part) => part.href)
    .map((part) => part.href);
}

describe("linkifyProse", () => {
  it("leaves prose without urls as a single text part", () => {
    assert.deepEqual(linkifyProse("No links in this sentence."), [
      { text: "No links in this sentence." },
    ]);
    assert.deepEqual(linkifyProse(""), [{ text: "" }]);
  });

  it("turns bare http and https urls into links", () => {
    assert.deepEqual(linkifyProse("See https://secure.efortune.tech today"), [
      { text: "See " },
      { text: "https://secure.efortune.tech", href: "https://secure.efortune.tech" },
      { text: " today" },
    ]);
    assert.deepEqual(hrefs("Also http://example.com/docs"), ["http://example.com/docs"]);
  });

  it("keeps a trailing period, comma, or closing parenthesis outside the href", () => {
    assert.deepEqual(linkifyProse("Read https://example.com/docs."), [
      { text: "Read " },
      { text: "https://example.com/docs", href: "https://example.com/docs" },
      { text: "." },
    ]);
    assert.deepEqual(linkifyProse("See https://example.com/a, then go."), [
      { text: "See " },
      { text: "https://example.com/a", href: "https://example.com/a" },
      { text: ", then go." },
    ]);
    assert.deepEqual(linkifyProse("(details at https://example.com/path)."), [
      { text: "(details at " },
      { text: "https://example.com/path", href: "https://example.com/path" },
      { text: ")." },
    ]);
  });

  it("linkifies every url in one sentence and keeps internal punctuation", () => {
    const parts = linkifyProse(
      "Pack: https://secure.efortune.tech/series/ai-maturity/ and https://secure.efortune.tech.",
    );
    assert.deepEqual(hrefs(parts.map((part) => part.text).join("")), [
      "https://secure.efortune.tech/series/ai-maturity/",
      "https://secure.efortune.tech",
    ]);
    assert.equal(parts.at(-1)?.text, ".");
    assert.equal(
      parts.find((part) => part.href?.includes("ai-maturity"))?.href,
      "https://secure.efortune.tech/series/ai-maturity/",
    );
  });

  it("keeps query strings and does not link other schemes", () => {
    assert.deepEqual(hrefs("Item https://news.ycombinator.com/item?id=49745940."), [
      "https://news.ycombinator.com/item?id=49745940",
    ]);
    assert.deepEqual(linkifyProse("Skip javascript:alert(1) and data:text/html,hi"), [
      { text: "Skip javascript:alert(1) and data:text/html,hi" },
    ]);
  });

  it("returns plain text parts so markup in prose is not treated as html", () => {
    const parts = linkifyProse('Before <em>https://example.com</em> & after.');
    assert.equal(parts.some((part) => part.text.includes("<em>")), true);
    assert.deepEqual(hrefs(parts.map((part) => part.text).join("")), ["https://example.com"]);
  });
});
