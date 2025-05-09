import { useCallback } from 'preact/hooks'
import { subtotal } from '@/stores/checkout'
import { cart } from '@/stores/cart'
import { nanoid } from 'nanoid'

export function useCart() {
  const calculateSubtotal = (items: any[]) => {
    return items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  }

  const addProductToCart = useCallback((product: {
    id: number,
    name: string,
    price: number,
    category: string,
    image: string,
    values: { size: number, stock: number }[],
    discount_price: number,
  }, size: string) => {
    const current = cart.get()
    const itemIndex = current.items.findIndex(
      (item: any) => item.productId === product.id && item.size === size
    )

    // Determinar el precio a usar
    const finalPrice = (product.discount_price && 
                       product.discount_price !== 0 && 
                       product.discount_price !== product.price) 
                       ? product.discount_price 
                       : product.price

    let updatedItems

    if (itemIndex > -1) {
      updatedItems = current.items.map((item: any, index: number) => {
        if (index === itemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1
          }
        }
        return item
      })
    } else {
      const newItem = {
        id: nanoid(),
        productId: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image,
        quantity: 1,
        size: size,
      }
      updatedItems = [...current.items, newItem]
    }

    const newSubtotalValue = calculateSubtotal(updatedItems)
    subtotal.set(newSubtotalValue)

    cart.set({
      ...current,
      items: updatedItems
    })
  }, [])

  const updateQuantity = useCallback((id: number, quantity: number) => {
    const current = cart.get()

    let updatedItems
    if (quantity <= 0) {
      updatedItems = current.items.filter((item: any) => item.id !== id)
    } else {
      updatedItems = current.items.map((item: any) => {
        if (item.id === id) {
          return { ...item, quantity }
        }
        return item
      })
    }

    const newSubtotalValue = calculateSubtotal(updatedItems)
    subtotal.set(newSubtotalValue)

    cart.set({
      ...current,
      items: updatedItems
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    const current = cart.get()

    const updatedItems = current.items.filter((item: any) => item.id !== id)

    const newSubtotalValue = calculateSubtotal(updatedItems)
    subtotal.set(newSubtotalValue)

    cart.set({
      ...current,
      items: updatedItems
    })
  }, [])

  return { 
    addProductToCart, 
    updateQuantity, 
    removeFromCart 
  }
}