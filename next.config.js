const { client } = require('./sanity/utils/client');

const plugin = (opts = {}) => {
  // eslint-disable-next-line no-undef
  checkOpts(opts);
  return {
    postcssPlugin: 'postcss-dark-theme-class',
    AtRule(atRule) {
      if (atRule.every((child) => child.selector !== '.test')) {
        atRule.append({ selector: '.test' });
      }
    },
  };
};

plugin.postcss = true;

// get redirects from Sanity for Vercel
async function fetchSanityRedirects() {
  const redirectData = await client.fetch(`
    *[_type == "redirect"]{
      "source": "/" + from,
      "destination": "/" + to,
      "permanent": isPermanent
    }
  `);

  return redirectData;
}

module.exports = {
  async redirects() {
    const sanityRedirects = await fetchSanityRedirects();
    return sanityRedirects;
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
    removeConsole: false,
  },
  images: {
    unoptimized: true,
    // domains: ['cdn.sanity.io', 'drive.google.com'],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "**",
    //   },
    // ],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'drive.google.com',
    //     port: '',
    //     pathname: '/file/d/**',
    //   },
    // ],
  },
};
