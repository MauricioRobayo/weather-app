import linkifyText from './linkify-text'

const setProperty = (element, key, value) => {
  switch (key) {
    case 'classList':
      element.classList.add(...value)
      break
    case 'dataset':
      Object.keys(value).forEach(data => {
        element.setAttribute(`data-${data}`, value[data])
      })
      break
    case 'children':
      element.append(...value)
      break
    default:
      element[key] = value
  }
}
const createElement = (type = 'div', properties = {}) => {
  const element = document.createElement(type)
  Object.entries(properties).forEach(([key, value]) => {
    setProperty(element, key, value)
  })
  return element
}

const createLine = ({ text, type = 'default', children = [] }) => {
  const line = createElement('p', {
    innerHTML: linkifyText(text),
    classList: ['line', type],
    children,
  })
  return line
}

const createInfoLine = (key, value = '') => {
  return createLine({
    text: `${key}: ${value}`,
    type: 'info',
  })
}

const createIcon = file => {
  return createElement('img', {
    src: `https://openweathermap.org/img/wn/${file}.png`,
    alt: 'weather icon',
    classList: ['icon', file.endsWith('d') ? 'day' : 'night'],
  })
}

export { createElement, createLine, createInfoLine, createIcon }
