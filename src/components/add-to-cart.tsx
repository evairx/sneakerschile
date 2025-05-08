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
            <button onClick={() => handleSelectSize(id)} class="w-full py-2 text-sm font-medium rounded transition-colors duration-200 border border-black text-black hover:bg-black hover:text-white">
                Seleccionar Talla
            </button>
            
            {openSelected.value[id] && (
            <div className="absolute left-0 right-0 bottom-[40px] bg-white border-t border-gray-200 p-3 shadow-lg z-10">
                <div className="text-sm font-medium mb-2">Selecciona tu talla:</div>
                <div className="grid grid-cols-4 gap-2">
                    {product.values.map((value) => (
                        <button
                            key={value.size}
                            disabled={value.stock === 0}
                            className={`
                                py-2 text-center rounded text-sm
                                ${
                                  value.stock > 0
                                    ? "border border-gray-100 text-black hover:border-gray-800"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }
                                ${selectedSizes.value[id] === value.size.toString() ? "bg-gray-200 border-black" : ""}
                              `}
                        >
                            {value.size}
                        </button>
                    ))}
                </div>
            </div>
            )}
        </div>
    )
}