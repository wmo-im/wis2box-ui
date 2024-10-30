export function getNameTime(
  feature: { [x: string]: string; name: string },
  time_field = 'phenomenonTime',
) {
  let name = clean(feature.name)

  if (feature[time_field].includes('/')) {
    const splitTime = feature[time_field].split('/')
    const timeDifference =
      new Date(splitTime[1]).getTime() - new Date(splitTime[0]).getTime()
    const minuteDifference = Math.floor(timeDifference / (1000 * 60))
    const hourDifference = Math.floor(timeDifference / (1000 * 3600))

    if (hourDifference > 0) {
      name = `${name} (${hourDifference} hr)`
    } else if (minuteDifference > 0) {
      name = `${name} (${minuteDifference} min)`
    }
  }

  return name
}

export function clean(word: string) {
  if (typeof word === 'string') {
    if (word.search(/\d+$/) > -1) {
      // String ends with a number
      const endingNumber = word.match(/\d+$/g)
      if (endingNumber && endingNumber.length > 0) {
        word = word.replace(endingNumber.toString(), `_${endingNumber}`)
      }
    }

    if (word.search(/^\d+/) > -1) {
      // String starts with a number
      const leadingNumber = word.match(/^\d+/g)
      if (leadingNumber && leadingNumber.length > 0) {
        word = word.replace(leadingNumber.toString(), `${leadingNumber}_`)
      }
    } else {
      word = word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    }

    return word.replace(/_/g, ' ') // replace all instances of _ with a space
  }
}

export function hasLinks(feature: { links: string }) {
  return feature && feature.links && feature.links.length > 0
}