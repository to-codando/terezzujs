import { controllerFactory } from "./controllerFactory.js"

export const createApp = () => {
  const _modules = {}

  const setModules = (modules) => {
    Object.assign(_modules, {...modules})
  }

  const init = () => {
    for (let key in _modules) {
      const module = _modules[key]
      const controller = controllerFactory(module.controller())
      controller.setViewModel(module)
      controller.setChildren({...module?.children})
      controller.init()
    }
  }

  return {
    setModules,
    init
  }
}
