import React from 'react';
import { useMediaQuery } from '@mui/material';

import bgImage from '../assets/images/bg/bgNew.svg';

export default function Auth({ children }) {
  const isNonMobile = useMediaQuery('(min-width:600px)');

  return (
    <>
      <main>
        <section
          style={{
            paddingTop: '7rem',
            width: '100%',
            height: '100%',
            //maxHeight: '100dvh',
          }}
        >
          <div
            style={{
              backgroundImage: isNonMobile ? `url(${bgImage.src})` : '',
              backgroundSize: 'cover' /* <------ */,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
            }}
          ></div>
          {children}
        </section>
      </main>
    </>
  );
}
