import { atom } from "recoil";

export const housePartyAtom = atom({
    key: 'housePartyId',
    default: null as string | null,
})

export const isPartyOwnerAtom = atom({
    key: 'isPartyOwner',
    default: false,
})