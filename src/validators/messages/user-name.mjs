import textValidator from './_text.mjs'

export default (userName) => (message) =>
  textValidator({ exact: userName })(message.author.username)
