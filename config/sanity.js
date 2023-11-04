import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from '../sanity/schemas';
import { visionTool } from '@sanity/vision';

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'SalesTeam API',
  apiVersion: '2023-06-26',
  //jwt_secret: process.env.JWT_SECRET,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: { types: schemas },
  useCdn: process.env.NODE_ENV === 'production',
});

export default config;

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
// export const urlFor = (source) => builder.image(source);

// Set up the client for fetching data in the getProps page functions
// export const sanityClient = createClient(config);

// export const client = createClient(config);

// const builder = imageUrlBuilder(client);

// export const urlFor2 = (source) => builder.image(source);

//import imageUrlBuilder from "@sanity/image-url";
