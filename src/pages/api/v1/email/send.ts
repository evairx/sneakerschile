import { sendEmail } from "sneakerschile-utils/sendEmail";
import { PLUNK_API_KEY } from "astro:env/server";

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const res = await sendEmail({
            to: '<correo>',
            subject: `Confirmación de tu pedido #ORD-8721`,
            body: `<p>Gracias por tu compra!</p>`,
            subscribed: false,
            name: 'SneakersChile',
            from: 'receipt@<domain>',
            reply: 'support@<domain>',
            headers: {}
        }, PLUNK_API_KEY)

        return Response.json(res.data, { status: res.status });
    } catch (error) {
        console.error('Error en el procesamiento del correo:', error);
        return Response.json({ 
            error: 'Error al procesar la solicitud de envío de correo',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}