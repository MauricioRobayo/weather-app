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
    this.sessionWrapper = create.prompt(
      this.initialCity,
      this.keypress.bind(this)
    )
    this.sessionParent.append(this.sessionWrapper)
    this.setupTempElement()
  }

  async keypress(event) {
    event.preventDefault()
    if (event.keyCode === 13) {
      this.requestedCity = event.target.value || event.target.placeholder
      event.target.value = this.requestedCity
      event.target.disabled = true
      await this.getWeather(event)
      this.handleResponse()
    }
  }

  setupTempElement() {
    this.temp = create.element('span', { classList: ['temp'] })
    this.tempUnit = create.element('button', {
      classList: ['toggle'],
      innerHTML: this.buttonContent(),
    })
    this.tempUnit.addEventListener('click', this.changeUnit.bind(this))
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

  buttonContent() {
    return this.units === 'metric'
      ? '<span class="unit-active">C</span> ⇄ F'
      : '<span class="unit-active">F</span> ⇄ C'
  }

  async changeUnit(event) {
    const button =
      event.target.tagName === 'BUTTON'
        ? event.target
        : event.target.parentElement
    button.classList.add('hide')
    this.units = this.units === 'metric' ? 'imperial' : 'metric'
    this.temp.firstChild.replaceWith(create.loader())
    const {
      data: {
        main: { temp },
      },
    } = await this.weatherApi.fetchWeather(this.initialCity, this.units)
    button.innerHTML = this.buttonContent()
    this.temp.textContent = temp
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
    this.temp.textContent = temp
    const tempData = create.infoLine('temp')
    tempData.append(this.temp, this.tempUnit)
    this.appendLine(
      tempData,
      ...Object.entries({
        time: getTimeFromOffset(timezone),
        main: main.toLowerCase(),
        description,
        pressure: `${pressure}hPa`,
        humidity: `${humidity}%`,
      }).map(([key, value]) => create.infoLine(key, value))
    )
  }
}

export default WeatherSession
