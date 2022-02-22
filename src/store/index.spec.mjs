import Store from './index.mjs'

describe('Store', () => {
  it('get() , set()', async () => {
    const partition = 'test'
    const key = 'key'
    const value = 'value'
    await new Store().set(partition, key, value)
    const result = await new Store().get(partition, key)
    expect(result).toBe(value)
  })
})
