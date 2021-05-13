const flow = require('esbuild-plugin-flow');

//build-web
require('esbuild').build({
  entryPoints: ['./index.ts'],
  bundle: true,
  outfile: './web/bundle.js',
  tsconfig: './tsconfig.json',
  define: {'process.env.NODE_ENV': '"production"', '__DEV__': false, global:'window'},
  resolveExtensions: ['.web.tsx','.web.ts','.web.jsx','.web.js','.tsx','.ts','.jsx','.js'],
  loader: {".png": "file", ".ttf": "file", ".js": "jsx" },
  minify: true,
  sourcemap: true,
  plugins: [
    // flow(/node_modules\\react-native-gesture-handler.*\.jsx?$/),
    flow(/node_modules\\react-native.*\.jsx?$/)
  ]
}).catch(() => process.exit(1))

// esbuild --bundle ./src/index.ts --outfile=./web/bundle.js --resolve-extensions=.web.tsx,.web.ts,.web.jsx,.web.js,.tsx,.ts,.jsx,.js --loader:.js=jsx '--define:process.env.NODE_ENV="production"' --tsconfig=tsconfig.json --minify --sourcemap