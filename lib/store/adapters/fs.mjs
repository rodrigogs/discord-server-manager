import path from 'path'
import fs from 'fs/promises'
import StoreAdapter from './store-adapter.mjs'

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    return false
  }
}

/**
 * @param {String} dir Directory path.
 * @returns {Promise<void>}
 */
const ensureDir = (dir) => fs.access(dir)
  .catch((err) => {
    if (err.code !== 'ENOENT') throw err
    return fs.mkdir(dir, { recursive: true })
  })

/**
 * @param {String|Number} storePath Store base path.
 * @param {String|Number} partition Store partition name.
 * @param {String|Number} key Store key.
 * @return {Promise<void>} Store value.
 */
const ensurePartition = async (storePath, partition) => {
  const partitionPath = path.join(storePath, partition)
  await ensureDir(partitionPath)
  return partitionPath
}

/**
 * @param {String} storePath Store base path.
 * @param {*} partition Store partition name.
 * @param {*} key Store key.
 * @returns {Promise<String|String[]|Object|Object[]>} Store value.
 */
const getValue = async (storePath, partition, key) => {
  await ensurePartition(storePath, partition)
  const filePath = path.join(storePath, partition, key)
  let fileContent
  try {
    fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (err) {
    return fileContent
  }
}

export default class FsAdapter extends StoreAdapter {
  constructor (options = { path: './.store' }) {
    super(options)
  }

  async set (partition, key, value, _options = {}) {
    await ensurePartition(this.options.path, partition)
    const filePath = path.join(this.options.path, partition, key)
    if (value === undefined) return await fileExists(filePath) && fs.unlink(filePath)
    return fs.writeFile(filePath, JSON.stringify(value))
  }

  async get (partition, key, _options = {}) {
    await ensurePartition(this.options.path, partition)
    return getValue(this.options.path, partition, key)
  }

  async list (partition, options = {}) {
    await ensurePartition(this.options.path, partition)
    const partitionPath = path.join(this.options.path, partition)
    const files = await fs.readdir(partitionPath)
    const filteredFiles = files.filter((file) => {
      if (options.keysStartingWith && !file.startsWith(options.keysStartingWith)) return false
      if (options.keysEndingWith && !file.endsWith(options.keysEndingWith)) return false
      return true
    })
    return filteredFiles
  }
}
