class WeatherApi {
  constructor() {
    this._url = new URL('https://vast-lake-71168.herokuapp.com/weather')
  }

  async fetchWeather(city, units = 'metric') {
    this._url.search = new URLSearchParams({
      q: city,
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
