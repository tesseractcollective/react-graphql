const flow = require('esbuild-plugin-flow');

// esbuild --bundle ./src/index.ts --outfile=./web/bundle.js --resolve-extensions=.web.tsx,.web.ts,.web.jsx,.web.js,.tsx,.ts,.jsx,.js --loader:.js=jsx '--define:process.env.NODE_ENV="production"' --tsconfig=tsconfig.json --minify --sourcemap


//build-web
require('esbuild').build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  target: ['es2017'],
  format: 'esm',
  outfile: './dist/src/index.js',
  tsconfig: './tsconfig-web.json',
  define: {'process.env.NODE_ENV': '"production"', '__DEV__': false, global:'window'},
  resolveExtensions: ['.web.tsx','.web.ts','.web.jsx','.web.js','.tsx','.ts','.jsx','.js'], //This takes into account priority, so it will resolve a .web.tsx of the same file name before a .tsx if it exists
  loader: {".png": "file", ".ttf": "file", ".js": "jsx" },
  minify: false,
  sourcemap: true,
  external: ['react-native', 'react', 'react-dom', 'react-native-web', 'react-scripts', 'urql', 'jotai', 'graphql', 'graphql-tag'],
  plugins: [
    // flow(/node_modules\\react-native-gesture-handler.*\.jsx?$/),
    flow(/node_modules\\react-native.*\.jsx?$/)
  ]
}).catch(() => process.exit(1))