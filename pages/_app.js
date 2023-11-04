import React from 'react';
import Head from 'next/head';
import '../styles/style.scss';
import { ToastContainer } from '../src/toast/nexttoast';
import 'react-toastify/dist/ReactToastify.min.css';
import Portal from '../src/common/Portal/portal';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import theme from '../styles/Theme';

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  const content = <Component {...pageProps} />;

  return (
    <>
      <Head>
        <title>Sales Team Dashboard</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
          // httpEquiv="Content-Security-Policy"
          // content="upgrade-insecure-requests"
          //content="Sales Team Dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme} />
      <CssBaseline />
      <Layout>
        <ToastContainer position="bottom-right" newestOnTop />
        <Portal content={content} />
      </Layout>
    </>
  );
}

export default MyApp;
