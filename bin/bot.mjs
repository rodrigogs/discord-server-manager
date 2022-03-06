#!/usr/bin/env node

import { bot, logger } from 'main'

bot()
  .then(() => {
    logger.info('Bot is running')
  })
  .catch((err) => {
    logger.error('Bot failed to start')
    logger.error(err)
    console.error(err)
  })
