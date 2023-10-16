import { SongLocal } from "@/types/types";
import { atom } from "recoil";

export const songPlayingAtom = atom({
    key:'playing',
    default: null,

})



export const currentTrackAtom = atom({
    key:'currentTrack',
    default: null as null | SongLocal

})

export const isPlayingAtom = atom({
    key:'isPlaying',
    default: false,

})