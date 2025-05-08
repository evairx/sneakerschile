export const paymentMethods = [
    {
        id: "1",
        name: "webpay",
        label: "Webpay",
        images: [
            'https://assets-prod.evairx.me/visa.svg',
            'https://assets-prod.evairx.me/mastercard.svg',
            'https://assets-prod.evairx.me/american_express.svg',
            'https://assets-prod.evairx.me/diners_club.svg',
        ],
        fee: {
            iva: 0.19,
            comision: 0.0319
        }
    },
    {
        id: "3",
        name: "transfer",
        label: "Transferencia Bancaria",
    }
]