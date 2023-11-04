import createImageUrlBuilder from '@sanity/image-url';

import { dataset, projectId } from '../env';
import { buildFileUrl, buildImageUrl, parseAssetId } from '@sanity/asset-utils';
import { client } from '../utils/client';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlForImage = (source) => {
  return imageBuilder?.image(source).auto('format').fit('max');
};

export const buildURL = (asset) => {
  if (asset !== undefined) {
    const part = parseAssetId(asset?._ref);

    return buildImageUrl(part, { projectId, dataset });
  }
};

/* FETCHING BY URL EXAMPLE */
// productFile{asset->{url}},
