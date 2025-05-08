import { formatPrice } from 'sneakerschile-utils/format'
import { useState, useEffect } from 'preact/hooks'
import { cart } from '@/stores/cart'
import { useStore } from '@nanostores/preact'
import { useQuery } from '@/hook/use-query'

export default function ItemsCart() {
    const cartValue = useStore(cart)
    const [showAll, setShowAll] = useState(false)
    const isDesktop = useQuery('(min-width: 768px)');

    const itemsToShow = isDesktop ? 2 : 1;
    const hasMoreItems = cartValue.items.length > itemsToShow
    const visibleItems = showAll ? cartValue.items : cartValue.items.slice(0, itemsToShow)
    const hiddenItemsCount = cartValue.items.length - itemsToShow

    useEffect(() => {
        if (cartValue.items.length == 0) {
          window.location.href = '/'
        }
    }, [cartValue])
    
    return (
      <div className="space-y-4 mb-6 p-4">
        {visibleItems.map((item) => (
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
            className="w-full text-gray-500 text-sm transition flex items-center justify-center hover:text-gray-700"
          >
            Ver {hiddenItemsCount} {hiddenItemsCount === 1 ? 'producto más' : 'productos más'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {showAll && (
          <button 
            onClick={() => setShowAll(false)}
            className="w-full text-gray-500 text-sm transition flex items-center justify-center hover:text-gray-700"
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