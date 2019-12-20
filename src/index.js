import WeatherSession from './js/weather-session'
import { fetchCity, fetchWeather } from './js/fetch-data'

const displayElement = document.querySelector('main')

fetchCity()
  .then(data => {
    const weatherSession = new WeatherSession({
      parentElement: displayElement,
      weatherApi: fetchWeather,
      city: `${data.city}, ${data.country}`,
    })
    weatherSession.startNewSession()
  })
  .catch(e => {
    displayElement.append(e.message)
  })
