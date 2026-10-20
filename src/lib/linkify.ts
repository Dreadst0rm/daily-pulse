export type ProsePart = {
  text: string;
  href?: string;
};

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;
const TRAILING_PUNCTUATION = /[.,)]+$/;

function isLinkableHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Split plain prose into text and http(s) links.
 * A trailing period, comma, or closing parenthesis stays in the following text
 * so it is not part of the href. Other schemes are left as text.
 */
export function linkifyProse(input: string): ProsePart[] {
  const parts: ProsePart[] = [];
  let cursor = 0;

  for (const match of input.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    const raw = match[0];
    const trailing = raw.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const url = raw.slice(0, raw.length - trailing.length);
    if (!isLinkableHttpUrl(url)) continue;

    if (index > cursor) parts.push({ text: input.slice(cursor, index) });
    parts.push({ text: url, href: url });
    cursor = index + url.length;
  }

  if (cursor < input.length) parts.push({ text: input.slice(cursor) });
  if (parts.length === 0) return [{ text: input }];
  return parts;
}
