import * as create from './helpers/elements-creators'
import getTimeFromOffset from './helpers/get-time-from-offset'
import { toFarenheit, toCelsius } from './helpers/temp-conversion'

class WeatherSession {
  constructor({ parentElement, weatherApi, city = '', units = 'metric' }) {
    this.sessionParent = parentElement
    this.weatherApi = weatherApi
    this.units = units
    this.initialCity = city
  }

  startNewSession() {
    Object.assign(
      this,
      create.prompt(this.initialCity, this.keypress.bind(this)),
      create.temperature(this.units, this.changeUnit.bind(this))
    )
    this.sessionParent.append(this.sessionWrapper)
    this.cityNameInput.focus()
  }

  async keypress(event) {
    if (event.key === 'Enter') {
      this.setRequestedCity()
      try {
        await this.getWeather()
      } catch (e) {
        this.replaceLine(
          create.line({
            text: e,
            type: 'error',
          })
        )
      }
      this.handleResponse()
    }
  }

  setRequestedCity() {
    if (!this.cityNameInput.value) {
      this.cityNameInput.value = this.cityNameInput.placeholder
    }
    this.requestedCity = this.cityNameInput.value
    this.cityNameInput.disabled = true
  }

  async getWeather() {
    this.appendLine(create.loader())
    const data = await this.weatherApi({
      q: this.requestedCity,
      units: this.units,
    })
    Object.assign(this, { data })
  }

  handleResponse() {
    this.displayTitle()
    this.displayInfo()
    new WeatherSession({
      parentElement: this.sessionParent,
      weatherApi: this.weatherApi,
      city: this.initialCity,
    }).startNewSession()
  }

  async changeUnit(event) {
    const button =
      event.target.tagName === 'BUTTON'
        ? event.target
        : event.target.parentElement
    this.temperature.textContent =
      this.units === 'metric'
        ? toFarenheit(this.temperature.textContent)
        : toCelsius(this.temperature.textContent)
    this.units = this.units === 'metric' ? 'imperial' : 'metric'
    button.innerHTML = create.unitsToggle(this.units)
  }

  appendLine(...line) {
    this.sessionWrapper.append(...line)
  }

  replaceLine(...line) {
    this.sessionWrapper.lastChild.replaceWith(...line)
  }

  displayTitle() {
    this.replaceLine(
      create.line({
        text: `${this.data.name}, ${this.data.sys.country}`,
        type: 'title',
        children: [create.icon(this.data.weather[0].icon)],
      })
    )
  }

  displayInfo() {
    const {
      timezone = '',
      weather: [{ main = '', description = '' }],
      main: { temp = '', pressure = '', humidity = '' },
      cache,
    } = this.data
    this.temperature.textContent = temp
    this.appendLine(
      this.temperatureLine,
      ...Object.entries({
        time: getTimeFromOffset(timezone),
        main: main.toLowerCase(),
        description,
        pressure: `${pressure}hPa`,
        humidity: `${humidity}%`,
        cache: cache && new Date(cache).toISOString(),
      }).map(([key, value]) => create.infoLine(key, { value }))
    )
  }
}

export default WeatherSession
