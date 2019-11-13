const API_URL = 'https://api.openweathermap.org/'
const API_ENDPOINT = '/data/2.5/weather'

class WeatherApi {
  constructor(apiKey) {
    this.apiKey = apiKey
    this._url = new URL(API_ENDPOINT, API_URL)
  }

  async fetchWeather(city, units = 'metric') {
    this._url.search = new URLSearchParams({
      q: city,
      appid: this.apiKey,
      units,
    }).toString()
    const response = await fetch(this._url.href)
    const data = await response.json()
    return { response, data }
  }

  get url() {
    return this._url
  }
}

export default WeatherApi
