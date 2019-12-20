const fetchWeather = async queryparams => {
  const url =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://vast-lake-71168.herokuapp.com'

  const response = await fetch(
    `${url}/weather?${new URLSearchParams(queryparams).toString()}`
  )
  const data = await response.json()
  return { response, data }
}

export default fetchWeather
