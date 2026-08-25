import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "お気に入り",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return <FavoritesList />;
}
