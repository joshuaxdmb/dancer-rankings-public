import { SpotifySession } from "@/types/types";
import { atom } from "recoil";

export const spotifySessionAtom = atom({
    key:'spotifySession',
    default:null as null | SpotifySession,

})