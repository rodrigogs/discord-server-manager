import textValidator from './_text.mjs'

export default (options) => (message) =>
  textValidator(options)(message.content)
