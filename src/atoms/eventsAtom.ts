import { atom } from "recoil";

export const eventsAtom = atom({
    key:'events',
    default: {},
})

type id = number | string

export const eventVotesbyUserAtom = atom({
    key:'eventVotesbyUser',
    default: [] as id[]
})