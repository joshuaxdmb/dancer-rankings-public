import { EventType } from "@/types/types"
import { atom } from "recoil";

export const createEventFormAtom = atom({
    key:'event-form',
    default:{} as EventType,
})
