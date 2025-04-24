import { priceShipping } from '@/stores/checkout'
import { useStore } from '@nanostores/preact'
import { formatPrice } from 'sneakerschile-utils/format'

export default function ShippingPrice() {
    const price = useStore(priceShipping)

    return formatPrice(price)
}