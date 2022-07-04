import { controllerFactory } from './controllerFactory.js'
import { routerFactory } from './routerFactory.js'

const createApp = () => {
  const _main = {}
  const _router = {}

  const _hasRouter = () => _router.init && typeof _router.init === 'function'

  const setMain = ({ main }) => {
    Object.assign(_main, { ...main })
  }

  const setRouter = ({ router }) => {
    Object.assign(_router, routerFactory(router))
  }

  const init = () => {
    if (!Object.keys(_main).length) return
    for (const key in _main) {
      const module = _main[key]
      const controller = controllerFactory(module.controller())
      controller.setViewModel(module)
      controller.setChildren(module)
      controller.init()
    }

    if (_hasRouter()) _router.init()
  }

  return {
    setMain,
    setRouter,
    init
  }
}

export { createApp }
