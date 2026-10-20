import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { formatDisplayDate, isRealIsoDate, updatePath } from "../src/lib/dates.mjs";

describe("isRealIsoDate", () => {
  it("accepts real calendar days, including leap days", () => {
    for (const date of ["2026-09-06", "2026-01-01", "2024-02-29", "2000-02-29", "1900-02-28"]) {
      assert.equal(isRealIsoDate(date), true, date);
    }
  });

  it("rejects impossible days and non-strings", () => {
    for (const date of [
      "2026-02-31",
      "2026-02-29",
      "1900-02-29",
      "2026-13-01",
      "2026-00-10",
      "2026-01-00",
      "2026-04-31",
      "2026-11-31",
      "2026-1-01",
      "2026-09-06 ",
      "",
      null,
      undefined,
      20260906,
    ]) {
      assert.equal(isRealIsoDate(date), false, String(date));
    }
  });

  it("matches every published brief", () => {
    const files = readdirSync("content/updates").filter((name) => name.endsWith(".json"));
    assert.ok(files.length > 0);
    for (const file of files) {
      const data = JSON.parse(readFileSync(`content/updates/${file}`, "utf8"));
      assert.equal(file, `${data.date}.json`);
      assert.equal(isRealIsoDate(data.date), true, file);
    }
  });
});

describe("formatDisplayDate", () => {
  it("formats a UTC calendar day without shifting the date", () => {
    assert.equal(formatDisplayDate("2026-09-06"), "Sunday, September 6, 2026");
    assert.equal(formatDisplayDate("2026-01-01"), "Thursday, January 1, 2026");
    assert.equal(formatDisplayDate("2024-02-29"), "Thursday, February 29, 2024");
    assert.equal(formatDisplayDate("2026-03-15"), "Sunday, March 15, 2026");
    assert.equal(formatDisplayDate("2026-10-16"), "Friday, October 16, 2026");
  });

  it("throws instead of rolling an impossible day forward", () => {
    assert.throws(() => formatDisplayDate("2026-02-31"), /Invalid calendar date: "2026-02-31"/);
    assert.throws(() => formatDisplayDate("2026-02-29"), /Invalid calendar date/);
  });
});

describe("updatePath", () => {
  it("builds the trailing-slash permalink", () => {
    assert.equal(updatePath("2026-09-06"), "/updates/2026-09-06/");
  });
});
