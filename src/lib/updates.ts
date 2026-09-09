import { getCollection, type CollectionEntry } from "astro:content";

export type UpdateEntry = CollectionEntry<"updates">;

export async function getUpdates(): Promise<UpdateEntry[]> {
  const entries = await getCollection("updates");

  for (const entry of entries) {
    if (entry.id !== entry.data.date) {
      throw new Error(
        `content/updates/${entry.id}.json: the "date" field must match the filename (expected "${entry.id}", got "${entry.data.date}").`,
      );
    }
  }

  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function formatDisplayDate(isoDate: string): string {
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

export function updatePath(date: string): string {
  return `/updates/${date}/`;
}
