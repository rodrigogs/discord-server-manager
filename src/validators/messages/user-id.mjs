import textValidator from './_text.mjs'

export default (userId) => ({ message }) =>
  textValidator({ exact: userId })(message.author.id)
