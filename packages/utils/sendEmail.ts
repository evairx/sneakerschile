type EmailData = {
  to: string;
  subject: string;
  body: string;
  name?: string;
  from?: string;
  reply?: string;
  subscribed?: boolean;
  headers?: Record<string, string>;
};

type EmailResponse = {
  data: any;
  status: number;
  success: boolean;
};

export async function sendEmail(emailData: EmailData, token: string): Promise<EmailResponse> {
  try {
    const sendEmailRequest = await fetch('https://api.useplunk.com/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        subscribed: emailData.subscribed ?? false,
        name: emailData.name ?? 'SneakersChile',
        from: emailData.from ?? 'receipt@evairx.me',
        reply: emailData.reply ?? 'support@evairx.me',
        headers: emailData.headers ?? {}
      })
    });

    const responseData = await sendEmailRequest.json();
    
    return {
      data: responseData,
      status: sendEmailRequest.status,
      success: sendEmailRequest.ok
    };
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    return {
      data: {
        error: 'Error al procesar la solicitud de envío de correo',
        details: error instanceof Error ? error.message : String(error)
      },
      status: 500,
      success: false
    };
  }
}