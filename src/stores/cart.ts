import { atom } from 'nanostores';
import { subtotal } from './checkout';

export const cartOpen = atom(false);
export const MAX_PRODUCT_QUANTITY = 5; // Constante para el límite máximo

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

// Función para aplicar el límite máximo a los productos en el carrito
const enforceQuantityLimit = (items: any[]) => {
  return items.map(item => ({
    ...item,
    quantity: Math.min(item.quantity, MAX_PRODUCT_QUANTITY)
  }));
};

const initialCart = (() => {
  const raw = getCookie('cart');
  if (raw) {
    try {
      const parsedCart = JSON.parse(decodeURIComponent(raw));
      const { subtotal: _, ...cartWithoutSubtotal } = parsedCart;
      
      // Aplicar límite de cantidad a los items existentes
      cartWithoutSubtotal.items = enforceQuantityLimit(cartWithoutSubtotal.items);
      
      const totalPrice = calculateSubtotal(cartWithoutSubtotal.items);
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

// Función para agregar un método que controle la cantidad máxima
export const addToCart = (product: any, quantity = 1) => {
  const currentCart = cart.get();
  const existingItemIndex = currentCart.items.findIndex(item => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    // Si el producto ya existe, aumentar su cantidad hasta el límite máximo
    const newItems = [...currentCart.items];
    const currentQuantity = newItems[existingItemIndex].quantity;
    
    // No permitir que la cantidad exceda MAX_PRODUCT_QUANTITY
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: Math.min(currentQuantity + quantity, MAX_PRODUCT_QUANTITY)
    };
    
    cart.set({ ...currentCart, items: newItems });
  } else {
    // Si es un producto nuevo, agregarlo con la cantidad especificada (hasta el máximo)
    cart.set({
      ...currentCart,
      items: [
        ...currentCart.items,
        { ...product, quantity: Math.min(quantity, MAX_PRODUCT_QUANTITY) }
      ]
    });
  }
};

// Función para actualizar la cantidad directamente
export const updateQuantity = (productId: string | number, quantity: number) => {
  const currentCart = cart.get();
  const existingItemIndex = currentCart.items.findIndex(item => item.id === productId);
  
  if (existingItemIndex >= 0) {
    const newItems = [...currentCart.items];
    
    // Asegurarse de que la cantidad no exceda el máximo y no sea menor que 1
    const newQuantity = Math.max(1, Math.min(quantity, MAX_PRODUCT_QUANTITY));
    
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: newQuantity
    };
    
    cart.set({ ...currentCart, items: newItems });
  }
};

cart.subscribe(value => {
  // Aplicar límite de cantidad cada vez que el carrito cambie
  const limitedItems = enforceQuantityLimit(value.items);
  
  // Solo actualizar si realmente hubo cambios debido a los límites
  if (JSON.stringify(limitedItems) !== JSON.stringify(value.items)) {
    cart.set({ ...value, items: limitedItems });
    return; // Evitar bucle infinito
  }
  
  const totalPrice = calculateSubtotal(value.items);
  subtotal.set(totalPrice);
  setCookie('cart', value);
});