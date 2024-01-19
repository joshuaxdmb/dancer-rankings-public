import { SignInMethodsEnum } from "../lib/content";
import { atom } from "recoil";

export const signInMethodAtom = atom({
    key:'signInMethod',
    default: null as SignInMethodsEnum,

})