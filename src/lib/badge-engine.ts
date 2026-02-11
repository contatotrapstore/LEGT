import type { BadgeType } from "@/types/valorant";
import type { HenrikLifetimeMatch } from "@/types/api";

export function determineBadgesFromLifetime(
  match: HenrikLifetimeMatch
): BadgeType[] {
  const badges: BadgeType[] = [];
  const s = match.stats;
  const totalShots = s.shots.head + s.shots.body + s.shots.leg;

  // Headshot Machine: HS% >= 35%
  if (totalShots > 0) {
    const hsPercent = (s.shots.head / totalShots) * 100;
    if (hsPercent >= 35) {
      badges.push("headshot_machine");
    }
  }

  // High KD in match suggests strong performance
  const kd = s.deaths > 0 ? s.kills / s.deaths : s.kills;
  if (kd >= 2.0 && s.kills >= 20) {
    badges.push("match_mvp");
  } else if (kd >= 1.5 && s.kills >= 15) {
    badges.push("team_mvp");
  }

  return badges;
}
