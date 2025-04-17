import Selector from "@/components/selector"
import { selectedRegion } from "@/stores/checkout"
import { useStore } from "@nanostores/preact"

export default function SelectCities() {
    const region = useStore(selectedRegion)
    
    return (
        !region.region ? (
            <button class="w-full flex items-center justify-between px-4 py-2 text-black border border-gray-300 cursor-not-allowed opacity-60" aria-expanded="false" aria-haspopup="true">
                <span class="truncate">Seleccionar Ciudad/Comuna</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 transition-transform duration-200"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
        ) : (
            <Selector 
                instanceId="selector-2" 
                placeholder="Seleccionar Ciudad/Comuna" 
                items={region.cities}
            />
        )
    )
}