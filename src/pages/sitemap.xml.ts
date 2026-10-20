import type { APIContext } from "astro";
import { renderSitemap } from "../lib/discovery";
import { getUpdates } from "../lib/updates";

export async function GET(context: APIContext) {
  const updates = await getUpdates();
  const body = renderSitemap(
    context.site,
    updates.map((update) => update.data.date),
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
