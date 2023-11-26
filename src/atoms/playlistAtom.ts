import { PlaylistEnum } from "../../content";
import { atom } from "recoil";

export const playlistAtom = atom({
    key:'playlist',
    default:PlaylistEnum.bachata,

})