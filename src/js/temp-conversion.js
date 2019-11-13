const toFarenheit = temp => {
  return ((temp * 9) / 5 + 32).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}
const toCelsius = temp => {
  return (((temp - 32) * 5) / 9).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}

export { toFarenheit, toCelsius }
