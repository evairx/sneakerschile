import { subtotal } from '@/stores/checkout'
import { useStore } from '@nanostores/preact'
import { formatPrice } from 'sneakerschile-utils/format'

export default function Subtotal() {
    const subtotalValue = useStore(subtotal)

    return formatPrice(subtotalValue)
}