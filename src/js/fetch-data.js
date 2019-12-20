const fetchData = endpoint => async (queryparams = {}) => {
  const url =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://vast-lake-71168.herokuapp.com'

  const response = await fetch(
    `${url}/${endpoint}?${new URLSearchParams(queryparams).toString()}`
  )
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return response.json()
}

const fetchCity = fetchData('ipinfo')
const fetchWeather = fetchData('weather')

export { fetchCity, fetchWeather }
