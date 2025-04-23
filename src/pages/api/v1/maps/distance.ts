import { getDistance } from "sneakerschile-utils/distance";
import { MAPS_API_KEY } from "astro:env/server";
import { calculatePrice } from "sneakerschile-utils/calculatePrice";

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const { origin, destination } = await request.json();

        if (!origin || !destination) {
            return Response.json({ error: 'Origin and destination are required' }, { status: 400 });
        }

        const data = await getDistance({ origin, destination, key: MAPS_API_KEY });

        if (!data) {
            return Response.json({ error: 'Error al obtener la distancia' }, { status: 500 });
        }

        const distance = calculatePrice(data.route.km);
        
        return Response.json({
            ...data,
            price: distance
        } , { status: 200 });

    } catch (error) {
        return Response.json({ error: 'Error al obtener la distancia' }, { status: 500 });
    }
}
