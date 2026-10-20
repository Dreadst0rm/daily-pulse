import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseArgs, todayUtc } from "../scripts/new-update.mjs";

describe("todayUtc", () => {
  it("uses the UTC calendar day", () => {
    assert.equal(todayUtc(new Date("2026-10-20T00:30:00.000Z")), "2026-10-20");
    assert.equal(todayUtc(new Date("2026-10-21T02:00:00.000Z")), "2026-10-21");
  });
});

describe("parseArgs", () => {
  it("defaults to the injected today when no date is passed", () => {
    assert.deepEqual(parseArgs([], { today: "2026-10-20" }), {
      date: "2026-10-20",
      force: false,
      help: false,
    });
  });

  it("reads --date, --date=, and --force", () => {
    assert.equal(parseArgs(["--date", "2026-09-06"], { today: "2026-10-20" }).date, "2026-09-06");
    assert.equal(parseArgs(["--date=2024-02-29"]).date, "2024-02-29");
    assert.deepEqual(parseArgs(["--force", "--date", "2026-10-16"], { today: "2026-01-01" }), {
      date: "2026-10-16",
      force: true,
      help: false,
    });
  });

  it("accepts help without validating a bad date", () => {
    assert.equal(parseArgs(["--help"]).help, true);
    assert.equal(parseArgs(["-h"]).help, true);
    assert.equal(parseArgs(["--date", "2026-02-31", "--help"], { today: "2026-10-20" }).help, true);
  });

  it("rejects unknown arguments and impossible dates", () => {
    assert.throws(() => parseArgs(["nope"]), /Unknown argument: nope/);
    assert.throws(
      () => parseArgs(["--date", "2026-02-31"]),
      /--date must be a real YYYY-MM-DD calendar date \(got "2026-02-31"\)/,
    );
    assert.throws(() => parseArgs(["--date", "2026-02-29"]), /2026-02-29/);
    assert.throws(() => parseArgs(["--date", "2026-13-01"]), /2026-13-01/);
    assert.throws(() => parseArgs(["--date"]), /got undefined/);
    assert.throws(() => parseArgs(["--date", "--force"]), /"--force"/);
  });
});
