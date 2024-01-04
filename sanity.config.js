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
  dataset: 'production',
  title: 'SalesTeam API',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false, //process.env.NODE_ENV === 'production',
  schema: { types: schemas },
  plugins: [
    deskTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // visionTool({ defaultApiVersion: apiVersion }),
    visionTool(),
  ],
});
