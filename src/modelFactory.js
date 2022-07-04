import { observerFactory } from './observerFactory.js'

export const modelFactory = ({ data = {}, methods = {} }) => {
  const _methods = {}
  const state = observerFactory({ ...JSON.parse(JSON.stringify(data)) })

  const bindMethods = () => {
    for (const key in methods) {
      _methods[key] = methods[key].bind(null, state)
    }

    return _methods
  }

  return {
    state: { ...state },
    methods: bindMethods()
  }
}
