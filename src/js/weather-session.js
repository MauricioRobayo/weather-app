import * as create from './elements-creators'
import getTimeFromOffset from './get-time-from-offset'

class WeatherSession {
  constructor({ parentElement, weatherApi, units = 'metric' }) {
    this.sessionParent = parentElement
    this.weatherApi = weatherApi
    this.units = units
    this.setupElements()
  }

  setupElements() {
    this.cityNameInput = create.element('input', {
      type: 'text',
      id: 'city-name',
      name: 'city-name',
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
    this.temp = create.element('span', { classList: ['temp'] })
    this.tempUnit = create.element('button', {
      classList: ['toggle'],
      innerHTML: this.buttonContent(),
    })
    this.tempUnit.addEventListener('click', this.changeUnit.bind(this))
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
    this.temp.innerHTML = '<div class="loader"></div>'
    const {
      data: {
        main: { temp },
      },
    } = await this.weatherApi.fetchWeather(this.city, this.units)
    button.innerHTML = this.buttonContent()
    this.temp.textContent = temp
    button.classList.remove('hide')
  }

  startNewSession() {
    this.sessionParent.append(this.sessionWrapper)
    const cityNameInput = this.sessionWrapper.querySelector('#city-name')
    cityNameInput.focus()
    cityNameInput.addEventListener('keypress', event => {
      if (event.keyCode === 13) {
        event.target.disabled = true
        this.getWeather(event)
      }
    })
    cityNameInput.focus()
  }

  appendLine(...line) {
    this.sessionWrapper.append(...line)
  }

  replaceLine(...line) {
    this.sessionWrapper.lastChild.replaceWith(...line)
  }

  async getWeather(event) {
    const { value: city } = event.target
    this.city = city
    this.appendLine(create.line({ text: `↑↓ ${this.weatherApi.url.origin}` }))
    this.appendLine(create.line({ text: `<div class="loader"></div>` }))
    const { response, data } = await this.weatherApi.fetchWeather(
      this.city,
      this.units
    )
    this.data = data
    if (response.ok) {
      this.displayTitle()
      this.displayInfo()
    } else {
      this.replaceLine(
        create.line({
          text: `${response.status}: ${this.data.message}`,
          type: 'error',
        })
      )
    }
    const session = new WeatherSession({
      parentElement: this.sessionParent,
      weatherApi: this.weatherApi,
    })
    session.startNewSession()
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
