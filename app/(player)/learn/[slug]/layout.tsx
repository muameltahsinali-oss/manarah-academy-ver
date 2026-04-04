import { PlayerProvider } from "@/components/player/PlayerContext";
import { PlayerLayoutClient } from "@/components/player/PlayerLayoutClient";

/** مسارات `/learn/[slug]` ديناميكية (SSR) — لا حاجة لـ `generateStaticParams`. */
export default function PlayerLayout({ children }: { children: React.ReactNode }) {
    return (
        <PlayerProvider>
            <PlayerLayoutClient>
                {children}
            </PlayerLayoutClient>
        </PlayerProvider>
    );
}
