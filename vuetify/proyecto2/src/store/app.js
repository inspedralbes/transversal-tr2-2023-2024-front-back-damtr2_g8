// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    usuari: {
      nom: "",
      cognom: "",
      email: "",
      id: null,
    }
  }),
  persist: true,
})
