import { formatPrice } from 'sneakerschile-utils/format'
import { useState } from 'preact/hooks'
import { cart } from '@/stores/cart'
import { useStore } from '@nanostores/preact'

export default function ItemsCart() {
    const cartValue = useStore(cart)

    const sampleCartItems = [
        { id: 1, name: "Product 1", quantity: 2, price: 29.99, image: "/product1.jpg" },
    ]
    
    const [showAll, setShowAll] = useState(false)
    const displayedItems = showAll ? sampleCartItems : sampleCartItems.slice(0, 2)
    const hasMoreItems = sampleCartItems.length > 2
    
    return (
      <div className="space-y-4 mb-6 p-4">
        {cartValue.items.map((item) => (
          <div key={item.id} className="flex space-x-4 py-2 border-b border-gray-100 last:border-b-0">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity} - Talla: {item.size}</p>
              <p className="text-sm mt-1">${formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
        
        {hasMoreItems && !showAll && (
          <button 
            onClick={() => setShowAll(true)}
            className="w-full py-2 text-gray-500 text-sm transition flex items-center justify-center"
          >
            Ver {sampleCartItems.length - 2} productos más
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {showAll && (
          <button 
            onClick={() => setShowAll(false)}
            className="w-full py-2 text-gray-500 text-sm transition flex items-center justify-center"
          >
            Mostrar menos
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    )
}