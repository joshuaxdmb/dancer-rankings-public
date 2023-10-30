import { EventLocalType} from "@/types/types";
import { atom } from "recoil";

export const eventsAtom = atom({
    key:'events',
    default: {},
})

export const eventVotesbyUserAtom = atom({
    key:'eventVotesbyUser',
    default: [] as string[]
})