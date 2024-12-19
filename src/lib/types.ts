// Colors used for representing density on the map legend
export enum LegendColors {
  Green = '#009900',
  Yellow = '#FF9900',
  Red = '#FF3300',
  Gray = '#708090',
}

// A link response from pygeoapi
interface Links {
  type: string
  rel: string
  title: string
  href: string
}

// Trace represents data that is used for plotting the history, plotting the datastream as timeseries
// or displaying the timeseries as a table
export interface Trace {
  x: string[]
  // possible to have a graph without y values if we are just plotting history and want to show the number of observations
  y?: number[]
  type: string
  marker?: {
    color: string
  }
  xbins: {
    size: number
  }
  name?: string
}

// Any of the properties in the items response could be a potential datastream
export type Datastreams = Array<ItemsResponse['features'][0]['properties']>

// Represents one feature within the feature collection of a OAF items/ response
export interface Feature {
  id: string
  conformsTo: undefined
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: {
    identifier: string
    title: string
    description: string
    language: string
    type: string
    created: string
    updated: string
    contacts: []
    'wmo:dataPolicy': string
    'wmo:topicHierarchy': string
    id: string
    // Many additional fields. Can't enumerate them all since the
    // user can add additional properties they want in the backend
    name?: string
    topic?: string
    topics?: string[]
    wmo_region?: string
    num_obs?: number
    reportTime?: string
    reportId?: string
    units?: string
    phenomenonTime?: string
    wigos_station_identifier?: string
    value?: number
    url?: string
  }
  links: Links[]
}

// Represents the JSON response from the OAF /items endpoint, such as ${oapi}/collections/discovery-metadata/items
export interface ItemsResponse {
  type: 'FeatureCollection'
  features: Feature[]
  numberMatched: number
  numberReturned: number
  links: Links[]
}

// Superset of Feature, with additional helper fields for easier use in the frontend
export interface Dataset extends Feature {
  hasObs: boolean
  id: string
  bbox: number[]
  // links in a format that can be used by the wis2box UI
  uiLinks: Array<{
    href: string | undefined
    target: string | undefined
    type: string
    msg: string
    icon: string
  }>
}

// Represents the JSON response from the OAF /collections endpoint
// when requesting multiple collections.
export interface CollectionsResponse {
  collections: {
    id: 'stations' | 'messages' | 'discovery-metadata' | string // could be a few special collections or an arbitrary string
    title: string
    description: string
    keywords: string
    links: Links[]
    extent: {
      spatial: {
        bbox: number[][]
        crs: string
      }
    }
    crs: string
    storageCRS: string
  }[]
  links: Links[]
}

// Represents the JSON response from the OAF /process endpoint
export interface ProcessResponse {
  code: 'success' | string
  id: string
  value: ItemsResponse
}

// Represents the different collection choices a user can select on the DatasetView view
export interface Choices {
  collection: {
    title: string
  }
  discovery_metadata: ItemsResponse['features']
  stations: ItemsResponse
  collections: CollectionsResponse['collections']
  station: Set<string>
  datastream: {
    id: string
    index: string
    name: string
    units: string
  }
}
