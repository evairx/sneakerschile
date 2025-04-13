import { defineAction } from 'astro:actions';
import { generarURLPagoFalsa } from '@/const/generateUrlPay';
import { z } from 'astro:schema';

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    async handler({ name }) {
      return {
        data: name
      };
    },
  }),
  generateUrlPay: defineAction({
    input: z.object({
      price: z.number(),
    }),
    async handler(){
      return {
        url: await generarURLPagoFalsa()
      }
    }
  })
};