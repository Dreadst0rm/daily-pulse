/**
 * True for absolute http and https URLs.
 * `javascript:` and `data:` parse as URLs but are not allowed as source hrefs.
 * @param {unknown} value
 * @returns {value is string}
 */
export function isHttpUrl(value) {
  if (typeof value !== "string" || value.trim() === "" || value !== value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
