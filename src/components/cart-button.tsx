import { cartOpen } from "@/stores/cart"
import { useStore } from "@nanostores/preact"
import { useEffect } from "preact/hooks"
import { CartIcon, CloseIcon } from "@/components/icons"

export default function CartButton() {
    const isCartOpen = useStore(cartOpen)
    const cartCount = 3;
    const cartItems = [];

    const toggleCart = () => {
        cartOpen.set(!isCartOpen)
    };

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    },[isCartOpen])

    return (
        <>
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity duration-200 ease-in-out" onClick={toggleCart}>
            <CartIcon/>
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 text-[11px] px-1 font-medium text-white bg-black rounded-full leading-none">
                {cartCount}
                </span>
            )}
        </div>

        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
                isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleCart}
        />
        
        <div
            className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-light">CARRITO ({cartCount})</h2>
                    <button onClick={toggleCart} className="p-1">
                        <CloseIcon/>
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <p className="text-gray-500 text-sm">Su carrito está vacío</p>
                    </div>
                ) : (
                    <></>
                )}

                <div className="p-6 border-t border-gray-100">
                    <div className="flex justify-between mb-4">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm font-medium">$0</span>
                    </div>
                    <button
                        className="w-full bg-black text-white py-3 text-sm font-light tracking-wider disabled:bg-gray-200 disabled:text-gray-500"
                        disabled={cartItems.length === 0}
                    >
                        COMPRAR
                    </button>
                    <button
                        onClick={toggleCart}
                        className="w-full border border-black py-3 mt-2 text-sm font-light tracking-wider hover:bg-black hover:text-white transition-colors duration-200 ease-in-out"
                    >
                        SEGUIR COMPRANDO
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}