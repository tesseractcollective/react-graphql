import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index'),
      name: 'react-graphql',
      fileName: (format) => `react-graphql.${format}.js`,
    },
    sourcemap: 'inline',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'react-data-table-component',
        'react',
        'react-dom',
        'urql',
        'react-scroll-trigger',
        'react-loading',
      ],
      output: {
        globals: {
          react: 'React',
          'react-data-table-component': 'DataTable',
          'urql': 'urql',
          'react-loading': 'ReactLoading',
          'react-dom': 'ReactDom'
        }
      }
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'], //This takes into account priority, so it will resolve a .web.tsx of the same file name before a .tsx if it exists
  },
});
