import { atom } from 'nanostores';

export const cartOpen = atom(false);

export const cart = atom({
    id: "",
    items: [],
    subtotal: 0
})