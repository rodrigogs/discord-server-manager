import test from 'ava'
import os from 'os'
import path from 'path'
import Store from './index.mjs'
import FsAdapter from './adapters/fs.mjs'

test('Should sucessfully store and retrieve a value from the store', async t => {
  t.plan(1)

  const partition = 'test'
  const key = 'key'
  const value = 'value'

  const adapter = new FsAdapter({ path: path.join(os.tmpdir(), 'store') })
  const store = new Store(adapter)

  await store.set(partition, key, value)

  const result = await store.get(partition, key)
  t.is(result, value)
})

test('Should create and delete a partition key', async t => {
  t.plan(1)

  const partition = 'test'
  const key = 'key'
  const value = 'value'

  const adapter = new FsAdapter({ path: path.join(os.tmpdir(), 'store') })
  const store = new Store(adapter)

  await store.set(partition, key, value)
  await store.del(partition, key)

  const result = await store.get(partition, key)
  t.is(result, undefined)
})

test('Should list populate and list a partition', async t => {
  t.plan(8)

  const partitions = [
    {
      name: 'test',
      keys: ['key1', 'key2', 'key3'],
    },
    {
      name: 'test2',
      keys: ['key4', 'key5', 'key6'],
    },
  ]

  const adapter = new FsAdapter({ path: path.join(os.tmpdir(), 'store') })
  const store = new Store(adapter)

  for (const partition of partitions) {
    for (const key of partition.keys) {
      await store.set(partition.name, key, key)

      const stored = await store.get(partition.name, key)
      t.is(stored, key)
    }

    const result = await store.list(partition.name)
    t.deepEqual(result, partition.keys)
  }
})
