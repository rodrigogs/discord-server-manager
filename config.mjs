/* eslint-disable no-process-env */
import dotenv from 'dotenv'

dotenv.config()

/**
 * Discord bot token
 */
export const TOKEN = process.env.TOKEN

/**
 * Bot settings
 */
// Age verification settings
export const AGE_VERIF_ENABLED = String(process.env.AGE_VERIF_ENABLED).toLowerCase() === 'true'
export const AGE_VERIF_OVER_18_ROLE = process.env.AGE_VERIF_OVER_18_ROLE
export const AGE_VERIF_UNDER_18_ROLE = process.env.AGE_VERIF_UNDER_18_ROLE
