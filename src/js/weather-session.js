import { createElement, createLine, createIcon } from './elements-creators'
import getTimeFromOffset from './get-time-from-offset'

class WeatherSession {
  constructor({ parentElement, weatherApi, units = 'metric' }) {
    this.sessionParent = parentElement
    this.weatherApi = weatherApi
    this.units = units
    this.sessionWrapper = createElement('div', {
      classList: ['session-wrapper'],
    })
    this.line = createElement('div', {
      classList: ['line'],
    })
    this.cityNameLabel = createElement('label', {
      textContent: 'City name:',
    })
    this.cityNameInput = createElement('input', {
      type: 'text',
      id: 'city-name',
      name: 'city-name',
    })
    this.temp = createElement('span', { classList: ['temp'] })
    this.cityNameLabel.append(this.cityNameInput)
    this.line.append(this.cityNameLabel)
    this.sessionWrapper.append(this.line)
  }

  async changeUnit(event) {
    const button =
      event.target.tagName === 'BUTTON'
        ? event.target
        : event.target.parentElement
    this.units = this.units === 'metric' ? 'imperial' : 'metric'
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

  appendLine(line) {
    this.sessionWrapper.append(line)
  }

  replaceLine(line) {
    this.sessionWrapper.lastChild.replaceWith(line)
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
      this.displayWeatherInfo()
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

  displayWeatherInfo() {
    const fragment = document.createDocumentFragment()
    const {
      name,
      sys: { country = '' },
      timezone = '',
      weather: [{ main = '', description = '', icon = '' }],
      main: { temp = '', pressure = '', humidity = '' },
    } = this.data
    fragment.append(createLine({ text: `${name}, ${country}`, type: 'title' }))
    const title = createLine({ text: 'Weather', type: 'title' })
    const img = createIcon(icon)
    title.append(img)
    fragment.append(title)
    fragment.append(
      createLine({ text: `time: ${getTimeFromOffset(timezone)}`, type: 'info' })
    )
    fragment.append(
      createLine({ text: `main: ${main.toLowerCase()}`, type: 'info' })
    )
    fragment.append(
      createLine({ text: `description: ${description}`, type: 'info' })
    )
    this.temp.textContent = temp
    const tempData = createLine({
      text: `temp:`,
      type: 'info',
    })
    const tempUnit = createElement('button', {
      classList: ['toggle'],
      innerHTML:
        this.units === 'metric'
          ? '<span class="unit-active">C</span> ⇄ F'
          : '<span class="unit-active">F</span> ⇄ C',
    })
    tempUnit.addEventListener('click', this.changeUnit.bind(this))
    tempData.append(this.temp, tempUnit)
    fragment.append(tempData)
    fragment.append(
      createLine({ text: `pressure: ${pressure}hPa`, type: 'info' })
    )
    fragment.append(
      createLine({ text: `humidity: ${humidity}%`, type: 'info' })
    )
    this.replaceLine(fragment)
  }
}

export default WeatherSession
