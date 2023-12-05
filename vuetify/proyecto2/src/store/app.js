// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    idProfessor:null,
  }),
  actions: {
    setIdProfessor(idProfessor) {
      this.idProfessor = idProfessor
    },
    getIdProfessor() {
      return this.idProfessor
    }
  },
})
