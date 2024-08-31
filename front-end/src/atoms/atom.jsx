// atoms/messagesAtom.js
import { atom } from 'recoil';

export const messagesAtom = atom({
    key: 'messagesAtom', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (initial value)
});
