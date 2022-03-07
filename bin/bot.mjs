#!/usr/bin/env node

import bot from 'bot/bot.mjs';
import logger from 'lib/logger.mjs'

bot()
  .then(() => {
    logger.info('Bot is running')
  })
  .catch((err) => {
    logger.error('Bot failed to start')
    logger.error(err)
    console.error(err)
  })
