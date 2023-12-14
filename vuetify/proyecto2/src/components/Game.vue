<script setup>
import { socket, state } from "@/services/socket";
import { useAppStore } from "@/store/app";
</script>

<script>
export default {
  data() {
    return {
      result: null,
      emptyGameData: true,
      store: useAppStore(),
      idPlayer: null,
      avatar: null,
      flip: true,
      hit: false,
    };
  },
  mounted() {
    this.avatar = this.store.usuari.avatar;
    this.conectar();
    this.setPartida;
  },
  methods: {
    getOperation(dificultad) {
      socket.emit("getOperation", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
        dificultad: dificultad
      });

    },
    conectar() {
      socket.emit("conectarUsuario", { username: this.store.usuari.nom, avatar: this.store.usuari.avatar, id_sala: state.sala });
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
      this.idPlayer = state.partida.jugadores.findIndex((jugador) => jugador.idSocket == socket.id) == 0 ? 0 : 1;
      console.log(state.partida);
      return state.partida;
    },
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
            <div class="PS " v-bind:style="{
              width: setPartida.jugadores[idPlayer].vida + '%',
            }">
              <p>{{ setPartida.jugadores[idPlayer].vida }}</p>
            </div>
          </div>
        </v-col>
        <v-col align="right">
          <h2>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].username }}</h2>
          <div class="PS-container" :class="{ shake: hit }" align="left">
            <div class="PS " v-bind:style="{
              width: setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida + '%',
            }">
              <p>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="game-bar">
      <v-row>
        <v-col cols="3">
          <div>
            <img
              :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + setPartida.jugadores[idPlayer].avatar + "&scale=80&flip=false&eyes=angry&mouth=teethSmile"'
              alt="Avatar" style="width:300px;">
          </div>
        </v-col>
        <v-col cols="6">
          <div class="input-container">
            <div class="operation-box">
              <span class="operation-label"><b>{{ setPartida.jugadores[idPlayer].operacion }}</b></span>

            </div>
            <div class="input-operation">
              <v-text-field label="?" variant="outlined" type="number" v-model="result"></v-text-field>
              <v-btn class="btnSolve" @click="solveOperation()">Resolver</v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="3">
          <div>
            <img
              :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + setPartida.jugadores[idPlayer == 1 ? 0 : 1].avatar + "&scale=80&flip=true&eyes=angry&mouth=teethSmile"'
              alt="Avatar" style="width:300px;">
          </div>
        </v-col>
        <v-col sm="4" lg="12" md="6" cols="2" class="bottom-aligned-col">
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
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.input-operation {
  width: 500px;
  margin-top: 20px;
  align-items: center;
}

.bottom-aligned-col {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
}

.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.operation-box {
  width: 700px;
  background-color: white;
  border-radius: 5px;
  height: 100px;

}

.operation-label {
  text-align: center;
  font-size: 60px;
  margin-top: 2px;
  margin-bottom: 2px;
}

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
  padding-bottom: 10px;
}

.PS-container {
  background: rgb(255, 92, 92);
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
  height: 150px !important;
  width: 200px;
}

.dificulty-container {
  display: flex;
  justify-content: center;
}

.game-bar {
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
}
</style>
