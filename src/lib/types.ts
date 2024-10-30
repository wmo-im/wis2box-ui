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

interface Links {
  type: string
  rel: string
  title: string
  href: string
}

interface Feature {
  conformsTo: undefined
  geometry: {
    type: 'Polygon'
    coordinates: number[][]
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

export interface ItemsResponse {
  type: 'FeatureCollection'
  features: Feature[]
  numberMatched: number
  numberReturned: number
  links: Links[]
}
