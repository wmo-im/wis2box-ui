import i18n from '@/locales/i18n'
import type { Feature, ItemsResponse, ProcessResponse } from './types'

// create an enum for green, yellow, red, and gray as hex
export enum ObservationLevel {
  'green' = '#4CAF50',
  'yellow' = '#FFC107',
  'red' = '#F44336',
  'gray' = '#757575',
}

export function getNameTime(name: string, phenomenonTime: string) {
  let cleanedName = clean(name)

  if (phenomenonTime.includes('/')) {
    const splitTime = phenomenonTime.split('/')
    const timeDifference =
      new Date(splitTime[1]).getTime() - new Date(splitTime[0]).getTime()
    const minuteDifference = Math.floor(timeDifference / (1000 * 60))
    const hourDifference = Math.floor(timeDifference / (1000 * 3600))

    if (hourDifference > 0) {
      cleanedName = `${cleanedName} (${hourDifference} hr)`
    } else if (minuteDifference > 0) {
      cleanedName = `${cleanedName} (${minuteDifference} min)`
    }
  }

  return cleanedName
}

export function clean(word: string | null | undefined) {
  if (!word) {
    return ''
  }

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

export function hasLinks(feature: Feature) {
  return feature && feature.links && feature.links.length > 0
}

export async function getStationsFromCollection(
  collectionName: string,
): Promise<ItemsResponse> {
  const { t } = i18n.global

  const response = await fetch(
    `${window.VUE_APP_OAPI}/processes/station-info/execution`,
    {
      method: 'POST',
      body: JSON.stringify({ inputs: { collection: collectionName } }),
    },
  )
  if (response.ok) {
    const data: ProcessResponse = await response.json()
    if (data.code !== 'success') {
      throw new Error('Failed to get OGC API Process Info')
    }
    return data.value // value represents the result of the process
  } else {
    throw new Error(
      `${t('messages.does_not_exist')}: ${t('messages.how_to_link_station')}`,
    )
  }
}

export function getColumnFromKey(
  features: ItemsResponse['features'],
  key: Extract<
    keyof ItemsResponse['features'][0]['properties'],
    string | number
  >,
): Array<number | string> {
  const result: Array<number | string> = []

  const split = key.split('.')

  if (split.length === 1) {
    for (const feature of features) {
      const row = feature.properties[key]
      if (typeof row === 'number' || typeof row === 'string') {
        result.push(row)
      }
    }
  } else {
    for (const feature of features) {
      let value: any = feature.properties
      for (const part of split) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part]
        } else {
          value = undefined
          break
        }
      }
      if (typeof value === 'number' || typeof value === 'string') {
        result.push(value)
      }
    }
  }

  return result
}
