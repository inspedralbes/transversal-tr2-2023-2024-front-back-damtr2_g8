// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    usuari: {
      nom: "",
      cognom: "",
      email: "",
      id: null,
      avatar: 0,
      classe: "",
    }
  }),
  persist: true,
})
