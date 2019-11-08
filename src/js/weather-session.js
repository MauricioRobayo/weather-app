import { createElement, createNewLine } from './elements-creators'

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

  appendLine({ text, type = 'default' }) {
    this.currentSession.append(createNewLine({ text, type }))
  }

  async getWeather(event) {
    const { value: city } = event.target
    this.appendLine({ text: `Reaching ${this.weatherApi.url.origin}` })
    const { response, data } = await this.weatherApi.fetchWeather(city)
    this.data = data
    if (response.status === 200) {
      this.displayWeatherInfo()
    } else {
      this.appendLine({
        text: `${response.status}: ${this.data.message}`,
        type: 'error',
      })
    }
    this.startNewSession()
  }

  displayWeatherInfo() {
    const fragment = document.createDocumentFragment()
    const { cityInfo, weatherInfo } = this.data
    fragment.append(createNewLine({ text: 'City', type: 'title' }))
    Object.keys(cityInfo).forEach(key => {
      fragment.append(
        createNewLine({ text: `${key}: ${cityInfo[key]}`, type: 'info' })
      )
    })
    fragment.append(createNewLine({ text: 'Weather', type: 'title' }))
    Object.keys(weatherInfo).forEach(key => {
      fragment.append(
        createNewLine({ text: `${key}: ${weatherInfo[key]}`, type: 'info' })
      )
    })
    this.currentSession.append(fragment)
  }
}

export default WeatherSession
