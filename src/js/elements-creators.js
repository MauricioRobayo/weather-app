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

const createLine = ({ text, type = 'default' }) => {
  let linkifiedText = linkifyText(text)
  const line = createElement('p', { classList: ['line', type] })
  switch (type) {
    case 'error':
      linkifiedText = `ERROR! ${linkifiedText}`
      break
    case 'info':
      linkifiedText = `&nbsp;&nbsp;${linkifiedText}`
      break
    default:
      break
  }
  line.innerHTML = linkifiedText
  return line
}

const createIcon = file => {
  return createElement('img', {
    src: `https://openweathermap.org/img/wn/${file}.png`,
    alt: 'weather icon',
    classList: ['icon', file.endsWith('d') ? 'day' : 'night'],
  })
}

export { createElement, createLine, createIcon }
