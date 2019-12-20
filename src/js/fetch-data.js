const fetchData = async (endpoint, queryparams = {}) => {
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

export default fetchData
