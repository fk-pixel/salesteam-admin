import { Image as NextImg } from 'next/image';
import { urlFor } from '../../../sanity/utils/client';

const Image = (imageSrc) => {
  return (
    <div>
      <NextImg src={urlFor(imageSrc).url()} />
    </div>
  );
};

export default Image;
