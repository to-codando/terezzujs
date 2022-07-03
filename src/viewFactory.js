import { html, css } from './tagged.js'
import { uuid } from './uuid.js'

export const viewFactory = ({template, events, selector, style = () => {}}) => {

  let _element = null

  const _initEvents = ({events, methods, query}) => {
    for( let key in events ) {
      events[key]({methods, query})
    }
  }

  const applyContext = (text, id) => text.replace(/ctx-/gi, id)

  const hasStyle = (ctx) => {
    const element = document.head.querySelector(`style[mvc=${ctx}]`)
    return element ? true : false
  }
  const _bindStyles = ({css, ctx, id, state}) => {
    const cssString = style({css, state})
    if(!cssString || hasStyle(ctx)) return
    const styleElement = document.createElement('style')
    
    styleElement.setAttribute('mvc', ctx)
    styleElement.textContent = applyContext(cssString, id)
    
    document.head.append(styleElement)
  }

  const render = ({ state, methods}) => {
    const query = _element.querySelector.bind(_element)
    const data = state.get() || {}
    const ctx = _element.getAttribute('mvc')
    const id = uuid(ctx)
    const htmlString = template({ html, state: data, methods })
    _element.innerHTML = applyContext(htmlString, id)
    _bindStyles({ ctx, id, css, state: data })
    _initEvents({events, methods, query} )
  }

  const bindElement = () => {
    _element = document.querySelector(selector)
  }
  
  const children = () => {}

  return {
    render,
    bindElement
  }
}