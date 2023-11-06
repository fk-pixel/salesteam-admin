const plugin = (opts = {}) => {
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

module.exports = {
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
