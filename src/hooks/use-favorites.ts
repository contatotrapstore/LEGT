"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

export interface Favorite {
  id: string;
  riot_name: string;
  riot_tag: string;
  region: string;
  display_name: string;
  rank_tier: number;
  rank_icon_url: string | null;
  added_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    setFavorites(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (player: {
      riotName: string;
      riotTag: string;
      region: string;
      displayName: string;
      rankTier?: number;
      rankIconUrl?: string;
    }) => {
      if (!user) return false;

      const supabase = createClient();
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        riot_name: player.riotName,
        riot_tag: player.riotTag,
        region: player.region,
        display_name: player.displayName,
        rank_tier: player.rankTier ?? 0,
        rank_icon_url: player.rankIconUrl ?? null,
      });

      if (!error) {
        await fetchFavorites();
        return true;
      }
      return false;
    },
    [user, fetchFavorites]
  );

  const removeFavorite = useCallback(
    async (riotName: string, riotTag: string) => {
      if (!user) return false;

      const supabase = createClient();
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("riot_name", riotName)
        .eq("riot_tag", riotTag);

      if (!error) {
        await fetchFavorites();
        return true;
      }
      return false;
    },
    [user, fetchFavorites]
  );

  const isFavorite = useCallback(
    (riotName: string, riotTag: string) => {
      return favorites.some(
        (f) => f.riot_name === riotName && f.riot_tag === riotTag
      );
    },
    [favorites]
  );

  return { favorites, loading, addFavorite, removeFavorite, isFavorite };
}
