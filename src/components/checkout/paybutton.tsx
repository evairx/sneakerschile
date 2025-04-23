import { useEffect, useCallback } from "preact/hooks"
import { signal } from "@preact/signals"
import { useQuery } from "@/hook/use-query"
import { actions } from "astro:actions"

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

export default function PayButtonMobile() {
    const isButtonVisible = useScrollVisibility()
    const isMobile = useQuery('(min-width: 768px)');

    return (
        isMobile ? (
            <button 
                className="hidden md:block mt-[2rem] w-full py-3 text-sm font-light tracking-wider bg-black text-white"
                onClick={async () => {
                    loading.value = true
                    const { data , error } = await actions.pay({
                        email: "sadasdsad"
                    })
                    console.log(data)
                }}
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
                    <output className="text-base font-medium">$0</output>
                </figure>
                <button class="w-full py-3 text-sm font-light tracking-wider bg-gray-200 text-gray-500 cursor-not-allowed">
                    PROCESAR PAGO
                </button>
            </aside>
            </>
        )
    )
}