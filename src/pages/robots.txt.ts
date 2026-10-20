import type { APIContext } from "astro";
import { renderRobots } from "../lib/discovery";

export function GET(context: APIContext) {
  return new Response(renderRobots(context.site), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
