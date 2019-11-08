async function fetchApi({ apiUrl, apiEndPoint, apiKey, queryTerm }) {
  const url = new URL(apiEndPoint, apiUrl)
  const searchParams = new URLSearchParams({
    q: queryTerm,
    appid: apiKey,
  }).toString()
  url.search = searchParams
  const response = await fetch(url.href)
  const data = await response.json()
  return { response, data }
}

export default fetchApi
