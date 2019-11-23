import * as create from './helpers/elements-creators'
import getTimeFromOffset from './helpers/get-time-from-offset'

class WeatherSession {
  constructor({ parentElement, weatherApi, city = '', units = 'metric' }) {
    this.sessionParent = parentElement
    this.weatherApi = weatherApi
    this.units = units
    this.city = city
  }

  startNewSession() {
    this.setupInput()
    this.setupTempElement()
    const cityNameInput = this.sessionWrapper.querySelector('#city-name')
    cityNameInput.addEventListener('keypress', this.keypress.bind(this))
    cityNameInput.focus()
  }

  async keypress(event) {
    if (event.keyCode === 13) {
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

  setupInput() {
    this.cityNameInput = create.element('input', {
      type: 'text',
      id: 'city-name',
      name: 'city-name',
      placeholder: this.city,
    })
    this.cityNameLabel = create.element('label', {
      textContent: 'City name:',
      children: [this.cityNameInput],
    })
    this.line = create.line({ children: [this.cityNameLabel] })
    this.sessionWrapper = create.element('div', {
      classList: ['session-wrapper'],
      children: [this.line],
    })
    this.sessionParent.append(this.sessionWrapper)
  }

  async getWeather(event) {
    this.city = event.target.value
    this.appendLine(
      create.line({ text: `↑↓ ${this.weatherApi.url.origin}` }),
      create.loader()
    )
    Object.assign(
      this,
      await this.weatherApi.fetchWeather(this.city, this.units)
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
    } = await this.weatherApi.fetchWeather(this.city, this.units)
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
