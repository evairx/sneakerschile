import { defineConfig, envField  } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import preact from '@astrojs/preact';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  env: {
    schema: {
      DB_URL: envField.string({ context: 'server', access: 'secret' }),
      DB_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    }
  },
  integrations: [tailwind(), preact()],
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'cloudflare'
  }),
});