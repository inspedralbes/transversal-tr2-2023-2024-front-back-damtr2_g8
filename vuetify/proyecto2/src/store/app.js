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
  actions: {
    setUserId(id) {
      this.usuari.id = id;
    },
    getUserId() {
      return this.usuari.id;
    }
  },
})
