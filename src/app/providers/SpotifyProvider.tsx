"use client"

import { SpotifyProviderContext } from "@/hooks/useSpotify";

interface SpotifyProviderProps {
    children: React.ReactNode;
}

const SpotifyProvider: React.FC<SpotifyProviderProps> = ({children}) =>{
    return (
        <SpotifyProviderContext>
            {children}
        </SpotifyProviderContext>
    )
}

export default SpotifyProvider