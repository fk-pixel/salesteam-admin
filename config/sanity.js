import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from '../sanity/schemas';
import { visionTool } from '@sanity/vision';

const config = defineConfig({
  projectId: 'veclq2f6', //process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  title: 'SalesTeam API',
  apiVersion: '2023-06-26',
  token:
    'skNsWWZEMhtwAtiVBrLXHonDESLvBbj1IUEaovZfsE35sG2flK6pw9mEtqFoqJ2hyAdywVNCP0xz4bqhlCt7mb4moplZ7wl5zNOFg6KAvz3S9WVWKabsQZjgVByoZny3BG5dBm6cPMxkhpiXBJ6N9RIi9w5Mp2qLj89z6lPmC8Puie1yVAm7', //process.env.NEXT_PUBLIC_SANITY_TOKEN,
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: { types: schemas },
  useCdn: false, //true, //process.env.NODE_ENV === 'production',
});

export default config;

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
