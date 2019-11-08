import './style.scss'
import WeatherSession from './js/weather-session'
import WeatherApi from './js/weather-api'

const WEATHER_API_KEY = 'fa1c7f10e6e75b7dc652e684202b5bd1'

const session = new WeatherSession({
  parentElement: document.querySelector('main'),
  weatherApi: new WeatherApi(WEATHER_API_KEY),
})

session.startNewSession()
