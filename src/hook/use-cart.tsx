import { useCallback } from 'preact/hooks'
import { cart } from '@/stores/cart'

export function useCart() {
    const addProductToCart = useCallback((product: {
        id: number,
        name: string,
        price: number,
        category: string,
        image: string,
        values: { size: number, stock: number }[]
      }, size: string) => {
        const current = cart.get()
        const itemIndex = current.items.findIndex(
          (item: any) => item.id === product.id && item.size === size
        )
      
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
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: size,
          }
          updatedItems = [...current.items, newItem]
        }
      
        const newSubtotal = updatedItems.reduce((sum: number, item: any) => {
          return sum + item.price * item.quantity
        }, 0)
      
        cart.set({
          ...current,
          items: updatedItems,
          subtotal: newSubtotal
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

    const newSubtotal = updatedItems.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity
    }, 0)

    cart.set({
      ...current,
      items: updatedItems,
      subtotal: newSubtotal
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    const current = cart.get()

    const updatedItems = current.items.filter((item: any) => item.id !== id)

    const newSubtotal = updatedItems.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity
    }, 0)

    cart.set({
      ...current,
      items: updatedItems,
      subtotal: newSubtotal
    })
  }, [])

  return { addProductToCart, updateQuantity, removeFromCart }
}
