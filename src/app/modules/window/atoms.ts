import { atom } from "jotai";

export const activeWindowsAtom = atom<string[]>(["finder"]);