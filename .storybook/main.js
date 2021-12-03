module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  webpackFinal: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web'
    };
    config.resolve.extensions = ['.web.tsx', '.native.tsx',  '.ts', '.tsx', '.web.js', '.mjs', '.js', '.json'];
    // mutate babel-loader
    // config.module.loaders
    //   ? config.module.loaders.push({
    //     test: /\.js|.ts|.tsx|.jsx$/,
    //     exclude: /node_modules/,
    //     loader: 'babel-loader?{ "stage": 0, "optional": ["runtime"] }',
    //   })
    //   : [
    //       {
    //         test: /\.js|.ts|.tsx|.jsx$/,
    //         exclude: /node_modules/,
    //         loader: 'babel-loader?{ "stage": 0, "optional": ["runtime"] }',
    //       },
    //     ],
    config.module.rules[0].use[0].options.plugins.push(['react-native-web', { commonjs: true }]);
    return config;
  },
};
