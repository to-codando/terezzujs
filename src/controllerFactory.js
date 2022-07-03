import { modelFactory } from "./modelFactory.js"
import { viewFactory } from "./viewFactory.js"

export const controllerFactory = (schema) => {
  let _methods = {}
  let _view = null
  let _model = null
  let _children = {}
  
  const init = () => { 
    _view.bindElement()
    _view.render({..._model, methods: _methods })
    bindChildren()
  }
  
  const bindChildren = () => {
    const children = schema?.children || {} 
    _children = Object.assign(_children, children)

    for(let key in _children ) {
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
    const {methods} = schema
    for( let key in methods) {
      _methods[key] = methods[key].bind(null, _model.methods)
    }
  }  

  const setChildren = (children) => {
    Object.assign(_children, children)
  }
  
  const setViewModel = ({view, model}) => {
    _view = viewFactory({ ...view() })
    _model = modelFactory({ ...model() })
    bindMethods()
    watchChanges()
  }

  return {
    setChildren,
    setViewModel,
    init
  }
}