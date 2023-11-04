import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import config from '../../config/sanity';

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
