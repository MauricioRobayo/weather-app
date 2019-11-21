import linkifyText from './linkify-text'

const addClassList = (element, classList) => {
  element.classList.add(...classList)
}

const addDataset = (element, dataset) => {
  Object.entries(dataset).forEach((key, value) => {
    element.setAttribute(`data-${key}`, value)
  })
}

const addChildren = (element, children) => {
  element.append(...children)
}

const setProperty = (element, key, value) => {
  switch (key) {
    case 'classList':
      addClassList(element, value)
      break
    case 'dataset':
      addDataset(element, value)
      break
    case 'children':
      addChildren(element, value)
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

const loader = () => {
  return element('div', {
    classList: ['loader'],
  })
}

export { element, line, infoLine, icon, loader }
