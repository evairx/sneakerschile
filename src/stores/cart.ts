import { atom } from 'nanostores';

export const cartOpen = atom(false);

const defaultCart = { items: [], subtotal: 0 }

const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1]
}

const setCookie = (name: string, value: object) => {
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; path=/`
}

// Cargar desde cookie o crear por defecto
const initialCart = (() => {
  const raw = getCookie('cart')
  if (raw) {
    try {
      return JSON.parse(decodeURIComponent(raw))
    } catch {}
  }
  setCookie('cart', defaultCart)
  return defaultCart
})()

export const cart = atom(initialCart)

// Guardar cambios automáticamente
cart.subscribe(value => {
  setCookie('cart', value)
})