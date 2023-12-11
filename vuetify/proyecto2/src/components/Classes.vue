<script>
import { getClasses } from "@/services/communicationManager";
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
    };
  },
  methods: {
    async getClasses() {
      const response = await getClasses(this.idProfe);

      if (!response.ok) {
        window.alert("Error al carregar les classes");
      } else {
        const data = await response.json();
        console.log(data);
        this.classes = data;
        this.mostrarPopup = false;
      }
    },
    async crearClase() {
      const response = await fetch(import.meta.env.VITE_NODE_ROUTE + `/crearClasse/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomClasse: this.nombreNuevaClase,
          idUsu: this.idProfe,
        }),
      });
      if (!response.ok) {
      } else {
        this.mostrarPopUp = false;
        this.getClasses();
      }
    },
    async editarClasse() {
      const response = await fetch(import.meta.env.VITE_NODE_ROUTE + `/editarClasse/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomClasse: this.classeEditar.nombreNuevaClasse,
          idClasse: this.classeEditar.idClasse,
        }),
      });
      if (!response.ok) {
      } else {
        this.mostrarPopUpEditar = false;
        this.getClasses();
      }
    },
    setClasseEditar(classe) {
      this.classeEditar = classe;
      this.nombreNuevaClasse = classe.nomClasse;
      this.mostrarPopUpEditar = true;
    },
    createSala(id) {
      socket.emit("createSala", id);
      this.$router.push('/sala');
    }
  },
  mounted() {
    const store = useAppStore();
    this.idProfe = store.getUserId();
    this.getClasses();
  },
};
</script>

<template>
  <div class="full-container">
    <div class="btnCrear">
      <v-btn class="my-button" @click="this.mostrarPopUp = !this.mostrarPopUp">Crear classe

        <v-dialog v-model="this.mostrarPopUp" max-width="600">
          <v-card>
            <v-card-title>Crear nueva clase</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="this.crearClase()">
                <v-text-field v-model="nombreNuevaClase" label="Nombre de la clase"></v-text-field>
                <div class="botonesPopUp">
                  <v-btn type="submit" color="primary">Aceptar</v-btn>
                  <v-btn @click="this.mostrarPopUp = !this.mostrarPopUp" color="error">Cancelar</v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
    <v-container>
      <v-card v-for="classe in classes" :key="classe.idClasse" class="vcard">
        <div class="classe">
          <v-card-title class="titleCard">{{ classe.nomClasse }}</v-card-title>
          <v-btn class="btnEditar" @click="setClasseEditar(classe)">Editar
            <v-dialog v-model="this.mostrarPopUpEditar" max-width="600">
              <v-card>
                <v-card-title>Edita la teva classe</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="this.editarClasse()">
                    <v-text-field v-model="classeEditar.nombreNuevaClasse"></v-text-field>
                    <div class="botonesPopUp">
                      <v-btn type="submit" color="primary">Aceptar</v-btn>
                      <v-btn @click="
                        this.mostrarPopUpEditar = !this.mostrarPopUpEditar
                        " color="error">Cancelar</v-btn>
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
        </div>

        <v-card-text class="txtCard">
          <b>Usuaris: {{ classe.numeroUsuarios }}</b>
          <div>
            <v-btn class="my-button" @click="createSala(classe.idClasse)">Comença</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.btnEditar {
  border: 2px solid black;
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
  margin-top: 70px;
}

.titleCard {
  padding: 30px;
  background-image: url("../assets/Background.png");
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
  border-radius: 2px;
  background-color: #72bae8;
  color: white;
}
</style>
