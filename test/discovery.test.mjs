import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { absoluteUrl, renderRobots, renderSitemap, resolveSite } from "../src/lib/discovery.ts";

const site = "https://digest.example.com";

describe("resolveSite", () => {
  it("falls back to the local dev origin", () => {
    assert.equal(resolveSite(undefined), "http://127.0.0.1:43147");
    assert.equal(resolveSite("  "), "http://127.0.0.1:43147");
  });

  it("accepts a URL object or a string and keeps a configured origin", () => {
    assert.equal(resolveSite(new URL("https://digest.example.com/")), "https://digest.example.com/");
    assert.equal(resolveSite(" https://digest.example.com "), "https://digest.example.com");
  });
});

describe("absoluteUrl", () => {
  it("builds trailing-slash urls from a site with or without a trailing slash", () => {
    assert.equal(absoluteUrl(site, "/sitemap.xml"), "https://digest.example.com/sitemap.xml");
    assert.equal(absoluteUrl(`${site}/`, "/about/"), "https://digest.example.com/about/");
    assert.equal(absoluteUrl(site, "/"), "https://digest.example.com/");
  });
});

describe("renderSitemap", () => {
  it("lists home, about, and each update with lastmod, newest first", () => {
    const xml = renderSitemap(site, ["2026-09-06", "2026-10-16", "2026-09-06"]);

    assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
    assert.match(xml, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
    assert.equal(
      xml,
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://digest.example.com/</loc>
    <lastmod>2026-10-16</lastmod>
  </url>
  <url>
    <loc>https://digest.example.com/about/</loc>
  </url>
  <url>
    <loc>https://digest.example.com/updates/2026-10-16/</loc>
    <lastmod>2026-10-16</lastmod>
  </url>
  <url>
    <loc>https://digest.example.com/updates/2026-09-06/</loc>
    <lastmod>2026-09-06</lastmod>
  </url>
</urlset>
`,
    );
  });

  it("omits home lastmod when there are no updates", () => {
    const xml = renderSitemap(site, []);
    assert.match(xml, /<loc>https:\/\/digest.example.com\/<\/loc>\n  <\/url>/);
    assert.doesNotMatch(xml, /lastmod/);
    assert.match(xml, /https:\/\/digest.example.com\/about\//);
  });

  it("escapes xml metacharacters in locations and lastmod", () => {
    const xml = renderSitemap(site, ["2026-10-01&<"]);
    assert.match(xml, /<lastmod>2026-10-01&amp;&lt;<\/lastmod>/);
    assert.match(
      xml,
      /<loc>https:\/\/digest.example.com\/updates\/2026-10-01&amp;%3C\/<\/loc>/,
    );
    assert.doesNotMatch(xml, /<lastmod>2026-10-01&</);
  });

  it("does not advertise the rss feed as a page", () => {
    const xml = renderSitemap(site, ["2026-10-16"]);
    assert.doesNotMatch(xml, /rss\.xml/);
  });
});

describe("renderRobots", () => {
  it("points the sitemap directive at an absolute sitemap url", () => {
    assert.equal(
      renderRobots(site),
      `User-agent: *\nAllow: /\n\nSitemap: https://digest.example.com/sitemap.xml\n`,
    );
    assert.doesNotMatch(renderRobots(new URL(site)), /rss\.xml/);
  });
});
