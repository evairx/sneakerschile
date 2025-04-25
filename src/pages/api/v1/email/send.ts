import { sendEmail } from "sneakerschile-utils/sendEmail";

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const res = await sendEmail({
            to: '<correo>',
            subject: '<asunto>',
            body: `<html>`,
            subscribed: false,
            name: 'SneakersChile',
            from: 'receipt@evairx.me',
            reply: 'support@evairx.me',
            headers: {}
        }, "token")

        return Response.json(res.data, { status: res.status });
    } catch (error) {
        console.error('Error en el procesamiento del correo:', error);
        return Response.json({ 
            error: 'Error al procesar la solicitud de envío de correo',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}