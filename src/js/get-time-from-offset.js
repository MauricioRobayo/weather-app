const getTimeFromOffset = timeOffsetInSeconds => {
  const d = new Date()
  const d2 = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds() + timeOffsetInSeconds
  )
  return d2.toISOString().slice(11, 16)
}

export default getTimeFromOffset
