import { LocationIdsEnum } from "@/content";
import { SongLocal } from "@/types/types";
import { atom } from "recoil";

export const songsAtom = atom({
    key:'songs',
    default:{},
})