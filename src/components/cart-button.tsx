import { cartOpen, cart } from "@/stores/cart"
import { subtotal } from "@/stores/checkout"
import { useStore } from "@nanostores/preact"
import { useEffect } from "preact/hooks"
import { CartIcon, CloseIcon } from "@/components/icons"
import { useCart } from "@/hook/use-cart"
import { formatPrice } from "sneakerschile-utils/format"

declare global {
    interface Window {
        ThumbmarkJS: {
            getFingerprint(): Promise<string>;
        }
    }
}

export default function CartButton() {
    const isCartOpen = useStore(cartOpen)
    const cartValue = useStore(cart)
    const cartSubtotal = useStore(subtotal)
    const { updateQuantity, removeFromCart } = useCart()

    useEffect(() => {
        if (!document.cookie.includes('session=')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@thumbmarkjs/thumbmarkjs/dist/thumbmark.umd.js';
            script.onload = () => {
                window.ThumbmarkJS.getFingerprint().then(fp => {
                    document.cookie = `session=${fp}; path=/; Secure; SameSite=Strict`;
                });
            };
            document.head.appendChild(script);
        }
    }, []);

    const toggleCart = () => {
        cartOpen.set(!isCartOpen)
        console.log(cartValue)
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

    const handleCheckout = () => {
        if (cartValue.items.length > 0) {
            window.location.href = "/checkout"
            cartOpen.set(!isCartOpen)
        }
    }

    return (
        <>
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity duration-200 ease-in-out" onClick={toggleCart}>
            <CartIcon/>
            {cartValue.items.length > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 text-[11px] px-1 font-medium text-white bg-black rounded-full leading-none">
                    {cartValue.items.length}
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
                    <h2 className="text-lg font-light">CARRITO ({cartValue.items.length})</h2>
                    <button onClick={toggleCart} className="p-1">
                        <CloseIcon/>
                    </button>
                </div>

                {cartValue.items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <p className="text-gray-500 text-sm">Su carrito está vacío</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto">
                        <ul className="divide-y">
                            {cartValue.items.map((item, index) => (
                                <li key={`${item.id}-${item.size}-${index}`} className="p-4 flex gap-4">
                                    <div className="w-20 h-20 relative flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="text-sm font-medium">{item.name}</h3>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-black transition-colors duration-200 ease-in-out">
                                                <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                                >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-sm mt-1 text-gray-500">${formatPrice(item.price)} - Talla: {item.size}</p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-black hover:text-white transition-colors duration-200 ease-in-out"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 h-8 flex text-sm items-center justify-center border-t border-b border-gray-200">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= 5}
                                                className={`w-8 h-8 flex items-center justify-center border border-gray-300 ${item.quantity >= 5 ? "opacity-50 cursor-not-allowed" : "hover:bg-black hover:text-white transition-colors duration-200 ease-in-out"}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="p-6 border-t border-gray-100">
                    <div className="flex justify-between mb-4">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm font-medium">${formatPrice(cartSubtotal)}</span>
                    </div>
                    <button
                        className={`w-full bg-black text-white py-3 text-sm font-light border tracking-wider ${cartValue.items.length > 0 && "hover:opacity-70"} disabled:bg-gray-200 disabled:text-gray-500transition-colors duration-200 ease-in-out`}
                        disabled={cartValue.items.length === 0}
                        onClick={handleCheckout}
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