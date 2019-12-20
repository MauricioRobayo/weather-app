import WeatherSession from './js/weather-session'
import { fetchCity, fetchWeather } from './js/fetch-data'
import { loader, element } from './js/helpers/elements-creators'

const displayElement = document.querySelector('main')
const pageLoader = element('div', {
  textContent: 'Loading... ',
  children: [loader()],
})

displayElement.append(pageLoader)

fetchCity()
  .then(data => {
    pageLoader.remove()
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
