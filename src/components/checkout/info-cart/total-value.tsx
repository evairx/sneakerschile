import { priceShipping, tax, subtotal } from '@/stores/checkout'
import { useStore } from '@nanostores/preact'
import { formatPrice } from 'sneakerschile-utils/format'

export default function TotalValue() {
    const taxValue = useStore(tax)
    const subtotalValue = useStore(subtotal)
    const shippingValue = useStore(priceShipping)

    return formatPrice(taxValue+subtotalValue+shippingValue)
}