class IPInfo {
  constructor() {
    this._url = new URL('https://vast-lake-71168.herokuapp.com/ipinfo')
  }

  async fetchIPInfo() {
    const response = await fetch(this._url)
    const data = await response.json()
    return { response, data }
  }

  async getCity() {
    const { response, data } = await this.fetchIPInfo()
    if (response.ok) {
      return `${data.city}, ${data.country}`
    }
    throw new Error(`${data.error.title}: ${data.error.message}`)
  }

  get url() {
    return this._url
  }
}

export default IPInfo
