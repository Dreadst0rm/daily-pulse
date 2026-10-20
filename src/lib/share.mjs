/**
 * Canonical URL and social-card fields for a page.
 * Home uses the site name alone; every other title is suffixed with the site name.
 * Update pages are articles. A YYYY-MM-DD published date becomes noon UTC, matching the feed.
 *
 * @param {{
 *   siteName: string,
 *   title: string,
 *   description: string,
 *   canonical: string,
 *   current?: "home" | "about" | "update",
 *   published?: string,
 * }} input
 */
export function shareMetadata(input) {
  const pageTitle =
    input.title === input.siteName ? input.siteName : `${input.title} · ${input.siteName}`;
  const type = input.current === "update" ? "article" : "website";
  const publishedTime =
    type === "article" && typeof input.published === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.published)
      ? `${input.published}T12:00:00.000Z`
      : undefined;

  return {
    pageTitle,
    description: input.description,
    canonical: input.canonical,
    type,
    siteName: input.siteName,
    publishedTime,
  };
}
