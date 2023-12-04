<template>
  <div class="full-container">
    <div class="btnCrear">
      <v-btn class="my-button" @click="this.mostrarPopUp = !this.mostrarPopUp"
        >Crear classe

        <v-dialog v-model="this.mostrarPopUp" max-width="600">
          <v-card>
            <v-card-title>Crear nueva clase</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="this.crearClase()">
                <v-text-field
                  v-model="nombreNuevaClase"
                  label="Nombre de la clase"
                ></v-text-field>
                <div class="botonesPopUp">
                  <v-btn type="submit" color="primary">Aceptar</v-btn>
                  <v-btn
                    @click="this.mostrarPopUp = !this.mostrarPopUp"
                    color="error"
                    >Cancelar</v-btn
                  >
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
    <v-container>
      <v-card v-for="classe in classes" :key="classe.idClasse" class="vcard">
        <v-card-title class="titleCard">{{ classe.nomClasse }}</v-card-title>
        <v-card-text class="txtCard">
          <b>Usuaris: {{ classe.numeroUsuarios }}</b>
          <div>
            <v-btn class="my-button" @click="$router.push('/sala')"
              >Uneix-te</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
export default {
  data() {
    return {
      idProfe: null,
      classes: [],
      mostrarPopUp: false,
      nombreNuevaClase: "",
    };
  },
  methods: {
    async getClasses() {
      const response = await fetch(
        `http://localhost:3751/classeProfe/${this.idProfe}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        window.alert("Error al carregar les classes");
      } else {
        const data = await response.json();
        this.classes = data;
        this.mostrarPopup = false;
      }
    }, async crearClase(){
      const response = await fetch(`http://localhost:3751/crearClasse/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "nomClasse": this.nombreNuevaClase,
          "idUsu": this.idProfe,
        }),
      });
      if (!response.ok) {
        window.alert("Error al crear la classe");
      } else {
        window.alert("Classe creada correctament");
        this.mostrarPopUp = false;
        this.getClasses();
      }
    }
  },
  mounted() {
    const store = useAppStore();
    this.idProfe = store.getIdProfessor();
    this.getClasses();
  },
};
</script>

<style scoped>
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
  background-color: white;
}

.vcard {
  margin-top: 20px;
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
  padding: 30px;
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
