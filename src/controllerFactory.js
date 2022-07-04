import { modelFactory } from './modelFactory.js'
import { viewFactory } from './viewFactory.js'

export const controllerFactory = (schema) => {
  const _methods = {}
  let _view = null
  let _model = null

  const init = (target) => {
    watchChanges(target)
    _view.bindElement(target)
    _view.render({ ..._model, methods: _methods, createChild, target })
    setChildren(_view)
  }

  const watchChanges = (target) => {
    const methods = { ..._methods }
    _model.state.on(data => {
      _view.render({ ..._model, methods, createChild, target })
    })
  }

  const setChildren = (view) => _view.setChildren(schema)

  const bindMethods = () => {
    const { methods } = schema
    for (const key in methods) {
      _methods[key] = methods[key].bind(null, _model.methods)
    }
  }

  const setViewModel = ({ view, model }) => {
    _view = viewFactory({ ...view() })
    _model = modelFactory({ ...model() })
    bindMethods()
  }

  const createChild = (module) => {
    const controller = controllerFactory({ ...module.controller() })
    controller.setViewModel({ ...module })
    return { ...controller }
  }

  return {
    setViewModel,
    setChildren,
    createChild,
    init
  }
}
