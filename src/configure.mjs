import { Router, Store, modules } from 'main'

export default (client) => {
  const router = new Router(client, new Store())

  const keys = Object.keys(modules)
  for (const key of keys) {
    const module = modules[key]
    if (module instanceof Array) {
      router.addMessageRoutes(module)
    } else {
      router.addMessageRoute(module)
    }
  }
}
