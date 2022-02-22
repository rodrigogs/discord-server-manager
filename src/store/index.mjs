import Adapters from './adapters/index.mjs'
import { STORE_ADAPTER } from '../config.mjs'

export default class Store {
  #adapter = null

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
}

export const store = new Store()
