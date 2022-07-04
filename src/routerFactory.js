import { controllerFactory } from './controllerFactory'

export const routerFactory = ({ routes = [] }) => {
  const _getFirst = () => {
    return routes.find((route) => route.isInitial)
  }

  const _getByHash = (hash) => {
    return routes.find((route) => route.regex.test(hash))
  }

  const _getDefault = () => {
    return routes.find((route) => route.isDefault)
  }

  const _redirect = (route) => {
    window.location.hash = route.hash
  }

  const _load = (route) => {
    const { module } = route

    const controller = controllerFactory(module.controller())
    controller.setViewModel(module)
    controller.setChildren({ ...module?.children })
    controller.init()
  }

  const init = () => {
    window.onhashchange = () => {
      const hash = window.location.hash
      const route = _getByHash(hash)
      route ? _load(route) : _redirect(_getDefault())
    }

    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash
      const route = _getByHash(hash)

      if (route) {
        // console.log(route)
        return _load(route)
      }

      const firstRoute = _getFirst()
      _redirect(firstRoute)
    })
  }

  return { init }
}
