import {
  createElement,
  createLine,
  createInfoLine,
  createIcon,
} from './elements-creators'
import getTimeFromOffset from './get-time-from-offset'

class WeatherSession {
  constructor({ parentElement, weatherApi, units = 'metric' }) {
    this.sessionParent = parentElement
    this.weatherApi = weatherApi
    this.units = units
    this.cityNameInput = createElement('input', {
      type: 'text',
      id: 'city-name',
      name: 'city-name',
    })
    this.cityNameLabel = createElement('label', {
      textContent: 'City name:',
      children: [this.cityNameInput],
    })
    this.line = createElement('div', {
      classList: ['line'],
      children: [this.cityNameLabel],
    })
    this.sessionWrapper = createElement('div', {
      classList: ['session-wrapper'],
      children: [this.line],
    })
    this.temp = createElement('span', { classList: ['temp'] })
    this.tempUnit = createElement('button', {
      classList: ['toggle'],
      innerHTML:
        this.units === 'metric'
          ? '<span class="unit-active">C</span> ⇄ F'
          : '<span class="unit-active">F</span> ⇄ C',
    })
    this.tempUnit.addEventListener('click', this.changeUnit.bind(this))
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
    button.innerHTML =
      this.units === 'metric'
        ? '<span class="unit-active">C</span> ⇄ F'
        : '<span class="unit-active">F</span> ⇄ C'
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
    this.appendLine(createLine({ text: `↑↓ ${this.weatherApi.url.origin}` }))
    this.appendLine(createLine({ text: `<div class="loader"></div>` }))
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
        createLine({
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
      createLine({
        text: `${this.data.name}, ${this.data.sys.country}`,
        type: 'title',
        children: [createIcon(this.data.weather[0].icon)],
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
    const tempData = createInfoLine('temp')
    tempData.append(this.temp, this.tempUnit)
    this.appendLine(
      tempData,
      ...Object.entries({
        time: getTimeFromOffset(timezone),
        main: main.toLowerCase(),
        description,
        pressure: `${pressure}hPa`,
        humidity: `${humidity}%`,
      }).map(([key, value]) => createInfoLine(key, value))
    )
  }
}

export default WeatherSession
