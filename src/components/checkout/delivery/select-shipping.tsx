import { selectedRegion, selectedShipping, priceShipping, priceLoading } from "@/stores/checkout"
import { useStore } from "@nanostores/preact"
import { formatPrice } from "@/utils/formatHelper";

interface Shipment {
    name: string;
    price: number;
    content: string;
    payOnDelivery: boolean,
    adaptive: boolean;
}

export default function SelectShipping() {
    const region = useStore(selectedRegion)
    const shipping = useStore(selectedShipping)
    const price = useStore(priceShipping)
    const pLoading = useStore(priceLoading)

    const setShippingMethod = (shipment: Shipment) => {
        selectedShipping.set(shipment)
    }
    return (
        <section aria-labelledby="shipping-heading">
            <h2 id="shipping-heading" className="text-lg font-light">Método de envío</h2>
            
            {Object.keys(region).length === 0 ? (
                <p className="mt-4 border border-gray-300 p-4 bg-gray-50 text-gray-500 text-sm" role="alert">
                    Seleccione una región para ver las opciones de envío disponibles.
                </p>
            ) : (
                region.shipments.length === 0 ? (
                    <p className="mt-4 border border-gray-300 p-4 bg-gray-50 text-gray-500 text-sm" role="alert">
                        No hay opciones de envío disponibles para esta región.
                    </p>
                ): (
                <fieldset className="space-y-4">
                    <legend className="sr-only">Seleccione un método de envío</legend>
                    {region.shipments.map((shipment) => (
                        <label
                            key={shipment.name}
                            className={`block border p-4 cursor-pointer transition-colors ${
                                shipment.name === shipping.name ? "border-gray-900" : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <input 
                                type="radio"
                                name="shipping-method"
                                value={shipment.name}
                                checked={shipment.name === shipping.name}
                                onChange={() => setShippingMethod(shipment)}
                                className="sr-only"
                                aria-describedby={`${shipment.name}-description`}
                            />
                            
                            <article className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                        shipment.name === shipping.name ? "border-black" : "border-gray-500"
                                    }`}>
                                        {shipment.name === shipping.name && 
                                            <span className="w-3 h-3 bg-black rounded-full" aria-hidden="true" />
                                        }
                                    </span>
                                    <span className="font-light">{shipment.name}</span>
                                </div>

                                <div className={`text-sm ${
                                    shipment.name === "Entrega normal" && pLoading ? "flex items-center space-x-4" : "flex items-center space-x-2"
                                }`}>
                                    {shipment.name === "Entrega normal" && 
                                        <span className="bg-black text-white rounded-full text-[.800rem] py-[.100rem] px-[.200rem] md:px-4 md:text-sm md:py-[.200rem] md:px-2">
                                            Recomendado
                                        </span>
                                    }
                                    
                                    {shipment.name === "Entrega normal" && pLoading ? (
                                        <span 
                                            className="inline-block w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"
                                            aria-label="Calculando precio..."
                                        />
                                    ) : (
                                        <span className={`font-medium ${shipment.payOnDelivery ? "text-[#007419]": "text-black"}`}>
                                            {shipment.payOnDelivery 
                                                ? shipment.content
                                                : shipment.price === 0 
                                                    ? "Gratis" 
                                                    : `$${formatPrice(shipment.adaptive ? (price || shipment.price) : shipment.price)}`
                                            }
                                        </span>
                                    )}
                                </div>
                            </article>

                            {shipment.name === shipping.name && (
                                <div 
                                    className="mt-2"
                                    id={`${shipment.name}-description`}
                                >
                                    {shipment.name === "Entrega normal" ? (
                                        <>
                                            <p className="text-sm font-light text-[#007419]">
                                                Entrega rápida (desde 24h)
                                            </p>
                                            <p className="mt-[.400rem] text-sm font-medium text-gray-600">
                                                Costo según dirección
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm font-light text-gray-500">
                                            Entrega en 3-5 días hábiles.
                                        </p>
                                    )}
                                </div>
                            )}
                        </label>
                    ))}
                </fieldset>
                )
            )}
        </section>
    )
}