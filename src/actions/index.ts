import { defineAction } from 'astro:actions';
import { FLOW_APIKEY, FLOW_SECRET } from 'astro:env/server';
import { z } from 'astro:schema';
import Flow from '@evairx/flow'

export const server = {
  pay: defineAction({
    async handler({ email }) {
      const flow = new Flow({
        apiKey: FLOW_APIKEY,
        secretKey: FLOW_SECRET,
        production: false
      });

      const data = await flow.create({
        subject: "Test Payment",
        amount: 60000,
        email: email,
        urlConfirmation: "https://your-website/confirm",
        urlReturn: "https://your-website/results",
        commerceOrder: "1234567890",
        currency: "CLP",
        optional: {
          buyerName: "Cliente de Prueba",
          orderItems: JSON.stringify([
            { name: "Air Force 1", price: 60000, quantity: 1 }
          ])
        }
      })

      console.log(data)
      return {
        data: data,
      };
    },
  })
};