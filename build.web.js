const flow = require('esbuild-plugin-flow');
const alias = require('esbuild-plugin-alias');

// esbuild --bundle ./src/index.ts --outfile=./web/bundle.js --resolve-extensions=.web.tsx,.web.ts,.web.jsx,.web.js,.tsx,.ts,.jsx,.js --loader:.js=jsx '--define:process.env.NODE_ENV="production"' --tsconfig=tsconfig.json --minify --sourcemap

//build-web
require('esbuild')
  .build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    target: ['chrome', 'firefox','edge', 'safari'],
    format: 'iife',
    outdir: './dist/src/index.js',
    tsconfig: './tsconfig-web.json',
    define: { 'process.env.NODE_ENV': '"production"', __DEV__: false, global: 'window' },
    resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'], //This takes into account priority, so it will resolve a .web.tsx of the same file name before a .tsx if it exists
    loader: { '.png': 'file', '.ttf': 'file', '.js': 'jsx' },
    minify: false,
    sourcemap: true,
    external: [
      'react-native',
      'react',
      'react-dom',
      'react-loading',
      'react-native-web',
      'react-native-web-ui-components',
      'react-scripts',
      'urql',
      'jotai',
      'graphql',
      'graphql-tag',
      'case',
      'react-data-table-component',
      'react-scroll-trigger',
      'styled-components',
      'lodash'
    ],
    plugins: [
      // flow(/node_modules\\react-native-gesture-handler.*\.jsx?$/),
      alias({
        'react-native': require.resolve('react-native-web'),
      }),
    ],
  })
  .catch(() => process.exit(1));
