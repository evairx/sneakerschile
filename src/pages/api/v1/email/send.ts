import { sendEmail } from "sneakerschile-utils/sendEmail";
import { PLUNK_API_KEY } from "astro:env/server";

export const prerender = false;

type OrderItem = {
  name: string;
  quantity: number;
  size: number;
  price: number;
  image: string;
};

type OrderData = {
  orderId: string;
  items: OrderItem[];
  payment: string;
  shipping: string;
  subtotal: number;
  shippingPrice: number;
  taxes: number;
  total: number;
  date?: string;
};

type EmailRequest = {
  to: string;
  order: OrderData;
};

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const data = await request.json() as EmailRequest;
        
        if (!data.to || !data.order) {
            return Response.json({ 
                error: 'Datos incompletos',
                details: 'Se requiere el email del destinatario y los datos del pedido'
            }, { status: 400 });
        }

        const { order } = data;
        const orderDate = order.date || new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const formatPrice = (price: number): string => {
            return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        const orderItemsHtml = order.items.map(item => `
            <tr>
              <td width="25%" valign="top" style="padding-right: 12px;">
                <img src="${item.image}" width="100%" style="border-radius: 4px;" alt="${item.name}" />
              </td>
              <td width="75%" valign="top">
                <p style="font-size: 16px; font-weight: bold; color: #111827; margin: 0;">${item.name}</p>
                <p style="font-size: 14px; color: #6b7280; margin: 4px 0;">Cantidad: ${item.quantity} - Talla: ${item.size}</p>
                <p style="font-size: 16px; font-weight: bold; color: #111827; margin: 8px 0 0;">${formatPrice(item.price)}</p>
              </td>
            </tr>
            ${order.items.length > 1 ? '<tr><td colspan="2" style="padding: 10px 0;"></td></tr>' : ''}
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html lang="es" xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Confirmación de Pedido</title>
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
                <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f3f4f6;
                    font-family: 'Lato', Arial, sans-serif;
                }
                table {
                    border-spacing: 0;
                }
                img {
                    display: block;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 20px;
                }
                .section {
                    margin-bottom: 24px;
                }
                .text-center {
                    text-align: center;
                }
                .text-gray {
                    color: #6b7280;
                }
                .text-dark {
                    color: #111827;
                }
                .divider {
                    border-top: 1px solid #d1d5db;
                    margin: 16px 0;
                }
                </style>
            </head>
            <body>
                <center>
                <table width="100%" bgcolor="#f3f4f6" cellpadding="0" cellspacing="0">
                    <tr>
                    <td>
                        <table class="container" cellpadding="0" cellspacing="0">
                        <!-- Header -->
                        <tr>
                            <td bgcolor="#000000" style="padding: 24px; border-radius: 8px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px;">SNEAKERSCHILE</h1>
                            <p style="margin: 8px 0 0; color: #ffffff; font-size: 18px;">¡Gracias por su compra!</p>
                            </td>
                        </tr>

                        <!-- Order Info -->
                        <tr>
                            <td class="section">
                            <p style="font-size: 16px; color: #374151;">
                                Tu pedido <strong>#ORD-${order.orderId}</strong> ha sido confirmado y está siendo procesado.
                            </p>
                            <p style="font-size: 14px; color: #6b7280;">Fecha de pedido: ${orderDate}</p>
                            <div class="divider"></div>
                            </td>
                        </tr>

                        <!-- Order Item -->
                        <tr>
                            <td class="section">
                            <h2 style="font-size: 18px; color: #111827; margin-bottom: 16px;">Detalle de tu pedido</h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                ${orderItemsHtml}
                            </table>
                            <div class="divider"></div>
                            </td>
                        </tr>

                        <!-- Resumen del pedido -->
                        <tr>
                            <td class="section">
                            <h2 style="font-size: 18px; color: #111827; margin-bottom: 16px;">Resumen de tu pedido</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
                                <tr>
                                <td width="50%" style="font-size: 14px; color: #374151; padding: 4px 0;">Método de pago:</td>
                                <td width="50%" style="font-size: 14px; color: #111827; font-weight: 500; padding: 4px 0; text-align: right;">${order.payment}</td>
                                </tr>
                                <tr>
                                <td width="50%" style="font-size: 14px; color: #374151; padding: 4px 0;">Método de envío:</td>
                                <td width="50%" style="font-size: 14px; color: #111827; font-weight: 500; padding: 4px 0; text-align: right;">${order.shipping}</td>
                                </tr>
                                <tr>
                                <td width="50%" style="font-size: 14px; color: #374151; padding: 4px 0;">Subtotal:</td>
                                <td width="50%" style="font-size: 14px; color: #111827; padding: 4px 0; text-align: right;">${formatPrice(order.subtotal)}</td>
                                </tr>
                                <tr>
                                <td width="50%" style="font-size: 14px; color: #374151; padding: 4px 0;">Envío:</td>
                                <td width="50%" style="font-size: 14px; color: #111827; padding: 4px 0; text-align: right;">${formatPrice(order.shippingPrice)}</td>
                                </tr>
                                <tr>
                                <td width="50%" style="font-size: 14px; color: #374151; padding: 4px 0;">Impuestos:</td>
                                <td width="50%" style="font-size: 14px; color: #111827; padding: 4px 0; text-align: right;">${formatPrice(order.taxes)}</td>
                                </tr>
                                <tr>
                                <td width="50%" style="font-size: 16px; font-weight: bold; color: #111827; padding: 4px 0;">Total:</td>
                                <td width="50%" style="font-size: 16px; font-weight: bold; color: #111827; padding: 4px 0; text-align: right;">${formatPrice(order.total)}</td>
                                </tr>
                            </table>
                            </td>
                        </tr>

                        <!-- Call to action -->
                        <tr>
                            <td class="section text-center">
                            <p style="font-size: 14px; color: #374151;">Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
                            <p style="font-size: 14px; color: #374151;">¡Gracias por comprar en SneakersChile!</p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td>
                            <div class="divider"></div>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding-bottom: 16px;">
                            <table align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="font-size: 12px; color: #6b7280; text-align: center; padding-bottom: 8px;">
                                    SneakersChile, Santiago, Chile
                                </td>
                                </tr>
                                <tr>
                                <td style="font-size: 12px; color: #6b7280; text-align: center; padding-bottom: 8px;">
                                    © ${new Date().getFullYear()} SneakersChile. Todos los derechos reservados.
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>

                        </table>
                    </td>
                    </tr>
                </table>
                </center>
            </body>
            </html>
        `;

        const res = await sendEmail({
            to: data.to,
            subject: `Pedido SneakersChile #ORD-${order.orderId}`,
            body: html,
            subscribed: false,
            name: 'SneakersChile',
            from: 'receipt@evairx.me',
            reply: 'support@evairx.me',
            headers: {}
        }, PLUNK_API_KEY);

        return Response.json(res.data, { status: res.status });
    } catch (error) {
        console.error('Error en el procesamiento del correo:', error);
        return Response.json({ 
            error: 'Error al procesar la solicitud de envío de correo',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}