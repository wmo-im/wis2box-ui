import i18n from '@/locales/i18n'
import type { Feature, ItemsResponse, ProcessResponse } from './types'
import { useGlobalStateStore } from '@/stores/global'

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

  const response = await fetchWithToken(
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

export function getColumnFromKey<
  T extends keyof ItemsResponse['features'][0]['properties'],
>(
  features: ItemsResponse['features'],
  key: T,
): Array<ItemsResponse['features'][0]['properties'][T]> {
  const result: Array<ItemsResponse['features'][0]['properties'][T]> = []

  const split = key.toString().split('.')

  if (split.length === 1) {
    for (const feature of features) {
      const row = feature.properties[key]
      if (row !== undefined) {
        result.push(row)
      }
    }
  } else {
    for (const feature of features) {
      // need to disable any check here since there could be an arbitrary key here, nested in arbitrary ways
      // since it is coming from the user's server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let properties: any = feature.properties

      // if the split has multiple parts, we iterate through each one until we access the most deeply nested one
      for (const part of split) {
        if (
          properties &&
          typeof properties === 'object' &&
          part in properties
        ) {
          properties = properties[part]
        } else {
          properties = undefined
          break
        }
      }
      if (properties !== undefined) {
        result.push(properties)
      }
    }
  }

  return result
}

// in OAF endpoints there is no way to get all the features in a collection at once
// so we need to fetch as hits, then fetch as features using the hits as the limit
export async function fetchAllOAFFeatures(urlWithParams: string) {
  const { t } = i18n.global

  const hitsURL = `${urlWithParams}&${new URLSearchParams({
    resulttype: 'hits',
  }).toString()}`

  const response = await fetchWithToken(hitsURL)
  if (response.ok) {
    const hits: ItemsResponse = await response.json()
    const featuresURL = `${urlWithParams}&${new URLSearchParams({
      limit: hits.numberMatched.toString(),
    }).toString()}`
    const featuresResponse = await fetchWithToken(featuresURL)
    if (featuresResponse.ok) {
      return featuresResponse
    } else {
      throw new Error('Failed to fetch features')
    }
  } else {
    throw new Error('Failed to fetch hits')
  }
}

export async function fetchWithToken(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const token = useGlobalStateStore().token

  const newInit = { ...init }

  newInit.headers = new Headers(newInit.headers)
  newInit.headers.set('Authorization', `Bearer ${token}`)

  // Call the native fetch with the updated headers
  return fetch(input, newInit)
}
