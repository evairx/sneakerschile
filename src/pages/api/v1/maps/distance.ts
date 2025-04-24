import { getDistance } from "sneakerschile-utils/distance";
import { MAPS_API_KEY } from "astro:env/server";
import { calculatePrice } from "sneakerschile-utils/calculatePrice";

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const { origin, destination } = await request.json();

        if (!origin || !destination) {
            return Response.json({ 
                error: 'Origin and destination are required' 
            }, { status: 400 });
        }
        
        const distanceData = await getDistance({ 
            origin, 
            destination, 
            key: MAPS_API_KEY 
        });

        if (!distanceData) {
            return Response.json({ 
                error: 'Error al obtener la distancia desde la API externa' 
            }, { status: 500 });
        }

        const price = calculatePrice(distanceData.route.km);

        const routeData = {
            ...distanceData,
            price,
        };

        return Response.json(routeData, { status: 200 });

    } catch (error) {
        console.error('Error en el procesamiento de la ruta:', error);
        return Response.json({ 
            error: 'Error al procesar la solicitud de distancia',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}