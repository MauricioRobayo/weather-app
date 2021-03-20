import Cache from "simple-storage-cache";

const PROXY_URL = "https://vast-lake-71168.herokuapp.com/";
const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;
const TEN_MINUTES_IN_MILLISECONDS = 10 * 60 * 1000;

const fetchData = (endpoint, cacheInMilliseconds) => async (
  queryparams = {}
) => {
  const url = new URL(endpoint);

  Object.entries(queryparams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const cache = new Cache(url.toString().toLowerCase(), cacheInMilliseconds);

  const cached = cache.get();

  if (cached) {
    const { data, expiration } = cached;
    return { ...data, cache: new Date(expiration) };
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.statusText} (${response.status})`);
  }

  const data = await response.json();

  cache.update(data);

  return { ...data, cache: false };
};

const fetchCity = fetchData(
  LOCAL // eslint-disable-line no-undef
    ? `https://ipinfo.io/?token=${process.env.IPINFO_TOKEN}`
    : `${PROXY_URL}ipinfo`,
  THIRTY_MINUTES_IN_MILLISECONDS
);
const fetchWeather = fetchData(
  LOCAL // eslint-disable-line no-undef
    ? `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API_KEY}`
    : `${PROXY_URL}weather`,
  TEN_MINUTES_IN_MILLISECONDS
);

export { fetchCity, fetchWeather };
