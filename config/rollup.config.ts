import babel from '@rollup/plugin-babel';
import {uglify} from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import dts  from 'rollup-plugin-dts'
import { RollupOptions } from 'rollup';

export default [{
  input: 'src/index.ts',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
    filesize()
  ],
  dest: 'dist/swwu.min.js',
  sourceMap: true
},
// {
//   // 生成 .d.ts 类型声明文件
//   input: './src/index.d.ts',
//   output: {
//     file: 'dist/types/index.d.ts',
//     format: 'es',
//   },
//   plugins: [dts()],
// }
] as RollupOptions