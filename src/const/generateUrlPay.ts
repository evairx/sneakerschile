import { nanoid } from 'nanoid'

export async function generarURLPagoFalsa() {
  // Esperar 5 segundos
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Generar URL con orderId
  const orderId = nanoid()
  const url = `http://paymentfake.pay/orderId=${orderId}`
  
  return url
}