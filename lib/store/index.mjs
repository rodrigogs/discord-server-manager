import { STORE_ADAPTER } from 'lib/config.mjs'
import * as Adapters from './adapters/index.mjs'

export default class Store {
  #adapter = null

  /**
   * @param {import('./adapters/store-adapter.mjs')} [adapter=FsAdapter] Store adapter.
   */
  constructor (adapter = new Adapters[STORE_ADAPTER]()) {
    this.#adapter = adapter
  }

  async set (partition, key, value) {
    return this.#adapter.set(partition, key, value)
  }

  async get (partition, key) {
    return this.#adapter.get(partition, key)
  }

  async del (partition, key) {
    return this.#adapter.set(partition, key, undefined)
  }

  async list (partition) {
    return this.#adapter.list(partition)
  }
}

export const store = new Store()
