import type { RankKey } from "@/types/valorant";

export interface RankTheme {
  key: RankKey;
  displayName: string;
  iconPath: string;
}

export const RANK_THEMES: Record<RankKey, RankTheme> = {
  unranked: {
    key: "unranked",
    displayName: "Unranked",
    iconPath: "/ranks/unranked.png",
  },
  iron: {
    key: "iron",
    displayName: "Iron",
    iconPath: "/ranks/iron.png",
  },
  bronze: {
    key: "bronze",
    displayName: "Bronze",
    iconPath: "/ranks/bronze.png",
  },
  silver: {
    key: "silver",
    displayName: "Silver",
    iconPath: "/ranks/silver.png",
  },
  gold: {
    key: "gold",
    displayName: "Gold",
    iconPath: "/ranks/gold.png",
  },
  platinum: {
    key: "platinum",
    displayName: "Platinum",
    iconPath: "/ranks/platinum.png",
  },
  diamond: {
    key: "diamond",
    displayName: "Diamond",
    iconPath: "/ranks/diamond.png",
  },
  ascendant: {
    key: "ascendant",
    displayName: "Ascendant",
    iconPath: "/ranks/ascendant.png",
  },
  immortal: {
    key: "immortal",
    displayName: "Immortal",
    iconPath: "/ranks/immortal.png",
  },
  radiant: {
    key: "radiant",
    displayName: "Radiant",
    iconPath: "/ranks/radiant.png",
  },
};
