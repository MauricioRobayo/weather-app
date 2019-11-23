import './style.scss'
import WeatherSession from './js/weather-session'
import WeatherApi from './js/weather-api'
import IPInfo from './js/ipinfo-api'

const WEATHER_API_KEY = 'fa1c7f10e6e75b7dc652e684202b5bd1'
const IPINFO_API_KEY = 'b53b62f81db933'

const displayElement = document.querySelector('main')

const ipinfo = new IPInfo(IPINFO_API_KEY)
ipinfo
  .getCity()
  .then(city => {
    const weatherSession = new WeatherSession({
      parentElement: displayElement,
      weatherApi: new WeatherApi(WEATHER_API_KEY),
      city,
    })
    weatherSession.startNewSession()
    return weatherSession
  })
  .catch(e => {
    displayElement.append(e.message)
  })
