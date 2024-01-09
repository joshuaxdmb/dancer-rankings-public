import { atom } from "recoil";

export const signUpFormAtom = atom({
    key:'signup-form',
    default:{},
})

export const rejectedSignUpAtom = atom({
    key:'rejected-signup',
    default: false
})