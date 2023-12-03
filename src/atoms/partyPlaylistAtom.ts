import { atom } from "recoil";

export const partyPlaylistAtom = atom({
    key: 'partyPlaylistId',
    default: null as string | null,
})

export const isPartyOwnerAtom = atom({
    key: 'isPartyOwner',
    default: false,
})