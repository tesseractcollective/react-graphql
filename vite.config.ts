import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import ts from 'rollup-plugin-typescript2';

export default defineConfig({
  plugins: [reactRefresh(), 
    // tsconfigPaths()
    {
      apply: 'build',
      ...ts({
        tsconfig: './tsconfig-web.build.json',
        useTsconfigDeclarationDir: true
      }),
    },
  ],
  esbuild: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index'),
      name: 'react-graphql',
      fileName: (format) => `react-graphql.${format}.js`
    },
    emptyOutDir: true,
    minify: false,
    watch: {},
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'urql',
        'react-loading',
      ],
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'], //This takes into account priority, so it will resolve a .web.tsx of the same file name before a .tsx if it exists
  },
});
