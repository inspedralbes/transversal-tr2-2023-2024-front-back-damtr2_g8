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
    getOperation(dificultad) {
      socket.emit("getOperation", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
        dificultad: dificultad
      });
    },
    restarVida(dificultad) {
      socket.emit("restarVida", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
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
          (jugador) => jugador.idSocket == socket.id
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
      <v-row class="px-12 py-5" style="margin: 0;" v-if="!emptyGameData">
        <v-col>
          <h2>{{ setPartida.jugadores[idPlayer].username }}</h2>
          <div class="PS-container">
            <div class="PS elevation-3" v-bind:style="{
              width: setPartida.jugadores[idPlayer].vida + '%',
            }">
              <p>{{ setPartida.jugadores[idPlayer].vida }}</p>
            </div>
          </div>
        </v-col>
        <v-col align="right">
          <h2>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].username }}</h2>
          <div class="PS-container" align="left">
            <div class="PS elevation-3" v-bind:style="{
              width: setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida + '%',
            }">
              <p>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="game-bar">
      <v-row class="mx-8" style="margin: 0">
        <v-col sm="4" lg="6" md="6" cols="2">
          <v-sheet align="center" class="bg-transparent">
            <v-row class=" dificulty-container">
              <v-col align="center">
                <v-btn class="dificulty-option rounded-lg" style="background-color: #7ed776"
                  @click="getOperation(1)">Facil</v-btn>
              </v-col>
              <v-col align="center">
                <v-btn class="dificulty-option rounded-lg" style="background-color: #768ed7"
                  @click="getOperation(2)">Medio</v-btn>
              </v-col>
              <v-col align="center">
                <v-btn class="dificulty-option rounded-lg" style="background-color: #d77676"
                  @click="getOperation(3)">Dificil</v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col sm="6" lg="6">
          <div>
            <div>
              Operacion:

              {{ setPartida.jugadores[idPlayer].operacion }}
            </div>
            <v-text-field label="?" type="number" v-model="result"></v-text-field>
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
  background: lightblue;
  height: 100vh;
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
  background: url('../assets/BackgroundGreen.png') center center no-repeat;
  background-size: cover;
}

.PS p {
  font-weight: 800;
  font-size: 23px;
  padding: 10px;
  color: green;
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
  height: fit-content;
}
</style>
