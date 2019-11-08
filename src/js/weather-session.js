import { createElement, createLine } from './elements-creators'

class WeatherSession {
  constructor({ parentElement, weatherApi }) {
    this.sessionParent = parentElement
    this.weatherApi = weatherApi
    this.sessionWrapper = createElement('div', {
      classList: ['session-wrapper'],
    })
    this.line = createElement('div', {
      classList: ['line'],
    })
    this.cityNameLabel = createElement('label', {
      for: 'city-name',
      textContent: 'City name:',
    })
    this.cityNameInput = createElement('input', {
      type: 'text',
      id: 'city-name',
      name: 'city-name',
    })
    this.line.append(this.cityNameLabel, this.cityNameInput)
    this.sessionWrapper.append(this.line)
  }

  startNewSession() {
    this.currentSession = this.sessionWrapper.cloneNode(true)
    this.sessionParent.append(this.currentSession)
    const cityNameInput = this.currentSession.querySelector('#city-name')
    cityNameInput.focus()
    cityNameInput.addEventListener('keypress', event => {
      if (event.keyCode === 13) {
        event.target.disabled = true
        this.getWeather(event)
      }
    })
    document.addEventListener('click', () => cityNameInput.focus())
  }

  appendLine(line) {
    this.currentSession.append(line)
  }

  replaceLine(line) {
    this.currentSession.lastChild.replaceWith(line)
  }

  async getWeather(event) {
    const { value: city } = event.target
    this.appendLine(
      createLine({ text: `Reaching ${this.weatherApi.url.origin}` })
    )
    this.appendLine(createLine({ text: `<div class="loader"></div>` }))
    const { response, data } = await this.weatherApi.fetchWeather(city)
    this.data = data
    if (response.status === 200) {
      this.displayWeatherInfo()
    } else {
      this.replaceLine(
        createLine({
          text: `${response.status}: ${this.data.message}`,
          type: 'error',
        })
      )
    }
    this.startNewSession()
  }

  displayWeatherInfo() {
    const fragment = document.createDocumentFragment()
    const { cityInfo, weatherInfo } = this.data
    fragment.append(createLine({ text: 'City', type: 'title' }))
    Object.keys(cityInfo).forEach(key => {
      fragment.append(
        createLine({ text: `${key}: ${cityInfo[key]}`, type: 'info' })
      )
    })
    fragment.append(createLine({ text: 'Weather', type: 'title' }))
    Object.keys(weatherInfo).forEach(key => {
      fragment.append(
        createLine({ text: `${key}: ${weatherInfo[key]}`, type: 'info' })
      )
    })
    this.replaceLine(fragment)
  }
}

export default WeatherSession
