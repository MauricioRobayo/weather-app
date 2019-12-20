import './style.scss'
import WeatherSession from './js/weather-session'
import WeatherApi from './js/weather-api'
import IPInfo from './js/ipinfo-api'

const displayElement = document.querySelector('main')
const ipinfo = new IPInfo()

ipinfo
  .getCity()
  .then(city => {
    const weatherSession = new WeatherSession({
      parentElement: displayElement,
      weatherApi: new WeatherApi(),
      city,
    })
    weatherSession.startNewSession()
    return weatherSession
  })
  .catch(e => {
    displayElement.append(e.message)
  })
