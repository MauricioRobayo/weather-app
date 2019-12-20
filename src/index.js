import './style.scss'
import WeatherSession from './js/weather-session'
import fetchWeather from './js/weather-api'
import fetchCity from './js/ipinfo-api'

const displayElement = document.querySelector('main')

fetchCity()
  .then(city => {
    const weatherSession = new WeatherSession({
      parentElement: displayElement,
      weatherApi: fetchWeather,
      city,
    })
    weatherSession.startNewSession()
  })
  .catch(e => {
    displayElement.append(e.message)
  })
