import { tax } from '@/stores/checkout'
import { useStore } from '@nanostores/preact'
import { formatPrice } from 'sneakerschile-utils/format'

export default function TaxValue() {
    const taxValue = useStore(tax)

    return formatPrice(taxValue)
}