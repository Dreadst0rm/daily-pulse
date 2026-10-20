import { getCollection, type CollectionEntry } from "astro:content";
export { formatDisplayDate, updatePath } from "./dates.mjs";

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
