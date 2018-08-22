import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'server.js',
    // file: 'dist/geotiff-server.js',
    format: 'cjs'
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
      exclude: [ 'node_modules/geotiff/**' ],
      ignore: [ 'conditional-runtime-dependency' ]
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
