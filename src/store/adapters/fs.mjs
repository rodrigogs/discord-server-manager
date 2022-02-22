import path from 'path'
import fs from 'fs/promises'

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

export default class FsAdapter {
  #options = {}

  constructor (options = { path: './.store' }) {
    this.#options = options
  }

  /**
   * Sets a value in a store partition.
   *
   * @param {String|Number} partition The partition to store the key in
   * @param {String|Number} key The key to store must be unique.
   * Each key is stored in a separate partition and will be only accessible by that partition.
   * If you want to store an object, use JSON.stringify.
   * Use undefined to delete the key.
   * @param {String|String[]|Object|Object[]} value The value to be stored.
   * @param {Object} [options = {}] Set operation options. Not used in this adapter.
   * @returns {Promise<void>}
   */
  async set (partition, key, value, _options = {}) {
    await ensurePartition(this.#options.path, partition)
    const filePath = path.join(this.#options.path, partition, key)
    if (value === undefined) return await fileExists(filePath) && fs.unlink(filePath)
    return fs.writeFile(filePath, JSON.stringify(value))
  }

  /**
   * Gets a value from a store partition.
   * If the key is not found, it returns undefined.
   *
   * @param {String|Number} partition The partition to get the key from
   * @param {String|Number} key The key to get
   * @param {Object} [options = {}] Get operation options. Not used in this adapter.
   * @returns {Promise<String|String[]|Object|Object[]>}
   */
  async get (partition, key, _options = {}) {
    await ensurePartition(this.#options.path, partition)
    return getValue(this.#options.path, partition, key)
  }

  /**
   * Lists all keys in a store partition.
   * If the partition does not exist, it returns an empty array.
   *
   * @param {String|Number} partition The partition to list keys from
   * @param {Object} [options = {}] List operation options. Not used in this adapter.
   * @param {String|Number} [options.keysStartingWith] Only list keys starting with this string.
   * @param {String|Number} [options.keysEndingWith] Only list keys ending with this string.
   * @returns {Promise<String[]>}
   */
  async list (partition, options = {}) {
    await ensurePartition(this.#options.path, partition)
    const partitionPath = path.join(this.#options.path, partition)
    const files = await fs.readdir(partitionPath)
    const filteredFiles = files.filter((file) => {
      if (options.keysStartingWith && !file.startsWith(options.keysStartingWith)) return false
      if (options.keysEndingWith && !file.endsWith(options.keysEndingWith)) return false
      return true
    })
    return filteredFiles
  }
}
