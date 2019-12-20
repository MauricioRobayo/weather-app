const fetchCity = async () => {
  const url =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://vast-lake-71168.herokuapp.com'
  const response = await fetch(`${url}/ipinfo`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(`${data.error.title}: ${data.error.message}`)
  }
  return `${data.city}, ${data.country}`
}

export default fetchCity
