export interface SearchEntry {
  name: string;
  tag: string;
  region: string;
}

const STORAGE_KEY = "legt_recent_searches";
const MAX_ENTRIES = 10;

export function getRecentSearches(): SearchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SearchEntry[];
  } catch {
    return [];
  }
}

export function addRecentSearch(entry: SearchEntry): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentSearches();
    const filtered = existing.filter(
      (e) =>
        !(
          e.name.toLowerCase() === entry.name.toLowerCase() &&
          e.tag.toLowerCase() === entry.tag.toLowerCase()
        )
    );
    const updated = [entry, ...filtered].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage not available
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}
