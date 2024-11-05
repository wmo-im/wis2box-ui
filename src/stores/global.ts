// This file uses pinia to manage global state. It stores it in a global object that can be accessed with the context hook, useGlobalStateStore
// This is the only place where global state is stored and makes it easier to manage rather than emitting events to multiple parents

import type { Datastreams, Feature } from '@/lib/types'
import type { Data } from '@vue-leaflet/vue-leaflet/dist/src/utils'
import { defineStore } from 'pinia'

export const useGlobalStateStore = defineStore('globalState', {
  // All the variables that can be accessed globally
  state: () => {
    return {
      token: null as string | null,
      error: {
        message: null as string | null,
        status_code: null as number | null,
        url: null as string | null,
      },
      selectedStation: null as Feature | null,
      selectedDatastream: null as Datastreams[0] | null,
    }
  },
  actions: {
    setToken(newToken: string) {
      this.token = newToken
    },
    clearToken() {
      this.token = null
    },
    setError(message: string, url: string | null, status_code: number | null) {
      this.error.message = message
      this.error.status_code = status_code
      this.error.url = url
    },
    clearError() {
      this.error.message = null
      this.error.status_code = null
      this.error.url = null
    },
    setSelectedStation(station: Feature) {
      this.selectedStation = station
    },
    clearSelectedStation() {
      this.selectedStation = null
    },
    setSelectedDatastream(datastream: Datastreams[0]) {
      this.selectedDatastream = datastream
    },
    clearSelectedDatastream() {
      this.selectedDatastream = null
    },
  },
})
