import { generateSignature } from '@evairx/flow/crypto/secret';
import type { Config, PaymentResponse, PaymentParams } from '@evairx/flow/services/types/payments';
import { validateNumber } from 'sneakerschile-utils/validate'

export const createPayment = async (config: Config, paymentData: PaymentParams): Promise<PaymentResponse> => {
  if (!config.apiKey || !config.secretKey || !config.apiUrl) {
    throw new Error('Missing required configuration parameters');
  }

  validateNumber(paymentData.amount)

  try {
    const generateId = () => `${Math.floor(20 + Math.random() * 10)}${Math.floor(400000 + Math.random() * 100000)}`;

    const params: Record<string, string> = {
        apiKey: config.apiKey,
        commerceOrder: paymentData.commerceOrder || generateId(),
        subject: paymentData.subject,
        currency: paymentData.currency || 'CLP',
        amount: validateNumber(paymentData.amount),
        email: paymentData.email,
        urlConfirmation: paymentData.urlConfirmation,
        urlReturn: paymentData.urlReturn,
        optional: JSON.stringify(paymentData.optional || {}),
    };

    const signature = await generateSignature(params, config.secretKey);

    const url = new URL(`${config.apiUrl}/payment/create`);
    const body = new URLSearchParams({
        ...params,
        s: signature
    }).toString();

    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Flow API error: ${response.status} - ${errorBody}`);
    }

    interface FlowApiResponse {
      url: string;
      token: string;
      flowOrder: string;
    }

    const data = await response.json() as FlowApiResponse;

    if (!data) {
      throw new Error('Empty response received from Flow API');
    }

    const res = {
        url: `${data.url}?token=${data.token}`,
        flowOrder: data.flowOrder
    }

    return {
        success: true,
        data: res
    };
  } catch (error) {
    return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};