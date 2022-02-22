const defaultOptions = {
  startsWith: false,
  contains: false,
  endsWith: false,
  exact: false,
}

export default (options = defaultOptions) => (text) => {
  const {
    startsWith,
    contains,
    endsWith,
    exact,
  } = options

  let valid = true
  if (exact) {
    valid = text === exact
  }

  if (startsWith) {
    valid = valid && text.startsWith(startsWith)
  }

  if (contains) {
    valid = valid && text.includes(contains)
  }

  if (endsWith) {
    valid = valid && text.endsWith(endsWith)
  }

  return valid
}
