import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { DEFAULT_SITE } from "../lib/discovery";
import { site } from "../lib/site";
import { getUpdates, updatePath } from "../lib/updates";

export async function GET(context: APIContext) {
  const updates = await getUpdates();

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? DEFAULT_SITE,
    items: updates.map((update) => ({
      title: update.data.title,
      description: update.data.summary,
      pubDate: new Date(`${update.data.date}T12:00:00.000Z`),
      link: updatePath(update.data.date),
    })),
    customData: "<language>en-us</language>",
  });
}
