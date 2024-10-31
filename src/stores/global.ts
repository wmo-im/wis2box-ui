import { defineStore } from 'pinia'

export const useGlobalStateStore = defineStore('globalState', {
  state: () => {
    return {
      token: null as string | null,
      error: {
        message: null as string | null,
        status_code: null as number | null,
        url: null as string | null,
      },
      dialog: false,
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
  },
})
