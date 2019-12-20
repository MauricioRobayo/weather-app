import './style.scss'
import WeatherSession from './js/weather-session'
import fetchData from './js/fetch-data'

const displayElement = document.querySelector('main')

fetchData('ipinfo')
  .then(data => {
    const weatherSession = new WeatherSession({
      parentElement: displayElement,
      weatherApi: fetchData,
      city: `${data.city}, ${data.country}`,
    })
    weatherSession.startNewSession()
  })
  .catch(e => {
    displayElement.append(e.message)
  })
