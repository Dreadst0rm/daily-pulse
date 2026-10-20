import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shareMetadata } from "../src/lib/share.mjs";

const siteName = "Daily Digest";
const canonical = "https://digest.example.com/updates/2026-10-16/";

describe("shareMetadata", () => {
  it("does not duplicate the site name on the home title", () => {
    const meta = shareMetadata({
      siteName,
      title: siteName,
      description: "Short daily briefs.",
      canonical: "https://digest.example.com/",
      current: "home",
    });

    assert.equal(meta.pageTitle, "Daily Digest");
    assert.equal(meta.type, "website");
    assert.equal(meta.canonical, "https://digest.example.com/");
    assert.equal(meta.publishedTime, undefined);
  });

  it("suffixes other pages and marks update pages as articles", () => {
    const meta = shareMetadata({
      siteName,
      title: "Least-privilege agents",
      description: 'Quotes, ampersands & "carets".',
      canonical,
      current: "update",
      published: "2026-10-16",
    });

    assert.equal(meta.pageTitle, "Least-privilege agents · Daily Digest");
    assert.equal(meta.description, 'Quotes, ampersands & "carets".');
    assert.equal(meta.type, "article");
    assert.equal(meta.siteName, siteName);
    assert.equal(meta.canonical, canonical);
    assert.equal(meta.publishedTime, "2026-10-16T12:00:00.000Z");
  });

  it("keeps about pages as websites and ignores a published date", () => {
    const meta = shareMetadata({
      siteName,
      title: "About",
      description: "How Daily Digest is maintained.",
      canonical: "https://digest.example.com/about/",
      current: "about",
      published: "2026-10-16",
    });

    assert.equal(meta.pageTitle, "About · Daily Digest");
    assert.equal(meta.type, "website");
    assert.equal(meta.publishedTime, undefined);
  });

  it("omits article time unless the published value is YYYY-MM-DD", () => {
    const meta = shareMetadata({
      siteName,
      title: "A brief",
      description: "Summary",
      canonical,
      current: "update",
      published: "October 16",
    });

    assert.equal(meta.type, "article");
    assert.equal(meta.publishedTime, undefined);
  });
});
