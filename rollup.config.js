import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

let targets = [
  { dest: 'dist/yuki-orienter.common.js', format: 'cjs' }
]

if (process.env.BUILD) {
  targets = targets.concat([
    { dest: 'dist/yuki-orienter.js', format: 'umd' },
    { dest: 'dist/yuki-orienter.es5.js', format: 'es' }
  ])
}

export default {
  entry: 'src/index.js',
  plugins: [buble(), nodeResolve(), commonjs()],
  moduleName: 'yuki-orienter',
  targets: targets
}
