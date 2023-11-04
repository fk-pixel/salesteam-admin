import React from 'react';
import { StrictMode } from 'react';
import Router from 'next/router';
import { createRoot } from 'react-dom/client';
import MyApp from './_app';

export default function Index() {
  React.useEffect(() => {
    Router.push('/auth/login');
  });
  return <div />;
  // const rootElement = document.getElementById('root');

  // const root = createRoot(rootElement);

  // root.render(
  //   <StrictMode>
  //     <MyApp />
  //   </StrictMode>,
  // );
}
