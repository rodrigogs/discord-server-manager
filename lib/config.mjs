/* eslint-disable no-process-env */
import dotenv from 'dotenv'

dotenv.config()

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export const LOGS_DIR = process.env.LOGS_DIR || '.logs'
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
export const STORE_ADAPTER = process.env.STORE_ADAPTER || 'fs'
