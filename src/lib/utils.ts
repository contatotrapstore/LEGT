import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatKD(kills: number, deaths: number): string {
  if (deaths === 0) return kills.toFixed(1);
  return (kills / deaths).toFixed(2);
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function parseRiotId(riotId: string): {
  name: string;
  tag: string;
} | null {
  // URL format: name-tag (e.g., "Player-1234")
  // We split on last hyphen since names can contain hyphens
  const lastDash = riotId.lastIndexOf("-");
  if (lastDash === -1) return null;

  const name = decodeURIComponent(riotId.slice(0, lastDash));
  const tag = decodeURIComponent(riotId.slice(lastDash + 1));

  if (!name || !tag) return null;
  return { name, tag };
}

export function buildRiotIdSlug(name: string, tag: string): string {
  return `${encodeURIComponent(name)}-${encodeURIComponent(tag)}`;
}

export function buildProfileUrl(region: string, name: string, tag: string): string {
  return `/@/${region}/${buildRiotIdSlug(name, tag)}`;
}
