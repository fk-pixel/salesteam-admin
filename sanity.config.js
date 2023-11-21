/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\pages\studio\[[...index]].jsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import schemas from './sanity/schemas';

export default defineConfig({
  basePath: '/studio',
  projectId: 'veclq2f6', //process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production', //process.env.NEXT_PUBLIC_SANITY_DATASET,
  title: 'SalesTeam API',
  token:
    'skNsWWZEMhtwAtiVBrLXHonDESLvBbj1IUEaovZfsE35sG2flK6pw9mEtqFoqJ2hyAdywVNCP0xz4bqhlCt7mb4moplZ7wl5zNOFg6KAvz3S9WVWKabsQZjgVByoZny3BG5dBm6cPMxkhpiXBJ6N9RIi9w5Mp2qLj89z6lPmC8Puie1yVAm7', //process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false, //true, //process.env.NODE_ENV === 'production',
  schema: { types: schemas },
  plugins: [
    deskTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // visionTool({ defaultApiVersion: apiVersion }),
    visionTool(),
  ],
});
