const flow = require('esbuild-plugin-flow');

// esbuild --bundle ./src/index.ts --outfile=./web/bundle.js --resolve-extensions=.web.tsx,.web.ts,.web.jsx,.web.js,.tsx,.ts,.jsx,.js --loader:.js=jsx '--define:process.env.NODE_ENV="production"' --tsconfig=tsconfig.json --minify --sourcemap

//build-native
require('esbuild').build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  target: ['es2017'],
  format: 'esm',
  outfile: './dist/src/index.js',
  tsconfig: './tsconfig-native.json',
  define: {'process.env.NODE_ENV': '"production"', '__DEV__': false},
  resolveExtensions: ['.tsx','.ts','.jsx','.js', '.web.tsx','.web.ts','.web.jsx','.web.js'], //prioritize non .web extensions
  loader: {".png": "file", ".ttf": "file", ".js": "jsx" },
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
    'graphql',
    'graphql-tag',
    'lodash',
    'jotai'
  ],
  plugins: [
    // flow(/node_modules\\react-native-gesture-handler.*\.jsx?$/),
    flow(/node_modules\\react-native.*\.jsx?$/)
  ]
}).catch(() => process.exit(1))

