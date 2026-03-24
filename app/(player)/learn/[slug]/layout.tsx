import { PlayerProvider } from "@/components/player/PlayerContext";
import { PlayerLayoutClient } from "@/components/player/PlayerLayoutClient";

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
    return (
        <PlayerProvider>
            <PlayerLayoutClient>
                {children}
            </PlayerLayoutClient>
        </PlayerProvider>
    );
}
