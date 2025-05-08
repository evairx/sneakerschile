import { useEffect, useCallback } from "preact/hooks"
import { selectedShipping, selectedPayment, tax } from "@/stores/checkout"
import { useStore } from "@nanostores/preact"
import { signal } from "@preact/signals"
import { useQuery } from "@/hook/use-query"
import TotalValue from "@/components/checkout/info-cart/total-value"

interface CartItem {
    id: string;
    quantity: number;
    [key: string]: any; // for other properties in the original item
}

interface SimplifiedCartItem {
    id: string;
    quantity: number;
}

const MOBILE_BREAKPOINT = 768
const SCROLL_THRESHOLD = 300

const isVisible = signal(false)
const lastScrollY = signal(0)
const loading = signal(false)

const useScrollVisibility = () => {
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT
        const isScrollingDown = currentScrollY > lastScrollY.value
        
        if (isMobile && isScrollingDown && currentScrollY > SCROLL_THRESHOLD) {
            isVisible.value = true
        } else if (currentScrollY < SCROLL_THRESHOLD) {
            isVisible.value = false
        }
        
        lastScrollY.value = currentScrollY
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [handleScroll])

    return isVisible.value
}

const getCartFromCookies = () => {
    const cookies = document.cookie.split(';')
    let cartCookie = cookies.find(cookie => cookie.trim().startsWith('cart='))
    
    if (cartCookie) {
        try {
            const cartString = decodeURIComponent(cartCookie.split('=')[1])
            return JSON.parse(cartString)
        } catch (error) {
            console.error('Error parsing cart cookie:', error)
            return { items: [] }
        }
    }
    
    return { items: [] }
}

export default function PayButtonMobile() {
    const selectedShippingValue = useStore(selectedShipping)
    const selectedPaymentValue = useStore(selectedPayment)
    const isButtonVisible = useScrollVisibility()
    const isMobile = useQuery('(min-width: 768px)');
    
    const isPaymentValid = typeof selectedPaymentValue === 'string' && selectedPaymentValue.trim() !== '';
    const isShippingValid = selectedShippingValue && typeof selectedShippingValue === 'object' && 'id' in selectedShippingValue;
    
    const isButtonEnabled = Boolean(isPaymentValid && isShippingValid);

    const handleButtonPay = async () => {
        if (!isButtonEnabled) return;
                    
        loading.value = true;
        const cartData = getCartFromCookies();
    
        try {
            const simplifiedItems = cartData.items.map((item: CartItem) => ({
                id: item.productId,
                quantity: item.quantity,
                size: item.size
            }));
    
            const formattedCart = {
                idOrder: "QIMJX",
                name: "Juan Perez",
                email: "akongamer14@gmail.com",
                address: "Av. Los Pajaritos 3425, Depto 501, Maipú, Santiago",
                items: simplifiedItems,
                shipping: selectedShippingValue.id,
                payment: selectedPaymentValue
            };
    
            const response = await fetch('/api/v1/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedCart)
            });
    
            const result = await response.json();
    
            if (result.success && result.data && result.data.url) {
                window.location.href = result.data.url;
            } else {
                console.error('Error en el procesamiento del pago:', result);
                loading.value = false;
            }
        } catch (error) {
            console.error('Error al enviar la solicitud de pago:', error);
            loading.value = false;
        }
    };
    
    return (
        isMobile ? (
            <button 
                className={`hidden md:block mt-[2rem] w-full py-3 text-sm font-light tracking-wider ${
                    isButtonEnabled 
                        ? "bg-black text-white" 
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleButtonPay}
                disabled={!isButtonEnabled}
            >
                {loading.value ? (
                    <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                ) : (
                    "PROCESAR PAGO"
                )}
            </button>
        ): (
            <>
            <div className="h-[80px]"></div>
            <aside
                className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 transition-transform duration-300
                    ${isButtonVisible ? "translate-y-0" : "translate-y-full"}
                    shadow-lg
                `}
                aria-hidden={!isButtonVisible}
                role="complementary"
            >
                <figure className="flex items-center justify-between mb-3">
                    <figcaption className="text-sm font-medium">Total</figcaption>
                    <output className="text-base font-medium">$<TotalValue/></output>
                </figure>
                <button 
                    className={`w-full py-3 text-sm font-light tracking-wider ${
                        isButtonEnabled 
                            ? "bg-black text-white" 
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleButtonPay }
                    disabled={!isButtonEnabled}
                >
                    {loading.value ? (
                        <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                    ) : (
                        "PROCESAR PAGO"
                    )}
                </button>
            </aside>
            </>
        )
    )
}