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
        ps: 10,
      },
      operacion: "",
      seeOperation: true,
      result: null,
    };
  },
  methods: {
    getOperation(option) {
      //SOCKETS
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
  <div class="game-container">
    <v-sheet class="content-wrap">
      <v-row class="px-12 py-5">
        <v-col>
          <h2>{{ user1.name }}</h2>
          <div class="PS-container">
            <div
              class="PS"
              v-bind:style="{
                width: user1.ps + '%',
              }"
            >
              <p>{{ user1.ps }}</p>
            </div>
          </div>
        </v-col>
        <v-col align="right">
          <h2>{{ user2.name }}</h2>
          <div class="PS-container" align="left">
            <div
              class="PS"
              v-bind:style="{
                width: user2.ps + '%',
              }"
            >
              <p>{{ user2.ps }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="game-bar">
      <v-row class="mx-8">
        <v-col sm="6" lg="4" cols="2">
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
        </v-col>
        <v-col>
          <div v-if="seeOperation">
            <div>Operacion: {{ operacion }}</div>
            <v-text-field
              label="?"
              type="number"
              v-model="result"
            ></v-text-field>
            <v-btn @click="solveOperation()">Resolver</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style>
.game-container {
  position: relative;
  min-height: 100vh;
}

.content-wrap {
  padding-bottom: 2.5rem;
}

.PS-container {
  background: rgb(153, 153, 153);
  width: 60%;
  display: flex;
}

.PS {
  background-color: greenyellow;
}

.PS p {
  font-weight: 800;
  font-size: 23px;
  padding: 10px;
}

.dificulty-option {
  font-size: 25px !important;
  font-weight: 800 !important;
  height: 200px !important;
  width: 100%;
}

.dificulty-container {
  width: 100%;
}

.game-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 18.5rem;
}
</style>
