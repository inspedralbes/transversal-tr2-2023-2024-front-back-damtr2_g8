<script>
export default {
  data() {
    return {
      user1: {
        name: "Marti",
        ps: 100,
      },
      user2: {
        name: "Damia",
        ps: 100,
      },
      operacion: "",
      seeOperation: false,
      result: null,
    };
  },
  methods: {
    getOperation(option) {
      let url = "http://localhost:3751/";

      switch (option) {
        case 0:
          url += "operacioFacil";
          break;
        case 1:
          url += "operacioMitg";
          break;
        case 2:
          url += "operacioDificil";
          break;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.operacion = data.operation;
          this.seeOperation = true;
        });
    },
    solveOperation() {
      console.log(this.result);
      let url =
        "http://localhost:3751/resoldre/" +
        this.operacion.num1 +
        "/" +
        this.operacion.num2 +
        "/" +
        this.operacion.operator;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.seeOperation = false;
        });
    },
  },
  mounted() {},
};
</script>

<template>
  <v-container>
    <v-sheet>
      <v-row class="px-12 py-5">
        <v-col class="PS-container">
          <h2>{{ user1.name }}</h2>
          <div class="PS">{{ user1.ps }}</div>
        </v-col>
        <v-col class="PS-container" align="right">
          <h2>{{ user2.name }}</h2>
          <div class="PS" align="left">{{ user2.ps }}</div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-sheet align="center">
      <v-row class="py-16 dificulty-container">
        <v-col align="center">
          <v-btn
            class="dificulty-option rounded-lg"
            style="background-color: #7ed776"
            @click="getOperation(0)"
            >Facil</v-btn
          >
        </v-col>
        <v-col align="center">
          <v-btn
            class="dificulty-option rounded-lg"
            style="background-color: #768ed7"
            @click="getOperation(1)"
            >Medio</v-btn
          >
        </v-col>
        <v-col align="center">
          <v-btn
            class="dificulty-option rounded-lg"
            style="background-color: #d77676"
            @click="getOperation(2)"
            >Dificil</v-btn
          >
        </v-col>
      </v-row>
    </v-sheet>
    <div v-if="seeOperation">
      <div>Operacion: {{ operacion }}</div>
      <v-text-field
        label="Resultado"
        type="number"
        v-model="result"
      ></v-text-field>
      <v-btn @click="solveOperation()">Resolver</v-btn>
    </div>
  </v-container>
</template>

<style scoped>
.PS {
  font-weight: 800;
  font-size: 23px;
  padding: 10px;
  width: 60%;
  background-color: rgb(153, 153, 153);
}

.PS::before {
  width: 10%;
  height: 100%;
  border-radius: 2px;

  position: absolute;

  background-color: greenyellow;
}

.dificulty-option {
  font-size: 30px !important;
  font-weight: 800 !important;
  height: 300px !important;
  width: 60%;
}

.dificulty-container {
  width: 80%;
}
</style>
