import Head from 'next/head';
// eslint-disable-next-line import/no-unresolved
import { NextStudio } from 'next-sanity/studio';
// eslint-disable-next-line import/no-unresolved
import { metadata } from 'next-sanity/studio/metadata';
import config from '../../config/sanity';

export default function StudioPage() {
  return (
    <>
      <Head>
        {Object.entries(metadata).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>
      <NextStudio config={config} />
    </>
  );
}
