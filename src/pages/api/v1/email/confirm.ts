import { sendEmail } from "sneakerschile-utils/sendEmail";
import { PLUNK_API_KEY } from "astro:env/server";

export const prerender = false;

export async function POST({ params, request }: { params: any; request: Request }) {
    try {
        const html = `
        <!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <title>Compra nueva recibida</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #f9fafb; margin: 0; padding: 40px 0; font-family: sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <tr>
            <td>
              <h1 style="font-size: 28px; font-weight: bold; color: #111827; margin: 16px 0;">Nueva compra recibida</h1>
              <p style="font-size: 16px; color: #374151; margin: 16px 0;">
                <strong>María González</strong> acaba de realizar una compra en tu tienda. A continuación los detalles para procesar este pedido.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #eff6ff; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="font-size: 16px; color: #1d4ed8; font-weight: 500; margin: 0;">Orden #ORD-2025-04281 • 28 Abril, 2025</p>
            </td>
          </tr>

          <tr>
            <td style="border-bottom: 1px solid #e5e7eb; padding-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; margin-top: 0;">Productos comprados</h2>

              <table role="presentation" width="100%" style="border-collapse: collapse;">
                <tr>
                  <td width="70%" style="padding-bottom: 12px;">
                    <p style="font-size: 15px; color: #1f2937; font-weight: 500; margin: 0;">Zapatillas Minimalistas</p>
                    <p style="font-size: 13px; color: #6b7280; margin: 0;">SKU: ZAP-001</p>
                  </td>
                  <td width="15%" align="right" style="padding-bottom: 12px;">
                    <p style="font-size: 15px; color: #1f2937; margin: 0;">1x</p>
                  </td>
                  <td width="15%" align="right" style="padding-bottom: 12px;">
                    <p style="font-size: 15px; color: #1f2937; font-weight: 500; margin: 0;">$39.990</p>
                  </td>
                </tr>
                <tr>
                  <td width="70%" style="padding-bottom: 12px;">
                    <p style="font-size: 15px; color: #1f2937; font-weight: 500; margin: 0;">Polera Algodón Orgánico</p>
                    <p style="font-size: 13px; color: #6b7280; margin: 0;">SKU: POL-235</p>
                  </td>
                  <td width="15%" align="right" style="padding-bottom: 12px;">
                    <p style="font-size: 15px; color: #1f2937; margin: 0;">2x</p>
                  </td>
                  <td width="15%" align="right" style="padding-bottom: 12px;">
                    <p style="font-size: 15px; color: #1f2937; font-weight: 500; margin: 0;">$9.490</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="border-top: 1px dashed #e5e7eb; margin-top: 24px; padding-top: 16px;">
                <tr>
                  <td width="70%">
                    <p style="font-size: 15px; color: #1f2937; font-weight: bold; margin: 0;">Total</p>
                  </td>
                  <td width="30%" align="right">
                    <p style="font-size: 16px; color: #111827; font-weight: bold; margin: 0;">$58.970</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="border-bottom: 1px solid #e5e7eb; padding-top: 24px; padding-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; margin-top: 0;">Información del cliente</h2>
              <table role="presentation" width="100%" style="border-collapse: collapse;">
                <tr>
                  <td width="30%" style="font-size: 15px; color: #374151; padding: 8px 0;"><strong>Nombre:</strong></td>
                  <td width="70%" style="font-size: 15px; color: #111827; padding: 8px 0;">María Alejandra González Silva</td>
                </tr>
                <tr>
                  <td width="30%" style="font-size: 15px; color: #374151; padding: 8px 0;"><strong>Correo:</strong></td>
                  <td width="70%" style="font-size: 15px; color: #111827; padding: 8px 0;">maria@ejemplo.com</td>
                </tr>
                <tr>
                  <td width="30%" style="font-size: 15px; color: #374151; padding: 8px 0;"><strong>Método de pago:</strong></td>
                  <td width="70%" style="font-size: 15px; color: #111827; padding: 8px 0;">Webpay</td>
                </tr>
                <tr>
                  <td width="30%" style="font-size: 15px; color: #374151; padding: 8px 0;"><strong>Método de envío:</strong></td>
                  <td width="70%" style="font-size: 15px; color: #111827; padding: 8px 0;">Starken</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 24px;">
              <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; margin-top: 0;">Dirección de envío</h2>
              <p style="font-size: 15px; color: #1f2937; margin: 0;">Av. Los Pajaritos 3425, Depto 501, Maipú, Santiago</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top: 32px;">
              <a href="https://tutienda.cl/admin/orders" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; display: inline-block;">
                Gestionar pedido
              </a>
              <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">Este pedido requiere tu atención para ser procesado y enviado.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0;">© 2025 Tu Tienda. Todos los derechos reservados.</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Av. Principal 123, Santiago, Chile</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

        const res = await sendEmail({
            to: "akongamer14@gmail.com",
            subject: `Nueva compra recibida #ORD-32313`,
            body: html,
            subscribed: false,
            name: 'SneakersChile',
            from: 'receipt@evairx.me',
            reply: 'support@evairx.me',
            headers: {}
        }, PLUNK_API_KEY);

        return Response.json(res.data, { status: res.status });
    } catch (error) {
        console.error('Error al confirmar el correo', error)
        return Response.json({
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}