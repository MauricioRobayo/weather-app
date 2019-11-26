import * as create from './helpers/elements-creators'
import getTimeFromOffset from './helpers/get-time-from-offset'

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
    if (event.keyCode === 13) {
      this.setRequestedCity()
      await this.getWeather()
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
    this.appendLine(
      create.line({ text: `↑↓ ${this.weatherApi.url.origin}` }),
      create.loader()
    )
    Object.assign(
      this,
      await this.weatherApi.fetchWeather(this.requestedCity, this.units)
    )
  }

  handleResponse() {
    if (this.response.ok) {
      this.displayTitle()
      this.displayInfo()
    } else {
      this.replaceLine(
        create.line({
          text: `${this.response.status}: ${this.data.message}`,
          type: 'error',
        })
      )
    }
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
    button.classList.add('hide')
    this.units = this.units === 'metric' ? 'imperial' : 'metric'
    this.temperature.firstChild.replaceWith(create.loader())
    const {
      data: {
        main: { temp },
      },
    } = await this.weatherApi.fetchWeather(this.initialCity, this.units)
    button.innerHTML = create.unitsToggle()
    this.temperature.textContent = temp
    button.classList.remove('hide')
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
      }).map(([key, value]) => create.infoLine(key, { value }))
    )
  }
}

export default WeatherSession
