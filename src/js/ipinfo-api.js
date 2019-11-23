class IPInfo {
  constructor(apiKey) {
    this.apiKey = apiKey
    this._url = new URL('https://ipinfo.io/')
  }

  async fetchIPInfo() {
    this._url.search = new URLSearchParams({
      token: this.apiKey,
    }).toString()
    const response = await fetch(this._url.href)
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
