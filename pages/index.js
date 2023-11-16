import React from 'react';

import { useRouter } from 'next/router';

export default function Index() {
  //Router.push('/auth/login');
  const router = useRouter();
  React.useEffect(() => {
    router.push('/auth/login');
  });

  // return (
  //   <span
  //     onClick={function () {
  //       router.push('/auth/login');
  //     }}
  //   ></span>
  // );
  // const rootElement = document.getElementById('root');

  // const root = createRoot(rootElement);

  // root.render(
  //   <StrictMode>
  //     <MyApp />
  //   </StrictMode>,
  // );
}
