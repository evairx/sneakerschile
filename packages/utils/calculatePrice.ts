export function calculatePrice(km: number): number {
    const tarifaBase = 1500;
    const kmBase = 7.4;
    const precioPorKmExtra = 180;

    if (km <= kmBase) {
        return tarifaBase;
    }

    const kmExtra = Math.ceil(km - kmBase);
    const costoExtra = kmExtra * precioPorKmExtra;

    return tarifaBase + costoExtra;
}