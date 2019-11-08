const API_URL = 'https://api.openweathermap.org/'
const API_ENDPOINT = '/data/2.5/weather'

class WeatherApi {
  constructor(apiKey) {
    this.apiKey = apiKey
    this._url = new URL(API_ENDPOINT, API_URL)
  }

  async fetchWeather(city) {
    this._url.search = new URLSearchParams({
      q: city,
      appid: this.apiKey,
    }).toString()
    const response = await fetch(this._url.href)
    const data = await response.json()
    return { response, data: WeatherApi.parseData(data) }
  }

  get url() {
    return this._url
  }

  static parseData(data) {
    const {
      name,
      sys: { country },
      timezone,
      id,
      weather: [{ main, description }],
      main: { temp, pressure, humidity },
      wind: { speed, deg },
    } = data
    return {
      cityInfo: {
        name,
        country,
        timezone,
        id,
      },
      weatherInfo: {
        main,
        description,
        temp,
        pressure,
        humidity,
        windSpeed: speed,
        windDeg: deg,
      },
    }
  }
}

export default WeatherApi
