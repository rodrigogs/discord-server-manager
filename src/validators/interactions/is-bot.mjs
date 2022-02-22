const defaultOptions = {
  shouldBeABot: false,
}

export default (options = defaultOptions) => (interaction) => {
  const {
    shouldBeABot,
  } = options

  const isBot = interaction.user.bot
  if (shouldBeABot) {
    return !!isBot
  }

  return !isBot
}
