class IPInfo {
  constructor() {
    if (window.location.hostname === 'localhost') {
      this._url = new URL('http://localhost:5000/ipinfo')
    } else {
      this._url = new URL('https://vast-lake-71168.herokuapp.com/ipinfo')
    }
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
}

export default IPInfo
