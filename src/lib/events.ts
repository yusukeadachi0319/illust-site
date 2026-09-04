import { getCollection, type CollectionEntry } from 'astro:content';

// events のうち今日以降で最も近いものを返す。該当なしなら undefined。
export async function getNextEvent(): Promise<CollectionEntry<'events'> | undefined> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const events = await getCollection('events', ({ data }) => data.date >= today);
  events.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  return events[0];
}
