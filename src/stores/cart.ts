import { atom } from 'nanostores';
import { subtotal } from './checkout';

export const cartOpen = atom(false);

const defaultCart = { items: [] };

const calculateSubtotal = (items: any[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
};

const setCookie = (name: string, value: object, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${name}=${encoded}; path=/; expires=${expires}; SameSite=Lax`;
};

const initialCart = (() => {
  const raw = getCookie('cart');
  if (raw) {
    try {
      const parsedCart = JSON.parse(decodeURIComponent(raw));
      const { subtotal: _, ...cartWithoutSubtotal } = parsedCart;
      
      const totalPrice = calculateSubtotal(parsedCart.items);
      subtotal.set(totalPrice);
      
      return cartWithoutSubtotal;
    } catch (e) {
      console.error('Error parsing cart cookie:', e);
    }
  }
  subtotal.set(0);
  setCookie('cart', defaultCart);
  return defaultCart;
})();

export const cart = atom(initialCart);

cart.subscribe(value => {
  const totalPrice = calculateSubtotal(value.items);
  subtotal.set(totalPrice);
  setCookie('cart', value);
});