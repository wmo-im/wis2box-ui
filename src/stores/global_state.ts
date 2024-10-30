// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('globalState', {
  state: () => {
    return {
      token: null as string | null,
    }
  },
  actions: {
    setToken(newToken: string) {
      this.token = newToken
    },
    clearToken() {
      this.token = null
    },
  },
})
