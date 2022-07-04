import { html, css } from './tagged.js'
import { uuid } from './uuid.js'

export const viewFactory = ({ template, events, selector, style = () => {} }) => {
  let _elements = null

  const _initEvents = ({ events, methods, query }) => {
    for (const key in events) {
      events[key]({ methods, query })
    }
  }

  const applyContext = (text, id) => text.replace(/ctx-/gi, id)

  const hasStyle = (ctx) => {
    const head = document.querySelector('head')
    return head.querySelector(`style[id=${ctx}]`)
  }
  const _bindStyles = ({ ctx, id, state }) => {
    const cssString = style({ css, state })
    if (cssString && !hasStyle(ctx)) {
      const styleElement = document.createElement('style')

      styleElement.setAttribute('id', ctx)
      styleElement.textContent = applyContext(cssString, id)
      document.head.insertAdjacentElement('beforeend', styleElement)
    }
  }

  const render = ({ state, methods }) => {
    const query = _elements.querySelector.bind(_elements)
    const data = state.get() || {}
    const ctx = _elements.getAttribute('mvc')
    const id = uuid(ctx)
    const htmlString = template({ html, state: data, methods })
    _elements.innerHTML = applyContext(htmlString, id)
    _initEvents({ element: _elements, events, methods, query })
    _bindStyles({ ctx, id, state: data })
  }

  const bindElement = () => {
    _elements = document.querySelectorAll(selector)
  }

  const children = () => {}

  return {
    render,
    bindElement
  }
}
