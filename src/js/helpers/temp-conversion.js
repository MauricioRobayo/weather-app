function toFarenheit(temp) {
  console.log(temp)
  return ((temp * 9) / 5 + 32).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}
function toCelsius(temp) {
  return (((temp - 32) * 5) / 9).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}

export { toFarenheit, toCelsius }
