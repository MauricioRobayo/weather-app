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
const element = (type = 'div', properties = {}) => {
  const element = document.createElement(type)
  Object.entries(properties).forEach(([key, value]) => {
    setProperty(element, key, value)
  })
  return element
}

const line = ({ text = '', type = 'default', children = [] }) => {
  const line = element('p', {
    innerHTML: text ? linkifyText(text) : '',
    classList: ['line', type],
    children,
  })
  return line
}

const infoLine = (key, value = '') => {
  return line({
    text: `${key}: ${value}`,
    type: 'info',
  })
}

const icon = file => {
  return element('img', {
    src: `https://openweathermap.org/img/wn/${file}.png`,
    alt: 'weather icon',
    classList: ['icon', file.endsWith('d') ? 'day' : 'night'],
  })
}

export { element, line, infoLine, icon }
