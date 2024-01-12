<script>
export default {
  props: ["dificultat"],
  data() {
    return {
      jsonDificultat: [
        {
          text: "Fàcil",
          color: "#7ed776",
          num1Min: 0,
          num1Max: 10,
          num2Min: 0,
          num2Max: 10,
          operador: "+",
          guardat: false,
        },
        {
          text: "Mitjà",
          color: "#768ed7",
          num1Min: 2,
          num1Max: 10,
          num2Min: 2,
          num2Max: 10,
          operador: "*",
          guardat: false,
        },
        {
          text: "Difícil",
          color: "#d77676",
          num1Min: 2,
          num1Max: 5,
          num2Min: 2,
          num2Max: 3,
          operador: "^",
          guardat: false,
        },
      ],
      modalDificultat: false,
      operacioExemple: "",
    };
  },
  methods: {
    exempleOperacio() {
      let resultat = null;
      let num1 = Math.floor(
        Math.random() *
          (parseInt(this.jsonDificultat[this.dificultat].num1Max) -
            parseInt(this.jsonDificultat[this.dificultat].num1Min) +
            1) +
          parseInt(this.jsonDificultat[this.dificultat].num1Min)
      );
      let num2 = Math.floor(
        Math.random() *
          (parseInt(this.jsonDificultat[this.dificultat].num2Max) -
            parseInt(this.jsonDificultat[this.dificultat].num2Min) +
            1) +
          parseInt(this.jsonDificultat[this.dificultat].num2Min)
      );
      let operador = this.jsonDificultat[this.dificultat].operador;
      let operadorEval =
        operador == "^"
          ? "**"
          : operador == "√"
          ? "Math.sqrt(" + num2 * num2 + ")"
          : operador;
      if (operador == "√") {
        resultat = eval(operadorEval);
        this.operacioExemple = `${operador} ${num2 * num2} = ${resultat}`;
      } else {
        resultat = eval(num1 + operadorEval + num2);
        this.operacioExemple = `${num1} ${operador} ${num2} = ${resultat}`;
      }
    },
    afegirDificultat() {
      if (
        parseInt(this.jsonDificultat[this.dificultat].num1Min) <
          parseInt(this.jsonDificultat[this.dificultat].num1Max) &&
        parseInt(this.jsonDificultat[this.dificultat].num2Min) <
          parseInt(this.jsonDificultat[this.dificultat].num2Max)
      ) {
        this.jsonDificultat[this.dificultat].guardat = true;
        this.$emit("afegirDificultat", {
          num1Min: this.jsonDificultat[this.dificultat].num1Min,
          num1Max: this.jsonDificultat[this.dificultat].num1Max,
          num2Min: this.jsonDificultat[this.dificultat].num1Min,
          num2Max: this.jsonDificultat[this.dificultat].num1Max,
          operador: this.jsonDificultat[this.dificultat].operador,
          guardat: this.jsonDificultat[this.dificultat].guardat,
        });
        
        this.modalDificultat = false;
      } else {
        alert("El valor màxim ha de ser més gran que el petit");
      }
    },
  },
  mounted() {},
};
</script>

<template>
  <div>
    <v-btn
      block
      :style="{
        border: '3px solid' + jsonDificultat[this.dificultat].color,
        height: '100px',
      }"
      @click="this.modalDificultat = !this.modalDificultat"
      >{{ jsonDificultat[this.dificultat].text }}
      <p style="text-transform: lowercase" v-if="!this.jsonDificultat[this.dificultat].guardat">(buit)</p>
    </v-btn>
    <v-dialog v-model="modalDificultat" max-width="700">
      <v-card>
        <v-card-title
          class="text-center pt-5"
          style="padding-bottom: 15px; font-size: xx-large; font-weight: bolder"
          >Dificultat {{ jsonDificultat[this.dificultat].text }}</v-card-title
        >
        <v-form @submit.prevent="this.afegirDificultat()">
          <v-card-text>
            <v-row>
              <v-col>
                <v-col>
                  <v-row>
                    <v-text-field
                      label="num1 Mínim"
                      type="number"
                      style="width: 75px"
                      class="mx-3"
                      variant="outlined"
                      v-model="this.jsonDificultat[this.dificultat].num1Min"
                    >
                    </v-text-field>
                    <v-text-field
                      label="num1 Màxim"
                      type="number"
                      class="mx-3"
                      style="width: 75px"
                      variant="outlined"
                      v-model="this.jsonDificultat[this.dificultat].num1Max"
                    >
                    </v-text-field>
                  </v-row>
                </v-col>
                <v-col>
                  <v-select
                    label="Operador"
                    variant="outlined"
                    v-model="this.jsonDificultat[this.dificultat].operador"
                    :items="['+', '-', '*', '/', '^', '√']"
                  >
                  </v-select>
                </v-col>
                <v-col>
                  <v-row>
                    <v-text-field
                      label="num2 Mínim"
                      type="number"
                      class="mx-3"
                      style="width: 75px"
                      variant="outlined"
                      :rules="[
                        (value) => !!value || 'Requerit',
                        (value) =>
                          (value &&
                            parseInt(value) <=
                              parseInt(
                                this.jsonDificultat[this.dificultat].num2Max
                              )) ||
                          'El valor ha de ser més petit que el petit',
                      ]"
                      v-model="this.jsonDificultat[this.dificultat].num2Min"
                    >
                    </v-text-field>
                    <v-text-field
                      label="num2 Màxim"
                      type="number"
                      class="mx-3"
                      style="width: 75px"
                      variant="outlined"
                      :rules="[
                        (value) => !!value || 'Requerit',
                        (value) =>
                          (value &&
                            parseInt(value) >=
                              parseInt(
                                this.jsonDificultat[this.dificultat].num2Min
                              )) ||
                          'El valor ha de ser més gran que el petit',
                      ]"
                      v-model="this.jsonDificultat[this.dificultat].num2Max"
                    >
                    </v-text-field>
                  </v-row>
                </v-col>
              </v-col>
              <v-col>
                <v-card-title
                  class="text-center"
                  style="
                    padding-bottom: 15px;
                    font-size: x-large;
                    font-weight: bolder;
                  "
                  >Exemple d'operació
                </v-card-title>
                <v-container
                  class="operation-box text-center"
                  style="width: 100%; height: 60px"
                  :class="
                    dificultat == 0
                      ? 'easy-border-color'
                      : dificultat == 1
                      ? 'medium-border-color'
                      : 'hard-border-color'
                  "
                >
                  <span class="operation-label"
                    ><b>{{ operacioExemple }}</b></span
                  >
                </v-container>
                <div align="center">
                  <v-btn
                    append-icon="mdi-reload"
                    class="mt-2"
                    color="blue"
                    @click="exempleOperacio()"
                  >
                    Generar exemple</v-btn
                  >
                </div>
              </v-col>
            </v-row>
            <v-row class="pb-3">
              <v-col>
                <v-btn
                  block
                  type="submit"
                  class="pa-5"
                  color="primary"
                  @click="afegirDificultat()"
                  >Afegir</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  class="bg-red-lighten-2 pa-5"
                  block
                  @click="() => (modalDificultat = !modalDificultat)"
                  >Cancela</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
