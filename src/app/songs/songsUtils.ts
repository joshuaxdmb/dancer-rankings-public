import { LocationIdsEnum } from "../../../content";
import { EventByVotesType, SongLocal } from "@/types/types";

export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const mergeSongs = (currentSongs: any, location: LocationIdsEnum, playlist: string, newSongs: SongLocal[]) => {
    const sortedSongs = [...newSongs, ...(currentSongs[location]?.[playlist] || [])]
    if (newSongs.length > 1) sortedSongs.sort((a: SongLocal, b: SongLocal) => b.total_votes - a.total_votes)

    const updatedLocation = {
        ...currentSongs[location],
        [playlist]: sortedSongs
    };
    return {
        ...currentSongs,
        [location]: updatedLocation
    };
};

export const mergeEvents = (currentEvents: any, location: LocationIdsEnum, newEvents: any[]) => {
    const updatedLocation = {
        ...currentEvents[location],
        ...newEvents
    };
    return {
        ...currentEvents,
        [location]: updatedLocation
    };
}

export const updateEventsVotes = (currentEvents: any, location: LocationIdsEnum, event_id: Number | String, vote: number) => {
    const updatedLocation = currentEvents[location].map((e: EventByVotesType) => {
        if (e.id == event_id) {
            return {
                ...e,
                total_votes: e.total_votes + vote
            }
        }
        return e
    }).sort((a: EventByVotesType, b: EventByVotesType) => b.total_votes - a.total_votes)

    return {
        ...currentEvents,
        [location]: updatedLocation
    };
}

export const updateSongsVotes = (currentSongs: any, location: LocationIdsEnum, playlist: string, spotify_id: string, vote: number, currentVote: number) => {
    const updatedLocation = {
        ...currentSongs[location],
        [playlist]: currentSongs[location]?.[playlist]?.map((s: SongLocal) => {
            if (s.spotify_id === spotify_id) {
                return {
                    ...s,
                    up_votes: s.up_votes + vote,
                    down_votes: s.down_votes - vote,
                    total_votes: s.total_votes + vote - currentVote
                };
            }
            return s;
        }).sort((a: SongLocal, b: SongLocal) => b.total_votes - a.total_votes)
    };
    return {
        ...currentSongs,
        [location]: updatedLocation
    };
}

export const mergeVotes = (currentVotes: any, location: LocationIdsEnum, playlist: string, spotify_id: string, vote: number) => {
    const newVotes = {
        ...currentVotes,
        [location]: {
            [playlist]: {
                ...currentVotes[location]?.[playlist],
                [spotify_id]: vote,
            },
        },
    }

    return newVotes
}