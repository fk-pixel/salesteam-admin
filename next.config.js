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

// module: {
//   {
//     test: /\.js(x?)$/,
//     exclude: /node_modules/,
//     loader: 'babel-loader'
//   },
//  {
//     test: /\.(scss|sass)$/,
//     loader: ExtractTextPlugin.extract(
//       'style-loader',
//       'css-loader?importLoaders=1',
//       'sass-loader',
//       'postcss-loader',
//     ),
//   },
//   {
//     test: /\.css$/,
//     loaders: [
//       'style-loader',
//       'css-loader?importLoaders=1',
//       'postcss-loader',
//     ],
//   },
// }

// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// const execSync = require('child_process').execSync;
// const lastCommitCommand = 'git rev-parse HEAD';
// const buildId = execSync(lastCommitCommand).toString().trim();

module.exports = {
  // // fix for https://github.com/vercel/next.js/issues/18389
  // // https://zegons.atlassian.net/browse/BF-1455
  // async generateBuildId() {
  //   return buildId;
  // },
  // env: {
  //   // Inject process.env.BUILD_ID which is then added to the <body>
  //   BUILD_ID: buildId,
  // },
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
