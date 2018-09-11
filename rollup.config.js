import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

export default {
  input: 'src/index.js',
  output: {
    file: 'server.js',
    format: 'cjs',
    sourcemap: 'inline'
  },
  external: ['http', 'fs', 'util', 'querystring', 'string_decoder', 'https', 'url', 'stream', 'events', 'path', 'net', 'buffer', 'tty', 'zlib', 'crypto'],
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**', 'geotiff/**']
  },
  plugins: [
    json(),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      preferBuiltins: true
    }),
    commonjs({
      include: 'node_modules/**',
      ignore: [ 'conditional-runtime-dependency' ]
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
