import { getDistanceKm, calculatePrice} from '@/utils/coordsHelper'
import { selectedRegion, priceShipping, priceLoading } from '@/stores/checkout'
import { useStore } from '@nanostores/preact'
import { signal } from '@preact/signals'

const address = signal('')
let timeoutId: NodeJS.Timeout | undefined

export default function Address() {
    const region = useStore(selectedRegion)
    
    const handleAddressChange = async (e: Event) => {
        const value = (e.target as HTMLInputElement).value
        address.value = value
        
        if (!region?.region) {
            return
        }

        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        
        if (value.length > 2) {
            priceLoading.set(true)
            timeoutId = setTimeout(async () => {
                try {
                    const fullAddress = `${value}, Región ${region.region}, Chile`
                    const distance = await getDistanceKm(import.meta.env.PUBLIC_VITE_LOCALITATION, fullAddress)
                    priceShipping.set(calculatePrice(parseFloat(distance)))
                    priceLoading.set(false)
                } catch (error) {
                    console.error('Error al calcular la distancia:', error)
                }
            }, 1000)
        }
    }

    return (
        <>
            <label htmlFor="address" className="block text-sm mb-1 font">
                Dirección
            </label>
            <input
                type="text"
                id="address"
                value={address.value}
                onInput={handleAddressChange}
                disabled={!region?.region}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                placeholder={region?.region ? "Ingrese su dirección" : "Seleccione una región primero"}
            />
        </>
    )
}