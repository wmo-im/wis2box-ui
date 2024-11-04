export interface FeatureLayerForMap {
  properties: {
    num_obs: number
    name: string
  }
}

export interface Observation {
  units: string
  value: string
  description: string
}

export interface Station {
  properties: {
    topic: string
  }
  id: string
}

// A link response from pygeoapi
interface Links {
  type: string
  rel: string
  title: string
  href: string
}

// Represents one feature within the feature collection of a OAF items/ response
interface Feature {
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
    contacts: undefined[]
    'wmo:dataPolicy': string
    'wmo:topicHierarchy': string
    id: string
  }
  links: Links[]
}

// Represents the response from the OAF /items endpoint, such as ${oapi}/collections/discovery-metadata/items
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

// Represents the response from the OAF /collections endpoint
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
