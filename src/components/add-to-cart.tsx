import { cart, cartOpen  } from "@/stores/cart"
import { useStore } from "@nanostores/preact"
import { signal } from "@preact/signals"
import { useWindowSize } from "@/hook/use-window-size"

interface Size {
    value: string;
    stock: number;
}

const selectedSizes = signal<Record<number, string>>({})
const openSelected = signal<Record<number, boolean>>({})

export default function AddToCart({ sizes, id }: { sizes: Size[]; id: number }) {
    const cartStore = useStore(cart)
    const windowSize = useWindowSize()

    function handleAddToCart() {
        if (!selectedSizes.value[id]) return
        cartOpen.set(true)
    }

    function handleSelectSize(id: number) {
        if (openSelected.value[id]) return

        openSelected.value = {
            ...openSelected.value,
            [id]: !openSelected.value[id]
        }
    }

    return (
        windowSize.value.width < 769 ? (
            openSelected.value[id] ? (
                <div className="absolute inset-0 bg-[#ffffff57]  backdrop-blur-sm flex flex-col justify-center items-center p-4 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                     <h3 className="text-sm font-medium mb-3">Seleccionar Talla</h3>
                    <button 
                        onClick={handleAddToCart}
                        className={`w-full mt-6 py-2 text-sm font-light tracking-wider transition-colors duration-200 ease-in-out ${selectedSizes.value[id] ? "bg-[#000] text-white" : "bg-white text-black opacity-30 cursor-not-allowed"}`}
                    >
                        AÑADIR AL CARRITO
                    </button>
                </div>
            ): (
                <div className="absolute bottom-[0rem] w-full transition-all duration-300">
                    <button 
                        className="w-full py-2 text-sm font-light tracking-wider transition-colors duration-200 ease-in-out bg-[#000] text-white" 
                        onClick={() => handleSelectSize(id)}
                    >
                        SELECCIONAR TALLA
                    </button>
                </div>
            )
        ) : (
            <div className="absolute inset-0 bg-[#ffffff94] backdrop-blur-sm flex flex-col justify-center items-center p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                <h3 className="text-sm font-medium mb-3">Seleccionar Talla</h3>
                <div className="flex justify-center align-center w-full">
                    <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                        {sizes.map((size) => (
                            <button
                                key={size.value}
                                onClick={() => {
                                    if (size.stock > 0) {
                                        selectedSizes.value = { ...selectedSizes.value, [id]: size.value }
                                    }
                                }}
                                className={`py-2 px-3 text-xs border ${ size.stock === 0
                                    ? "border-[#4444443a] text-[#4444443a] cursor-not-allowed"
                                    : selectedSizes.value[id] === size.value
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300 hover:border-black"
                                    }
                                `}
                            >
                                {size.value}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className={`w-full mt-6 py-2 text-sm font-light tracking-wider hover:text-black transition-colors duration-200 ease-in-out ${selectedSizes.value[id] ? "bg-[#000] text-white hover:bg-[#303030] hover:text-white" : "bg-white text-black opacity-30 cursor-not-allowed"}`}
                >
                    AÑADIR AL CARRITO
                </button>
            </div>
        )
    )
}