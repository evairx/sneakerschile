import { createClient } from "@libsql/client";
import { DB_URL, DB_TOKEN} from "astro:env/server";

const client = createClient({
    url: DB_URL ?? "", 
    authToken: DB_TOKEN ?? "",
});

export async function getUsers() {
    try {
        const query = "SELECT * FROM users"
        const data = {
            status: 200,
            data: (await client.execute(query)).rows,
        }
        return data
    } catch (error) {
        const data = {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
        return data
    }
}

export async function getProducts() {
    try {
        const products = (await client.execute("SELECT * FROM products")).rows;
        const sizes = (await client.execute("SELECT product_id, size, stock FROM product_sizes")).rows;
        
        const data = {
          status: 200,
          data: products.map(p => ({
            ...p,
            values: sizes.filter(s => s.product_id === p.id).map(s => ({
              size: s.size,
              stock: s.stock
            }))
          }))
        };
        return data
    } catch (error) {
        const data = {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
        return data
    }
}

export async function getRegions() {
    try {
        const regions = (await client.execute("SELECT * FROM regions")).rows;

        const shipments = (await client.execute("SELECT * FROM shipments")).rows;

        const cities = (await client.execute("SELECT * FROM cities")).rows;
        
        const data = {
            status: 200,
            data: regions.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
            .map(region => ({
                id: region.id,
                region: region.name,
                number: region.number,
                shipments: shipments.filter(s => s.region_id === region.id).map(s => ({
                    name: s.name,
                    price: s.price,
                    content: s.content,
                    payOnDelivery: Boolean(s.pay_on_delivery),
                    adaptive: Boolean(s.adaptive)
                })),
                cities: cities.filter(c => c.region_id === region.id).map(c => ({
                    id: c.id,
                    name: c.name,
                }))
            }))
        };
        return data;

    } catch (error) {
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

interface RouteOriginDestination {
    name: string;
    lat: number;
    lon: number;
}

interface RouteData {
    km: number;
    street: string;
    type: string;
    duration: number;
    linkMap: string;
}

interface PushRouteData {
    origin: RouteOriginDestination;
    destination: RouteOriginDestination;
    route: RouteData;
    geocoder_status: string;
    price: number;
}

interface RouteResponse {
    status: number;
    message?: string;
    error?: string;
}

export async function pushRoute(data: PushRouteData): Promise<RouteResponse> {
    try {
        const query = `
            INSERT INTO routes (origin_name, origin_lat, origin_lon, destination_name, destination_lat, destination_lon, 
                route_km, route_street, route_type, route_duration, route_linkMap, geocoder_status, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            data.origin.name,
            data.origin.lat,
            data.origin.lon,
            data.destination.name,
            data.destination.lat,
            data.destination.lon,
            data.route.km,
            data.route.street,
            data.route.type,
            data.route.duration,
            data.route.linkMap,
            data.geocoder_status,
            data.price
        ];

        // Ejecutar la consulta
        await client.execute(query, values);

        return {
            status: 200,
            message: 'Ruta almacenada correctamente',
        };
    } catch (error) {
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

interface RouteQueryResult {
    status: number;
    data?: any;
    message?: string;
    error?: string;
}

// Función para buscar una ruta con coincidencia parcial
export async function getRoute(origin: string, destination: string): Promise<RouteQueryResult> {
    try {
        // Normalizar textos para búsqueda (quitar acentos, convertir a minúsculas)
        const normalizeText = (text: string): string => {
            return text.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                .replace(/[^\w\s]/g, " "); // Reemplazar signos por espacios
        };

        const normalizedOrigin = normalizeText(origin);
        const normalizedDestination = normalizeText(destination);

        // Obtener todas las rutas y filtrar con JavaScript para mayor flexibilidad
        const query = `SELECT * FROM routes`;
        const result = await client.execute(query);
        
        // Buscar la mejor coincidencia
        const route = result.rows.find(route => {
            const routeOrigin = normalizeText(route.origin_name?.toString() ?? '');
            const routeDestination = normalizeText(route.destination_name?.toString() ?? '');
            
            // Verificar si los términos principales están contenidos
            const originMatch = routeOrigin.includes(normalizedOrigin) || 
                               normalizedOrigin.split(" ").some(term => 
                                 term.length > 3 && routeOrigin.includes(term));
                               
            const destMatch = routeDestination.includes(normalizedDestination) || 
                             normalizedDestination.split(" ").some(term => 
                               term.length > 3 && routeDestination.includes(term));
                             
            return originMatch && destMatch;
        });
        
        if (route) {
            // Formatear la respuesta en el formato solicitado
            return {
                status: 200,
                data: {
                    geocoder_status: route.geocoder_status,
                    origin: {
                        name: route.origin_name,
                        lat: route.origin_lat,
                        lon: route.origin_lon
                    },
                    destination: {
                        name: route.destination_name,
                        lat: route.destination_lat,
                        lon: route.destination_lon
                    },
                    route: {
                        km: route.route_km,
                        street: route.route_street,
                        type: route.route_type,
                        duration: route.route_duration,
                        linkMap: route.route_linkMap
                    },
                    price: route.price
                }
            };
        } else {
            // Registro de depuración para ver qué se está buscando
            console.log(`No se encontró coincidencia para: 
                Origin: "${origin}" (normalizado: "${normalizedOrigin}")
                Destination: "${destination}" (normalizado: "${normalizedDestination}")
            `);
            
            return {
                status: 404,
                message: 'Ruta no encontrada en la base de datos',
            };
        }
    } catch (error) {
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}