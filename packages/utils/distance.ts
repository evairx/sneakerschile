interface RoutePoint {
    name: string;
    lat: number;
    lon: number;
}
  
interface RouteInfo {
    km: number;
    street: string;
    type: string;
    duration: string;
    linkMap: string;
}
  
interface RouteResponse {
    geocoder_status: string;
    origin: RoutePoint;
    destination: RoutePoint;
    route: RouteInfo;
}
  
interface RouteRequest {
    origin: string;
    destination: string;
    key?: string;
}

export async function getDistance({ origin, destination, key }: RouteRequest): Promise<RouteResponse | undefined> {
    if (!origin || !destination) {
      console.error('Error: Origen y destino son requeridos');
      return undefined;
    }
  
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&language=es&key=${key}`;
  
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
  
      if (data.status !== 'OK') {
        throw new Error(`Error en directions: ${data.status}`);
      }
  
      const ruta = data.routes[0];
      const leg = ruta.legs[0];
  
      const output: RouteResponse = {
        geocoder_status: data.status,
        origin: {
          name: leg.start_address,
          lat: leg.start_location.lat,
          lon: leg.start_location.lng
        },
        destination: {
          name: leg.end_address,
          lat: leg.end_location.lat,
          lon: leg.end_location.lng
        },
        route: {
          km: +(leg.distance.value / 1000).toFixed(2),
          street: ruta.summary || "Ruta principal",
          type: "Driving",
          duration: leg.duration.text,
          linkMap: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
        },
      };
  
      return output;
  
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      return undefined;
    }
}