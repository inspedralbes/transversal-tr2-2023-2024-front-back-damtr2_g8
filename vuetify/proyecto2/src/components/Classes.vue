<template>
  <div class="full-container">
    <div class="btnCrear">
      <v-btn class="my-button create_class-button" prepend-icon="mdi-plus"
        @click="this.mostrarPopUp = !this.mostrarPopUp">Crear classe

        <v-dialog v-model="this.mostrarPopUp" max-width="600">
          <v-card class="py-5">
            <v-card-title class="text-center" style="padding-top: 8px; font-size: xx-large; font-weight: bolder">Crear
              nova classe</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="this.crearClase()">
                <v-text-field label="Nom de la nova classe" variant="outlined" :rules="[
                  (value) => !!value || 'Requerit',
                  (value) =>
                    (value && value.length >= 3) || 'Mínim 3 caràcters.',
                ]"></v-text-field>
                <v-row>
                  <v-col>
                    <v-btn block type="submit" class="pa-5" color="primary">Aceptar</v-btn>
                  </v-col>
                  <v-col>
                    <v-btn class="bg-red-lighten-2 pa-5" block
                      @click="this.mostrarPopUp = !this.mostrarPopUp">Cancelar</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
    <v-container class="mt-12">
      <v-row>
        <v-col v-for="classe in classes" :key="classe.idClasse" sm="6" lg="4" cols="12">
          <v-card class="vcard">
            <div class="classe">
              <v-card-title class="titleCard">{{ classe.nomClasse }}
                <v-btn class="editBtn" @click="setClasseEditar(classe)">
                  <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000">
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M12 5H9C7.11438 5 6.17157 5 5.58579 5.58579C5 6.17157 5 7.11438 5 9V15C5 16.8856 5 17.8284 5.58579 18.4142C6.17157 19 7.11438 19 9 19H15C16.8856 19 17.8284 19 18.4142 18.4142C19 17.8284 19 16.8856 19 15V12M9.31899 12.6911L15.2486 6.82803C15.7216 6.36041 16.4744 6.33462 16.9782 6.76876C17.5331 7.24688 17.5723 8.09299 17.064 8.62034L11.2329 14.6702L9 15L9.31899 12.6911Z"
                        stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                  <v-dialog v-model="mostrarPopUpEditar" max-width="500">
                    <v-card class="py-5">
                      <v-card-title class="text-center">
                        <v-row>
                          <v-col cols="10">
                            <div style="
                                padding-left: 95px;
                                padding-top: 8px;
                                font-size: xx-large;
                                font-weight: bolder;
                              ">
                              Edita la teva classe
                            </div>
                          </v-col>
                          <v-col>
                            <v-btn @click="eliminarClasse()" icon="mdi-delete" class="mb-5 bg-red-lighten-1"></v-btn>
                          </v-col>
                        </v-row>
                      </v-card-title>
                      <v-card-text>
                        <v-form @submit.prevent="editarClasse()">
                          <v-text-field label="Nom" variant="outlined" :rules="[
                            (value) => !!value || 'Requerit',
                            (value) =>
                              (value && value.length >= 3) ||
                              'Mínim 3 caràcters.',
                          ]" v-model="classeEditar.nombreNuevaClasse"></v-text-field>
                          <div class="botonesPopUp">
                            <v-row>
                              <v-col>
                                <v-btn block type="submit" class="pa-5" color="primary">Aceptar</v-btn>
                              </v-col>
                              <v-col>
                                <v-btn class="bg-red-lighten-2 pa-5" block @click="
                                  mostrarPopUpEditar = !mostrarPopUpEditar
                                  ">Cancelar</v-btn>
                              </v-col>
                            </v-row>
                          </div>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-btn>
              </v-card-title>
            </div>

            <v-card-text class="txtCard">
              <b>Número d'usuaris: {{ classe.numeroUsuarios }}</b>
              <div>
                <v-btn class="my-button" @click="createSala(classe.idClasse)">Uneix-te</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  getClassesFetch,
  createClasse,
  editClasse,
  deleteClasse,
} from "@/services/communicationManager";
import { socket } from "@/services/socket";
import { useAppStore } from "@/store/app";

export default {
  data() {
    return {
      idProfe: null,
      classes: [],
      mostrarPopUp: false,
      nombreNuevaClase: "",
      mostrarPopUpEditar: false,
      classeEditar: null,
      store: useAppStore(),
    };
  },
  methods: {
    async getClasses() {
      const response = await getClassesFetch(this.idProfe);

      if (!response.ok) {
        window.alert("Error al carregar les classes");
      } else {
        const data = await response.json();
        this.classes = data;
        this.mostrarPopup = false;
      }
    },
    async crearClase() {
      if (this.nombreNuevaClase.length > 2) {
        const response = await createClasse(
          this.nombreNuevaClase,
          this.idProfe
        );

        if (!response.ok) {
        } else {
          this.mostrarPopUp = false;
          this.nombreNuevaClase = "";
          this.getClasses();
        }
      }
    },
    async editarClasse() {
      if (this.classeEditar.nombreNuevaClasse.length > 2) {
        const response = await editClasse(this.classeEditar);

        if (response.ok) {
          this.mostrarPopUpEditar = false;
          this.getClasses();
        }
      }
    },
    setClasseEditar(classe) {
      this.classeEditar = classe;
      this.nombreNuevaClasse = classe.nomClasse;
      this.mostrarPopUpEditar = true;
    },
    createSala(id) {
      socket.emit("createSala", id, this.store.usuari.id);
      this.store.usuari.classe = id;
      this.$router.push("/sala");
    },
    async eliminarClasse() {
      const response = await deleteClasse(this.classeEditar);
      if (response.ok) {
        this.mostrarPopUpEditar = false;
        this.getClasses();
      }
    },
  },
  mounted() {
    this.store.usuari.id == null ? this.$router.push("/inici") : null;
    this.idProfe = this.store.usuari.id;
    this.getClasses();
  },
};
</script>

<style scoped>
.full-container {
  min-height: 100vh;
  margin: 0;
  background-color: lightblue;
}

.v-card {
  overflow-y: hidden !important;
}

.editBtn {
  border-radius: 100px;
  width: 60px;
  height: 60px !important;
  position: absolute;
  top: 16px;
  right: 16px;
}

.classe {
  display: flex;
  justify-content: space-between;
  background-image: url("../assets/Background.png");
}

.btnCrear {
  display: flex;
  justify-content: flex-start;
  padding: 15px;
}

.botonesPopUp {
  display: flex;
  justify-content: space-between;
}

.full-container {
  background-color: lightblue;
}

.vcard {
  margin: 8px !important;
}

.titleCard {
  padding: 30px;
}

.titleCard2 {
  padding: 30px;
  background-image: url("../assets/BackgroundGreen.png");
}

.txtCard {
  padding: 20px;
  margin-top: 20px;
}

.my-button {
  margin-top: 10px;
  padding: auto;
  border-radius: 4px;
  background-color: #72bae8;
  color: white;
}

.create_class-button {
  margin-top: 17px;
  margin-left: 2.9dvw;
  padding: 30;
  border-radius: 20px;
}
</style>
