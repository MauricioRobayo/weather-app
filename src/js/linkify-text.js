// eslint-disable-next-line import/no-unresolved
const linkifyIt = require('linkify-it')()

function linkifyText(text) {
  let linkifiedText = text
  if (linkifyIt.test(text)) {
    linkifyIt.match(text).forEach(({ url }) => {
      linkifiedText = text.replace(
        url,
        `<a href="${url}" target="_blank">${url}</a>`
      )
    })
  }
  return linkifiedText
}

export default linkifyText
