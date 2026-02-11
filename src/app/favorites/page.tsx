import type { Metadata } from "next";
import { FavoritesContent } from "@/components/favorites/favorites-content";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <FavoritesContent />
    </div>
  );
}
