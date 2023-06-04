export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formateHistoryValues = (values: any[]): string[] => {
  return values.map(value => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
  })
}