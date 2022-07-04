import { modelFactory } from './modelFactory.js'
import { viewFactory } from './viewFactory.js'

export const controllerFactory = (schema) => {
  const _methods = {}
  let _view = null
  let _model = null
  let _children = {}

  const init = () => {
    setChildren(schema.children || {})
    watchChanges()
    _view.bindElement()
    _view.render({ ..._model, methods: _methods })
    bindChildren()
  }
  const counter = 0
  const bindChildren = () => {
    for (const key in _children) {
      const module = _children[key]
      const controller = controllerFactory(module.controller())
      controller.setViewModel(module)
      controller.init()
    }
  }

  const watchChanges = () => {
    const methods = { ..._methods }
    _model.state.on(data => {
      _view.render({ ..._model, methods })
      bindChildren()
    })
  }

  const bindMethods = () => {
    const { methods } = schema
    for (const key in methods) {
      _methods[key] = methods[key].bind(null, _model.methods)
    }
  }

  const setChildren = (children) => {
    _children = children
  }

  const setViewModel = ({ view, model }) => {
    _view = viewFactory({ ...view() })
    _model = modelFactory({ ...model() })
    bindMethods()
  }

  return {
    setChildren,
    setViewModel,
    init
  }
}
