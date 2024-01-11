<script>
export default {
  props: ["dificultat"],
  data() {
    return {
      modalDificultat: false,
      operacio: {
        num1Min: null,
        num1Max: null,
        num2Min: null,
        num2Max: null,
        operador: null,
      },
    };
  },
  methods: {},
  mounted() {
    this.store.usuari.id == null ? this.$router.push("/inici") : null;
    this.idProfe = this.store.usuari.id;
    this.getClasses();
    this.getDificultats();
  },
};
</script>

<template>
  <v-dialog v-model="modalFacil" max-width="500">
    <v-card>
      <v-card-title
        class="text-center pt-5"
        style="padding-bottom: 15px; font-size: xx-large; font-weight: bolder"
        >Dificultat Fàcil</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col>
            <v-col>
              <v-row>
                <v-text-field
                  label="num1Min"
                  type="numeric"
                  v-model="this.operacio.num1Min"
                >
                </v-text-field>
                <v-text-field
                  label="num1Max"
                  type="numeric"
                  v-model="this.operacio.num1Max"
                >
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
            style="background-color: greenyellow; margin: 15px"
            >Afegir</v-btn
          >
          <v-btn
            @click="cerrarOperaciones()"
            style="background-color: red; margin: 15px"
            >Sortir</v-btn
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
