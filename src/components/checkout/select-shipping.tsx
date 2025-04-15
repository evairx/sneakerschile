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
        console.log(shipping)
    }

    return (
        Object.keys(region).length === 0 ? (
            <>
                <h2 className="text-lg font-light">Método de envío</h2>
                <div className="mt-4 border border-gray-300 p-4 bg-gray-50 text-gray-500 text-sm">
                    Seleccione una región para ver las opciones de envío disponibles.
                </div>
            </>
        ): (
            <>
                <h2 className="text-lg font-light">Método de envío</h2>
                <div className="mt-4 space-y-4">
                    {region.shipments.map((shipment) => (
                        <div
                            key={shipment.name} 
                            className={`border p-4 cursor-pointer transition-colors transition-colors ${shipment.name === shipping.name ? "border-gray-900" : "border-gray-300 hover:border-gray-400"}`}
                            onClick={() => setShippingMethod(shipment)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shipment.name === shipping.name ? "border-black" : "border-gray-500"}`}>
                                        {shipment.name === shipping.name && <div className="w-3 h-3 bg-black rounded-full"></div>}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-light">{shipment.name}</span>
                                    </div>
                                </div>
                                <div className={`text-sm ${shipment.name === "Entrega normal" && pLoading ? "flex items-center space-x-4" : "flex items-center space-x-2"}`}>
                                    {shipment.name === "Entrega normal" && <span class="bg-black text-white px-2 md:px-4 py-[.200rem]">Recomendado</span>}
                                    {shipment.name === "Entrega normal" && pLoading ? (
                                        <span class="inline-block w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                    ):( 
                                        <span className={`font-medium ${shipment.payOnDelivery ? "text-[#007419]": "text-black"}`}>
                                            {shipment.payOnDelivery ? shipment.content: shipment.price === 0 ? "Gratis" : `${shipment.adaptive === true ?  price === 0 ? `$${formatPrice(shipment.price)}`: `$${formatPrice(price)}` : `$${formatPrice(shipment.price)}`}`}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {shipment.name === shipping.name &&
                                <div className="mt-2">
                                    {shipment.name === "Entrega normal" ? 
                                        <p class="text-sm font-light text-[#007419]">Entrega rápida ( desde 24h )</p>
                                    :
                                        <p class="text-sm font-light text-gray-500">Entrega en 3-5 días hábiles.</p>
                                    }
                                    {shipment.name === "Entrega normal" &&
                                        <p class="mt-[.400rem] text-sm font-medium text-gray-600">Costo según dirección</p>
                                    }
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </>
        )
    )
}