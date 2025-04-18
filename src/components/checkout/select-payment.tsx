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
                                {method.name === "WebPay" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" role="img" width="38" height="24"><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/><path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" role="img" width="38" height="24"><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/><circle fill="#EB001B" cx="15" cy="12" r="7"/><circle fill="#F79E1B" cx="23" cy="12" r="7"/><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/></svg>
                                    </>
                                )}
                                {method.name === "Mach" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" role="img" width="38" height="24" aria-labelledby="pi-mach" version="1.1" id="pi-mach_svg29"><title id="pi-mach">Mach</title><defs id="pi-mach_defs33"><clipPath clipPathUnits="userSpaceOnUse" id="pi-mach_clipPath267"><g id="pi-mach_g271"><path fill="#fff" id="pi-mach_rect269" d="M0 0h38v24H0z"/></g></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="pi-mach_clipPath261"><g id="pi-mach_g265"><path fill="#fff" id="pi-mach_rect263" d="M0 0h38v24H0z"/></g></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="pi-mach_clipPath255"><g id="pi-mach_g259"><path fill="#fff" id="pi-mach_rect257" d="M0 0h38v24H0z"/></g></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="pi-mach_clipPath249"><g id="pi-mach_g253"><path fill="#fff" id="pi-mach_rect251" d="M0 0h38v24H0z"/></g></clipPath></defs><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" id="pi-mach_path23"/><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" id="pi-mach_path25"/><g id="pi-mach_g361" transform="translate(-6.15 -4.008) scale(1.32995)" fill="#613dd2"><path d="M11.054 11.355L9.86 13.299c-.067.11-.13.222-.201.33-.234.352-.525.363-.756 0-.375-.584-.723-1.186-1.085-1.779-.092-.15-.154-.323-.307-.437-.152.108-.094.261-.095.391-.008.825-.005 1.65-.008 2.474 0 .21-.072.382-.294.445-.17.048-.3-.03-.407-.154-.073-.084-.078-.191-.079-.293-.002-1.494 0-2.989-.003-4.483 0-.239.101-.403.333-.454.223-.048.356.093.463.27.504.837 1.013 1.672 1.518 2.51.342.569.342.572.697-.008.496-.813.987-1.629 1.48-2.444.124-.205.256-.402.543-.316.286.086.29.32.29.562a669.613 669.613 0 000 4.252c.002.284-.042.551-.375.561-.345.011-.437-.247-.435-.555.005-.786.003-1.572 0-2.358 0-.126.03-.257-.085-.458z" id="pi-mach_path166" clip-path="url(#clipPath267)"/><path d="M31.195 12.058c0 .696-.002 1.392.001 2.088.002.291-.036.578-.397.585-.362.008-.417-.266-.412-.566.007-.464-.005-.928.003-1.392.004-.198-.068-.273-.27-.272-.773.008-1.546.01-2.319 0-.23-.004-.29.104-.29.301 0 .49-.004.98-.004 1.47 0 .263-.085.472-.388.462-.291-.01-.378-.213-.378-.48a940.86 940.86 0 000-4.445c0-.271.102-.474.384-.476.287-.002.383.21.382.476-.003.502.007 1.005 0 1.507-.003.27.086.392.382.385a54.61 54.61 0 012.164-.003c.247.004.346-.078.34-.333-.014-.503.002-1.005-.007-1.508-.004-.28.085-.514.383-.524.319-.011.428.225.427.522-.003.734 0 1.47 0 2.203z" id="pi-mach_path168" clip-path="url(#clipPath261)"/><path d="M20.168 12.058c.022-1.112.507-1.938 1.465-2.433.977-.505 1.942-.394 2.84.238.336.236.428.528.227.738-.248.259-.475.115-.708-.063a1.86 1.86 0 00-2.196-.047 1.894 1.894 0 00-.72 2.151c.246.746 1.009 1.302 1.794 1.29a1.79 1.79 0 001.172-.427c.217-.187.454-.303.661-.019.198.272.08.505-.171.691-.873.647-1.823.774-2.802.318-1.025-.477-1.54-1.322-1.562-2.437z" id="pi-mach_path170" clip-path="url(#clipPath255)"/><path d="M16.174 10.817c-.184.185-.254.425-.358.641-.432.905-.854 1.813-1.28 2.72-.05.105-.097.212-.158.31-.128.207-.3.328-.547.197-.234-.124-.281-.324-.174-.557.231-.501.47-1 .706-1.5.461-.976.924-1.95 1.383-2.928.091-.194.19-.383.435-.378.24.006.344.192.436.385.68 1.441 1.362 2.88 2.042 4.322.12.255.166.51-.144.658-.317.152-.473-.059-.592-.313-.466-.988-.93-1.977-1.402-2.961-.097-.203-.15-.437-.347-.596z" id="pi-mach_path172" clip-path="url(#clipPath249)"/></g></svg>
                                )}
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