import linkify from 'linkify-it'
import fetchApi from './fetchApi'

const API_URL = 'https://api.openweathermap.org/'
const API_ENDPOINT = '/data/2.5/weather'
const API_KEY = 'fa1c7f10e6e75b7dc652e684202b5bd1'

const linkifyIt = linkify()

const linkifyText = function linkifyText(text) {
  let linkifyText = text
  if (linkifyIt.test(text)) {
    linkifyIt.match(text).forEach(({ url }) => {
      linkifyText = text.replace(
        url,
        `<a href="${url}" target="_blank">${url}</a>`
      )
    })
  }
  return linkifyText
}

function logLine({ text, type = 'default' }) {
  let linkifiedText = linkifyText(text)
  const line = document.createElement('p')
  line.classList.add('line', type)
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
  document.querySelector('main').append(line)
}

function displayWeatherInfo(data) {
  logLine({ text: 'City info', type: 'title' })
  logLine({ text: `name: ${data.name}`, type: 'info' })
  logLine({ text: `country: ${data.sys.country}`, type: 'info' })
  logLine({ text: `timezone: ${data.timezone}`, type: 'info' })
  logLine({ text: `id: ${data.id}`, type: 'info' })
  logLine({ text: 'Weather info', type: 'title' })
  logLine({ text: `main: ${data.weather[0].main}`, type: 'info' })
  logLine({ text: `description: ${data.weather[0].description}`, type: 'info' })
  logLine({ text: `temp: ${data.main.temp}`, type: 'info' })
  logLine({ text: `pressure: ${data.main.pressure}`, type: 'info' })
  logLine({ text: `humidity: ${data.main.humidity}`, type: 'info' })
  logLine({ text: `temp_min: ${data.main.temp_min}`, type: 'info' })
  logLine({ text: `temp_max: ${data.main.temp_max}`, type: 'info' })
  logLine({ text: `wind_speed: ${data.wind.speed}`, type: 'info' })
  logLine({ text: `wind_deg: ${data.wind.deg}`, type: 'info' })
}

async function startApp(event) {
  const { value: city } = event.target
  event.target.disabled = true
  logLine({ text: `Reaching ${API_URL}` })
  const { response, data } = await fetchApi({
    apiUrl: API_URL,
    apiEndPoint: API_ENDPOINT,
    apiKey: API_KEY,
    queryTerm: city,
  })
  if (response.status !== 200) {
    logLine({ text: `${response.status}: ${data.message}`, type: 'error' })
    return
  }
  displayWeatherInfo(data)
}

function runApp() {
  document.querySelector('#city-name').addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      startApp(event)
    }
  })
}

export default runApp
