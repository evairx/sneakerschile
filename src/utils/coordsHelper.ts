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
    const R = 6371;
    const toRad = (deg: number): number => (deg * Math.PI) / 180;
  
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
}

export async function getDistanceKm(city1: string, city2: string): Promise<string> {
    const coord1 = await getCityCoords(city1);
    const coord2 = await getCityCoords(city2);
    const distance = haversineDistance(coord1, coord2);
    return distance.toFixed(2);
}

export function calculatePrice(km: number): number {
    const tarifaBase: number = 1500;
    const kmBase: number = 7.4;
    const precioPorKmExtra: number = 200;
  
    if (km <= kmBase) {
      return tarifaBase;
    }
  
    const kmExtra: number = km - kmBase;
    const costoExtra: number = kmExtra * precioPorKmExtra;
    return Math.round(tarifaBase + costoExtra);
}