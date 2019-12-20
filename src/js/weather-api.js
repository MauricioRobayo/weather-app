const fetchWeather = async (city, units = 'metric') => {
  const url =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://vast-lake-71168.herokuapp.com'

  const queryparams = new URLSearchParams({
    q: city,
    units,
  }).toString()
  const response = await fetch(`${url}/weather?${queryparams}`)
  const data = await response.json()
  return { response, data }
}

export default fetchWeather
