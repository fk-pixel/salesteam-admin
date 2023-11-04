import { urlFor } from '../../../sanity/utils/client';

const Image = (imageSrc) => {
  return (
    <div>
      <img src={urlFor(imageSrc).url()} />
    </div>
  );
};

export default Image;
