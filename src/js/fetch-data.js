const fromCache = (key, cacheMinutes = 5) => {
  const cacheInMilliseconds = cacheMinutes * 60 * 1000
  if (localStorage[key] !== undefined) {
    const cache = JSON.parse(localStorage[key])
    if (Date.now() - cache.datetime < cacheInMilliseconds) {
      return { ...cache.data, cache: cache.datetime + cacheInMilliseconds }
    }
    localStorage.removeItem(key)
  }
  return false
}

const fetchData = endpoint => async (queryparams = {}) => {
  const searchparams = new URLSearchParams(queryparams).toString()
  const key = `${endpoint}-${searchparams}`
  const cache = fromCache(key)

  const url =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://vast-lake-71168.herokuapp.com'

  if (cache) {
    return cache
  }

  const response = await fetch(`${url}/${endpoint}?${searchparams}`)
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  const data = await response.json()
  localStorage[key] = JSON.stringify({ datetime: Date.now(), data })
  return { ...data, cache: false }
}

const fetchCity = fetchData('ipinfo')
const fetchWeather = fetchData('weather')

export { fetchCity, fetchWeather }
