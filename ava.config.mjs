export default {
  failFast: true,
  files: [
    'src/**/*.test.mjs',
    'lib/**/*.test.mjs',
  ],
  require: [
    './test/ava-setup.mjs',
  ],
}
