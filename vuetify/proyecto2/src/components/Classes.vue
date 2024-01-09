<template>
  <div class="full-container">
    <div class="btnCrear">
      <v-btn
        class="my-button create_class-button"
        prepend-icon="mdi-plus"
        @click="this.mostrarPopUp = !this.mostrarPopUp"
        >Crear classe

        <v-dialog v-model="this.mostrarPopUp" max-width="500">
          <v-card class="py-5">
            <v-card-title
              class="text-center"
              style="
                padding-top: 8px;
                padding-bottom: 25px;
                font-size: xx-large;
                font-weight: bolder;
              "
              >Crea una nova classe</v-card-title
            >
            <v-card-text>
              <v-form @submit.prevent="this.crearClase()">
                <v-text-field
                  label="Nom de la nova classe"
                  variant="outlined"
                  :rules="[
                    (value) => !!value || 'Requerit',
                    (value) =>
                      (value && value.length >= 3) || 'Mínim 3 caràcters.',
                  ]"
                  v-model="nombreNuevaClase"
                ></v-text-field>
                <v-row>
                  <v-col>
                    <v-btn block type="submit" class="pa-5" color="primary"
                      >Aceptar</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      class="bg-red-lighten-2 pa-5"
                      block
                      @click="this.mostrarPopUp = !this.mostrarPopUp"
                      >Cancelar</v-btn
                    >
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
        <v-col
          v-for="classe in classes"
          :key="classe.idClasse"
          sm="6"
          lg="4"
          cols="12"
        >
          <v-card class="vcard">
            <div class="classe">
              <v-card-title class="titleCard"
                >{{ classe.nomClasse }}
                <v-btn class="editBtn" @click="setClasseEditar(classe)">
                  <svg
                    width="40px"
                    height="40px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M12 5H9C7.11438 5 6.17157 5 5.58579 5.58579C5 6.17157 5 7.11438 5 9V15C5 16.8856 5 17.8284 5.58579 18.4142C6.17157 19 7.11438 19 9 19H15C16.8856 19 17.8284 19 18.4142 18.4142C19 17.8284 19 16.8856 19 15V12M9.31899 12.6911L15.2486 6.82803C15.7216 6.36041 16.4744 6.33462 16.9782 6.76876C17.5331 7.24688 17.5723 8.09299 17.064 8.62034L11.2329 14.6702L9 15L9.31899 12.6911Z"
                        stroke="#000000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                  <v-dialog v-model="mostrarPopUpEditar" max-width="500">
                    <v-card class="py-5">
                      <v-card-title class="text-center">
                        <v-row>
                          <v-col cols="10">
                            <div
                              style="
                                padding-left: 95px;
                                padding-top: 8px;
                                font-size: xx-large;
                                font-weight: bolder;
                              "
                            >
                              Edita la teva classe
                            </div>
                          </v-col>
                          <v-col>
                            <v-btn
                              @click="eliminarClasse()"
                              icon="mdi-delete"
                              class="mb-5 bg-red-lighten-1"
                            ></v-btn>
                          </v-col>
                        </v-row>
                      </v-card-title>
                      <v-card-text>
                        <v-form @submit.prevent="editarClasse()">
                          <v-text-field
                            label="Nom"
                            variant="outlined"
                            :rules="[
                              (value) => !!value || 'Requerit',
                              (value) =>
                                (value && value.length >= 3) ||
                                'Mínim 3 caràcters.',
                            ]"
                            v-model="classeEditar.nombreNuevaClasse"
                          ></v-text-field>
                          <div class="botonesPopUp">
                            <v-row>
                              <v-col>
                                <v-btn
                                  block
                                  type="submit"
                                  class="pa-5"
                                  color="primary"
                                  >Aceptar</v-btn
                                >
                              </v-col>
                              <v-col>
                                <v-btn
                                  class="bg-red-lighten-2 pa-5"
                                  block
                                  @click="
                                    mostrarPopUpEditar = !mostrarPopUpEditar
                                  "
                                  >Cancelar</v-btn
                                >
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
              <v-chip color="blue" append-icon="mdi-account-multiple">
                {{ classe.numeroUsuarios }}
              </v-chip>
              <div>
                <v-row>
                  <v-col>
                    <v-sheet>
                      <v-btn
                        block
                        class="my-button"
                        @click="createSala(classe.idClasse)"
                        >Comença</v-btn
                      >
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet>
                      <v-select
                        label="dificultat"
                        v-model="selectedDificultats[classe.idClasse]"
                        item-title="nomDificultat"
                        item-text="nomDificultat"
                        :items="this.dificultats"
                        @update:modelValue="
                          checkDefaultDifficulty(
                            selectedDificultats[classe.idClasse],
                            classe.idClasse
                          )
                        "
                      ></v-select>
                    </v-sheet>
                    <v-dialog
                      v-model="this.mostrarCrearDificultat"
                      max-width="500"
                    >
                      <v-card>
                        <v-card-title class="text-h5"
                          >Crear nova dificultat</v-card-title
                        >
                        <v-card-text>
                          <v-form @submit.prevent="crearNuevaDificultat">
                            <v-text-field
                              v-model="nuevaDificultatNombre"
                              label="Nombre de la Nueva Dificultat"
                              required
                            ></v-text-field>
                            <v-row>
                              <v-btn
                                @click="
                                  this.mostrarOperaciones =
                                    !this.mostrarOperaciones
                                "
                                color="primary"
                                >Següent</v-btn
                              >
                              <v-btn @click="cancelarCrearDificultat"
                                >Cancelar</v-btn
                              >
                            </v-row>
                          </v-form>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="mostrarOperaciones" max-width="500">
                      <v-card>
                        <v-card-title class="text-h5"
                          >Afegir operacions</v-card-title
                        >
                        <v-card-text>
                          <v-row>
                            <v-col>
															<v-select
                                label="Dificultat"
																v-model="this.operacio.dificultat"
                                :items="['Fàcil', 'Mitjà', 'Difícil']"
                              >
                              </v-select>
                              <v-col>
                                <v-row>
                                  <v-text-field label="num1Min" type="numeric" v-model="this.operacio.num1Min">
                                  </v-text-field>
                                  <v-text-field label="num1Max" type="numeric" v-model="this.operacio.num1Max">
                                  </v-text-field>
                                </v-row>
                              </v-col>

                              <v-col>
                                <v-select
                                  label="Operador"
																	v-model="this.operacio.operador"
                                  :items="['+', '-', '*', '/', '^']"
                                >
                                </v-select>
                              </v-col>
                              <v-col>
                                <v-col>
                                  <v-row>
                                    <v-text-field
                                      label="num2Min"
                                      type="numeric"
																			v-model="this.operacio.num2Min"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                      label="num2Max"
                                      type="numeric"
																			v-model="this.operacio.num2Max"
                                    >
                                    </v-text-field>
                                  </v-row>
                                </v-col>
                              </v-col>
                            </v-col>
														
														
                          </v-row>
                          <v-row>
                            <v-btn
														@click="afegirOperacio()"
														style="background-color: greenyellow; margin: 15px;"
														
														>Afegir</v-btn>
                            <v-btn
                              @click="cerrarOperaciones()"
															style="background-color: red; margin: 15px;"
                              >Salir</v-btn
                            >
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>
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
  getDificultatsFetch,
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
      mostrarCrearDificultat: false,
      mostrarOperaciones: false,
      store: useAppStore(),
      showDefaultDifficultyDialog: {},
      dificultats: [
        {
          idDificultat: null,
          nomDificultat: null,
          idProfe: null,
        },
      ],
      selectedDificultats: {},
			operacio:{
				dificultat: null,
				num1Min: null,
				num1Max: null,
				num2Min: null,
				num2Max: null,
				operador: null,
			}
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
          console.log(`Error al crear la clase`);
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
    async getDificultats() {
      console.log(`idProfe: `, this.idProfe);
      const response = await getDificultatsFetch(this.idProfe);
      if (!response.ok) {
        window.alert("Error al carregar les dificultats");
      } else {
        const data = await response.json();
        this.dificultats = data;
        console.log(`Dificultats: `, this.dificultats);
        var crearDificultat = {
          idDificultat: null,
          nomDificultat: "Crear dificultat",
          idProfe: null,
        };
        this.dificultats.push(crearDificultat);
      }

      // Inicializa selectedDificultats para cada clase
      this.classes.forEach((classe) => {
        this.selectedDificultats[classe.idClasse] = {
          idDificultat: null,
          nomDificultat: null,
          idProfe: null,
        };
      });
    },
    checkDefaultDifficulty(selectedDificultat, classeId) {
      console.log(selectedDificultat, " ", classeId);
      const isDefaultDifficulty = selectedDificultat == "Crear dificultat";
      console.log(isDefaultDifficulty);

      if (isDefaultDifficulty) {
        this.showDefaultDifficultyDialog[classeId] = true;
        console.log(`mostrarCrearDificultad: `, this.mostrarCrearDificultat);
        this.mostrarCrearDificultat = true;
      }
    },

    cancelarCrearDificultat() {
      if (this.mostrarCrearDificultat) {
        this.mostrarCrearDificultat = false;
      }
    },

		afegirOperacio(){
			console.log('se añade operacion');
			console.log('operacio: ', this.operacio);
		},
		cerrarOperaciones(){
			this.mostrarOperaciones = false;
			this.mostrarCrearDificultat = false;
		}
	},
  mounted() {
    this.store.usuari.id == null ? this.$router.push("/inici") : null;
    this.idProfe = this.store.usuari.id;
    this.getClasses();
    this.getDificultats();
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
  margin-top: 25px;
  margin-left: 2.9dvw;
  border-radius: 20px;
}
</style>
