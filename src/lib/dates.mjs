const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * True only for a real Gregorian calendar day written as YYYY-MM-DD.
 * `2026-02-31` is not a day, even though it matches the shape.
 * @param {unknown} value
 * @returns {value is string}
 */
export function isRealIsoDate(value) {
  if (typeof value !== "string") return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDisplayDate(isoDate) {
  if (!isRealIsoDate(isoDate)) {
    throw new Error(`Invalid calendar date: ${JSON.stringify(isoDate)}`);
  }

  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * @param {string} date
 * @returns {string}
 */
export function updatePath(date) {
  return `/updates/${date}/`;
}
