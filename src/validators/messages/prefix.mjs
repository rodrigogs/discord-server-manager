import textValidator from './_text.mjs'

export default (prefix) => ({ message }) => {
  if (prefix instanceof Array) {
    return prefix.some(p => textValidator({ startsWith: p })(message.content))
  }
  return textValidator({ startsWith: prefix })(message.content)
}
