import { paymentMethods } from "@/const/payments"
import { selectedPayment } from "@/stores/checkout"
import { useStore } from "@nanostores/preact"

export default function SelectPayment() {
    const payment = useStore(selectedPayment)

    const setPaymentMethod = (method: string) => {
        selectedPayment.set(method)
    }

    return (
        <>
            <h2 className="text-lg font-light">Método de pago</h2>
            <div className="mt-4 space-y-4">
                {paymentMethods.map((method) => (
                    <div 
                        key={method.id} 
                        className={`border p-4 cursor-pointer transition-colors ${method.name === payment ? "border-gray-900" : "border-gray-300 hover:border-gray-400"}`}
                        onClick={() => setPaymentMethod(method.name)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method.name === payment ? "border-black" : "border-gray-500"}`}>
                                    {method.name === payment && <div className="w-3 h-3 bg-black rounded-full"></div>}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-light">{method.label}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                            {method.images?.map((src, index) => (
                                <img key={index} src={src} alt={`payment-${index}`} className="h-6" />
                            ))}
                            </div>
                        </div>
                        {method.name === payment && (method.name === "WebPay" || method.name === "Mach") && (
                            <div className="mt-2 text-sm">
                                <p className="text-sm font-light text-gray-500">Pago Procesado Por Flow</p>
                            </div>
                        )}
                        {method.name === payment && method.name === "Transfer" && <div className="mt-2 text-sm">
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                                <div className="mb-3 pb-3 border-b border-gray-200">
                                    <p className="font-medium text-red-600">IMPORTANTE:</p>
                                    <p className="mt-1">
                                        Al realizar su transferencia <strong>DEBE</strong> incluir:
                                    </p>
                                    <p className="mt-2 bg-black text-white inline-block px-2 py-1 font-medium">
                                        Pedido {"#${orderId}"}
                                    </p>
                                    <p className="mt-2">en el campo de mensaje de transferencia/referencia.</p>
                                    <p className="mt-1 text-xs text-gray-700">
                                        Esto es necesario para validar y procesar su pedido.
                                    </p>
                                </div>
                                <p className="font-medium text-[1rem]">Detalles bancarios:</p>
                                <div className="mt-2 flex flex-col space-y-1">
                                    <p>Nombre: {"${nombre}"}</p>
                                    <p>Banco: Banco Estado</p>
                                    <p>RUT: 123456789</p>
                                    <p>Email: payments@minimal.com</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                ))}
            </div>
        </>
    )
}