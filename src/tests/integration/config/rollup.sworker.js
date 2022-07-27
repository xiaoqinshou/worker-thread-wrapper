import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
// import { uglify } from 'rollup-plugin-uglify'
// import json from '@rollup/plugin-json'

export default {
  input: './src/tests/integration/config/importWorker.ts',
  output: {
    file: './src/tests/integration/config/sworker.js',
    format: 'cjs',
  },
  plugins: [
    resolve(), // 解析node_modules
    typescript({ tsconfig: './tsconfig.json' }), // 解析TypeScript
    commonjs({
      'namedExports': {
        './src/tests/integration/config/importWorker.ts': ['WorkerBuilder']
      }
    }),  // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    // getBabelOutputPlugin({
    //   presets: [["@babel/preset-env", {
    //     "modules": false,
    //     "useBuiltIns": "usage",
    //     "corejs": "3.6.5",
    //     "browserslistEnv": "cover 99.5%"
    //   }]]
    // }), // 将ts 打包好的 最新版的es代码 转为适配市面上 百分之99.5%浏览器的 es5代码
    getBabelOutputPlugin({
      presets: ["@babel/preset-env"]
    }), // 默认配置 转es5
    // babel({ babelHelpers: 'bundled' }), // ts编译好的最新版的es代码 没执行转换为es5
    // json(),
    // uglify(),
    filesize()
  ]
}
