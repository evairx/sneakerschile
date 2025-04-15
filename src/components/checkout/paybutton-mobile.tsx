import { useEffect, useCallback } from "preact/hooks"
import { signal } from "@preact/signals"

const MOBILE_BREAKPOINT = 768
const SCROLL_THRESHOLD = 300

const isVisible = signal(false)
const lastScrollY = signal(0)

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

export default function PayButtonMobile() {
    const isButtonVisible = useScrollVisibility()

    return (
    <>
        <div className="h-[80px]"></div>
        <div
            className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 transition-transform duration-300
                ${isButtonVisible ? "translate-y-0" : "translate-y-full"}
                shadow-lg
            `}
            aria-hidden={!isButtonVisible}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Total</span>
                <span className="text-base font-medium">$0</span>
            </div>
            <button class="w-full py-3 text-sm font-light tracking-wider bg-gray-200 text-gray-500 cursor-not-allowed">
                PROCESAR PAGO
            </button>
        </div>
    </>
    )
}