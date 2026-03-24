"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PlayerContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isFocusMode: boolean;
    setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentLessonId: number | null;
    setCurrentLessonId: React.Dispatch<React.SetStateAction<number | null>>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

    // Auto-enable focus mode handling on mobile size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // On mobile, sidebar operates as drawer, focus mode logic can be synced if needed
                setIsFocusMode(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <PlayerContext.Provider value={{
            isSidebarOpen, setIsSidebarOpen,
            isFocusMode, setIsFocusMode,
            isMobileMenuOpen, setIsMobileMenuOpen,
            currentLessonId, setCurrentLessonId
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayer must be used within PlayerProvider");
    return context;
}
