import { cartOpen  } from "@/stores/cart"
import { useEffect, useRef } from "preact/hooks"
import { signal } from "@preact/signals"
import { useWindowSize } from "@/hook/use-window-size"
import { useCart } from "@/hook/use-cart"

interface Values {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    values: {
        size: number;
        stock: number;
    }[];
}

interface Size {
    size: number;
    stock: number;
}

const selectedSizes = signal<Record<number, string>>({})
const openSelected = signal<Record<number, boolean>>({})

export default function AddToCart({ product, id }: { product: Values; id: number }) {
    const { addProductToCart } = useCart()
    const windowSize = useWindowSize()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                openSelected.value = { ...openSelected.value, [id]: false }
            }
        }
        
        // Solo añadimos el listener si el selector está abierto
        if (openSelected.value[id]) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openSelected.value[id]])

    function handleAddToCart() {
        if (!selectedSizes.value[id]) return
        addProductToCart(product, selectedSizes.value[id])
        openSelected.value = { ...openSelected.value, [id]: false }
        selectedSizes.value = {}
        cartOpen.set(true)
    }

    function handleSelectSize(id: number) {
        if (openSelected.value[id]) return
        
        openSelected.value = {
            [id]: true
        }
    }

    function handleSizeClick(size: string) {
        selectedSizes.value = { ...selectedSizes.value, [id]: size }
    }

    return (
        <div className="relative" ref={containerRef}>
            <button 
                onClick={() => openSelected.value[id] ? handleAddToCart() : handleSelectSize(id)}
                disabled={openSelected.value[id] && !selectedSizes.value[id]}
                className={`w-full py-2 text-sm font-medium rounded transition-colors duration-200
                    ${openSelected.value[id] && !selectedSizes.value[id]
                        ? "bg-gray-200 border border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border border-black text-black hover:bg-black hover:text-white"
                    }
                `}
            >
                {openSelected.value[id] ? "Añadir al Carrito" : "Seleccionar Talla"}
            </button>
            
            {openSelected.value[id] && (
                <div className="absolute left-0 right-0 bottom-[40px] bg-white border-t border-gray-200 p-3 shadow-lg z-10">
                    <div className="text-sm font-medium mb-2">Selecciona tu talla:</div>
                    <div className="grid grid-cols-4 gap-2">
                        {[...product.values]
                            .sort((a, b) => a.size - b.size)
                            .map((value) => (
                                <button
                                    key={value.size}
                                    disabled={value.stock === 0}
                                    onClick={() => handleSizeClick(value.size.toString())}
                                    className={`
                                        py-2 text-center rounded text-sm
                                        ${value.stock === 0 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                            : selectedSizes.value[id] === value.size.toString()
                                                ? "border border-black bg-black text-white" 
                                                : "border border-gray-100 text-black hover:border-gray-800"
                                        }
                                    `}
                                >
                                    {value.size}
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    )
}