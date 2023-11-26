import { LocationIdsEnum } from "../../content";
import { atom } from "recoil";

export const locationAtom = atom({
    key:'location',
    default:LocationIdsEnum.toronto,

})