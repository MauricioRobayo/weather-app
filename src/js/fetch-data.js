const PROXY_URL = 'https://vast-lake-71168.herokuapp.com/';

const fromCache = (key, cacheInMinutes = 5) => {
  const cacheInMilliseconds = cacheInMinutes * 60 * 1000;
  if (localStorage[key] !== undefined) {
    const cache = JSON.parse(localStorage[key]);
    if (Date.now() - cache.datetime < cacheInMilliseconds) {
      return { ...cache.data, cache: cache.datetime + cacheInMilliseconds };
    }
    localStorage.removeItem(key);
  }
  return false;
};

const fetchData = (endpoint, cacheInMinutes) => async (queryparams = {}) => {
  const url = new URL(endpoint);
  Object.entries(queryparams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  const key = `${url}`;
  const cache = fromCache(key, cacheInMinutes);

  if (cache) {
    return cache;
  }

  const response = await fetch(`${url}`);
  if (!response.ok) {
    throw new Error(`${response.statusText} (${response.status})`);
  }
  const data = await response.json();
  localStorage[key] = JSON.stringify({ datetime: Date.now(), data });
  return { ...data, cache: false };
};

const fetchCity = fetchData(
  LOCAL // eslint-disable-line no-undef
    ? `https://ipinfo.io/?token=${process.env.IPINFO_TOKEN}`
    : `${PROXY_URL}ipinfo`,
  30
);
const fetchWeather = fetchData(
  LOCAL // eslint-disable-line no-undef
    ? `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API_KEY}`
    : `${PROXY_URL}weathers`,
  10
);

export { fetchCity, fetchWeather };
