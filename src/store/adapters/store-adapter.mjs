export default class StoreAdapter {
  #options = {}

  constructor (options = {}) {
    this.#options = Object.freeze(options)
  }

  get options () {
    return this.#options
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
  async set (partition, key, value, options = {}) {
    throw new Error('Not implemented')
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
  async get (partition, key, options = {}) {
    throw new Error('Not implemented')
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
    throw new Error('Not implemented')
  }
}
