import linkifyText from './linkifyText'

function createElement(type = 'div', properties = {}) {
  const element = document.createElement(type)
  Object.keys(properties).forEach(property => {
    switch (property) {
      case 'classList':
        element.classList.add(...properties[property])
        break
      case 'dataset':
        Object.keys(properties[property]).forEach(data => {
          element.setAttribute(`data-${data}`, properties[property][data])
        })
        break
      default:
        element[property] = properties[property]
    }
  })
  return element
}

function createNewLine({ text, type = 'default' }) {
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

export { createElement, createNewLine }
