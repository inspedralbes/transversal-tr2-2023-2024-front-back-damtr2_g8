<script setup>
import { socket, state } from "@/services/socket";
</script>

<script>
export default {
  data() {
    return {
      result: null,
      emptyGameData: true,
      username: "",
      idPlayer: null,
    };
  },
  methods: {
    getOperation() {
      socket.emit("getOperation", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
      });
    },
    restarVida(dificultad) {
      socket.emit("restarVida", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer == 1 ? 0 : 1,
        idCantidad: dificultad,
      });
    },
    conectar() {
      socket.emit("conectarUsuario", { username: this.username });
    },
    solveOperation() {
      socket.emit("solveOperation", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
        result: this.result,
      });
    },
  },
  computed: {
    setPartida() {
      this.emptyGameData = false;
      this.idPlayer =
        state.partida.jugadores.findIndex(
          (jugador) => jugador.username == this.username
        ) == 0
          ? 0
          : 1;
      console.log(state.partida);
      return state.partida;
    },
  },
  mounted() {
    this.username = prompt();
    this.conectar();
    this.setPartida;
  },
};
</script>

<template>
  <div class="game-container">
    <v-sheet class="content-wrap bg-transparent">
      <v-row class="px-12 py-5" v-if="!emptyGameData">
        <v-col>
          <h2>{{ setPartida.jugadores[idPlayer].username }}</h2>
          <div class="PS-container">
            <div
              class="PS"
              v-bind:style="{
                width: setPartida.jugadores[idPlayer].vida + '%',
              }"
            >
              <p>{{ setPartida.jugadores[idPlayer].vida }}</p>
            </div>
          </div>
        </v-col>
        <v-col align="right">
          <h2>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].username }}</h2>
          <div class="PS-container" align="left">
            <div
              class="PS"
              v-bind:style="{
                width: setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida + '%',
              }"
            >
              <p>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="game-bar">
      <v-row class="mx-8">
        <v-col sm="6" lg="4" cols="2">
          <v-sheet align="center" class="bg-transparent">
            <v-row class="py-16 dificulty-container">
              <v-col align="center">
                <v-btn
                  class="dificulty-option rounded-lg"
                  style="background-color: #7ed776"
                  @click="getOperation(1)"
                  >Facil</v-btn
                >
              </v-col>
              <v-col align="center">
                <v-btn
                  class="dificulty-option rounded-lg"
                  style="background-color: #768ed7"
                  @click="getOperation(2)"
                  >Medio</v-btn
                >
              </v-col>
              <v-col align="center">
                <v-btn
                  class="dificulty-option rounded-lg"
                  style="background-color: #d77676"
                  @click="getOperation(3)"
                  >Dificil</v-btn
                >
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col>
          <div>
            <div>
              Operacion:

              {{ setPartida.jugadores[idPlayer].operacion }}
            </div>
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

<style scoped>
.PS {
  font-weight: 800;
  font-size: 23px;
  width: 60%;
  background-color: rgb(153, 153, 153);
}

.game-container {
  background: radial-gradient(lightblue, rgb(81, 180, 213));
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
