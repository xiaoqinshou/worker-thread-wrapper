import { babel } from '@rollup/plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
  plugins: [
    resolve(), // 解析node_modules
    typescript(), // 解析TypeScript
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    uglify(),
    filesize()
  ],
  output: {
    file: 'dist/wtw.min.js',
    format: 'cjs',
    exports: 'auto',
    sourcemap: true
  }
}