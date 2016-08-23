import buble       from 'rollup-plugin-buble'
import commonjs    from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify      from 'rollup-plugin-uglify'

export default {
  entry: 'index.js',
  format: 'cjs',
  plugins: [
    commonjs(),
    nodeResolve({
      browser: true,
      jsnext:  true
    }),
    buble(),
    uglify({ mangle: true, compress: true })
  ]
}
