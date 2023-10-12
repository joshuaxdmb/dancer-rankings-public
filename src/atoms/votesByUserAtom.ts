import { VotesMap } from "@/types/types";
import { atom } from "recoil";

export const votesByUserAtom = atom({
    key: 'votesByUser',
    default: {} as VotesMap,
})