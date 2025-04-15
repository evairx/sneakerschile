import { defineAction } from 'astro:actions';
import { selectedShipping } from '@/stores/checkout';
import { z } from 'astro:schema';

export const server = {
  pay: defineAction({
    async handler() {
      const shipment = selectedShipping.get();
      console.log(shipment)
      return {
        data: shipment,
      };
    },
  })
};