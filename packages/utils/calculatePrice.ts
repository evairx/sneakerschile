export function calculatePrice(km: number): number {
    const tarifaBase = 1500; // Precio mínimo base
    const kmBase = 7.4;      // Hasta 7.4 km solo se cobra tarifa base
    const precioPorKmExtra = 120; // MUY barato: $120 por km extra

    // Redondear al decimal más cercano (.1 km)
    const kmRedondeado = Math.round(km * 10) / 10;

    if (kmRedondeado <= kmBase) {
        return tarifaBase;
    }

    const kmExtra = kmRedondeado - kmBase;
    const costoExtra = kmExtra * precioPorKmExtra;

    return Math.round(tarifaBase + costoExtra);
}
