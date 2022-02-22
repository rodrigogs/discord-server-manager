import textValidator from './_text.mjs'

export default (userTag) => (message) =>
  textValidator({ exact: userTag })(message.author.tag)
