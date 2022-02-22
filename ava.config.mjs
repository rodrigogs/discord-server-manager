export default {
  files: [
    'src/**/*.test.mjs',
  ],
  failFast: true,
  require: [
    './test/ava-setup.mjs',
  ],
}
