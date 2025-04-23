import { createPayment } from '@evairx/flow/services/createPayment';
import type { PaymentParams } from '@evairx/flow/services/types/payments';
import config from '@evairx/flow/config';

interface FlowConfig {
    apiKey: string;
    secretKey: string;
    apiUrl: string;
}

interface FlowConstructorParams {
    apiKey?: string;
    secretKey?: string;
    production?: boolean;
}

class Flow {
    private readonly config: FlowConfig;

    constructor({ apiKey, secretKey, production }: FlowConstructorParams) {
        if (!apiKey) throw new Error('apiKey is required');
        if (!secretKey) throw new Error('secretKey is required');

        this.config = {
            apiKey,
            secretKey,
            apiUrl: production ? config.production : config.sandbox,
        };
    }

    async create(paymentData:PaymentParams): Promise<unknown> {
        return await createPayment(this.config, paymentData);
    }
}

export default Flow;