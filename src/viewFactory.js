import { html, css } from "./tagged.js"
import { uuid } from "./uuid.js"

export const viewFactory = ({
	template,
	events,
	selector,
	style = () => {},
}) => {
	let _element = null
	let _children = {}

	const _initEvents = ({ events, methods, query }) => {
		for (const key in events) {
			events[key]({ methods, query })
		}
	}

	const applyContext = (ctx, text, id) =>
		text.replace(/ctx-/gi, `${ctx}-${id}-`)

	const hasStyle = (ctx, selector) => {
		const head = document.querySelector("head")
		return head.querySelector(selector)
	}
  
	const _bindStyles = ({ ctx, id, state }) => {
		const cssString = style({ css, state })
		const styleSelector = `style[id=${ctx}]`

		if (!cssString) return

		if (hasStyle(ctx, styleSelector)) {
      const styleElement = document.querySelector(styleSelector)
      styleElement.setAttribute('id', ctx)
			styleElement.textContent = applyContext(ctx, cssString, id)
      return
		}

    const styleElement = document.createElement('style')
    styleElement.setAttribute('id', ctx)
    styleElement.textContent = applyContext(ctx, cssString, id)
    document.head.insertAdjacentElement('beforeend', styleElement)
	}


	const render = ({ state, methods, target, createChild = () => {} }) => {
		const query = _element.querySelector.bind(_element)
		const data = state.get() || {}
		const ctx = _element.getAttribute("mvc")
		const id = uuid(ctx)
		const htmlString = template({ html, state: data, methods })
		_element.innerHTML = applyContext(ctx, htmlString, id)
		_initEvents({ element: _element, events, methods, query })
		_bindStyles({ ctx, id, state: data })
		renderChildren(_element, createChild)
	}

	const renderChildren = (parentElement, create) => {
		const elements = getElements(parentElement)
		elements.forEach((element) => {
			const childId = element.getAttribute("mvc")
			const childModule = _children[childId]
			const child = create(childModule)
			child.init(element)
			// controller.init()
		})
	}

	const getElements = (parentElement) => {
		const keys = Object.keys(_children)
		return keys.flatMap((key) => {
			const selector = `[mvc=${key}]`
			return Array.from(parentElement.querySelectorAll(selector))
		})
	}

	const bindElement = (target) => {
		_element = target || document.querySelector(selector)
	}

	const setChildren = ({ children = {} }) => {
		_children = children
	}

	return {
		render,
		bindElement,
		setChildren,
	}
}
