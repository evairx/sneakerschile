interface Coordinates {
    lat: number;
    lon: number;
}

interface LocationResponse {
    lat: string;
    lon: string;
}

export async function getCityCoords(city: string): Promise<Coordinates> {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json`);
    const data: LocationResponse[] = await res.json();
    if (data.length === 0) throw new Error('Ciudad no encontrada');
    const { lat, lon } = data[0];
    console.log(`Coordenadas de ${city}: lat=${lat}, lon=${lon}`);
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

export function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (deg: number): number => (deg * Math.PI) / 180;

    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distancia en línea recta
}

export async function getDistanceKm(city1: string, city2: string): Promise<string> {
    const coord1 = await getCityCoords(city1);
    const coord2 = await getCityCoords(city2);
    const straightDistance = haversineDistance(coord1, coord2);
    
    // Simulación de distancia real por carretera (~30% más que en línea recta)
    const estimatedRealDistance = straightDistance * 1.3;
    
    console.log(`Distancia estimada entre ${city1} y ${city2}: ${estimatedRealDistance.toFixed(2)} km`);
    return estimatedRealDistance.toFixed(2);
}

export function calculatePrice(km: number): number {
    const tarifaBase = 1500;         // Precio mínimo
    const kmBase = 7.4;              // Kilómetros incluidos en la tarifa base
    const precioPorKmExtra = 180;    // Costo por kilómetro adicional

    if (km <= kmBase) {
        return tarifaBase;
    }

    const kmExtra = Math.ceil(km - kmBase); // Redondear hacia arriba los km extra
    const costoExtra = kmExtra * precioPorKmExtra;

    return tarifaBase + costoExtra;
}
