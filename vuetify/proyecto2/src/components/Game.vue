<script setup>
import { socket, state } from "@/services/socket";
import { useAppStore } from "@/store/app";
</script>

<script>
import party from "party-js";

export default {
  data() {
    return {
      result: null,
      store: useAppStore(),
      idPlayer: null,
      hit: null,
      dificultad: 1,
      mouthPlayer1: "teethSmile",
      mouthPlayer2: "teethSmile",
      //vidaRestada: null,
      vidaRestada1: "",
      vidaRestada2: "",
      usuaris: {
        vidaAnterior1: 100,
        vidaAnterior2: 100,
      },
      incorrectResult: false,
      playing: false,
      canPlayModal: false,
    };
  },
  mounted() {
    this.store.usuari.id == null ? this.$router.push("/inici") : null;
    this.conectar();

    this.setPartida;
    const self = this;
    document
      .getElementById("result")
      .addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
          self.solveOperation();
        }
      });
  },
  methods: {
    conectar() {
      socket.emit("conectarUsuario", {
        username: this.store.usuari.nom,
        avatar: this.store.usuari.avatar,
        id_sala: state.sala,
      });
    },
    changeDificulty(dificultad) {
      this.dificultad = dificultad;
      socket.emit("changeDificulty", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
        dificultad: dificultad,
      });
    },
    solveOperation() {
      if (state.joinedSala) {
        socket.emit("solveOperation", {
          idPartida: state.partida.idPartida,
          idJugador: this.idPlayer,
          idUsuari: this.store.usuari.id,
          idClasse: state.joinedSala.id_classe,
          result: this.result,
        });
        if (
          this.result !=
          eval(
            state.partida.jugadores[this.idPlayer].operacion[this.dificultad]
          )
        ) {
          this.incorrectResult = true;
        }
        setTimeout(() => {
          this.incorrectResult = false;
        }, 500);
        this.result = "";
      }
    },
  },
  watch: {
    statusGame: function (nuevoValor, antiguoValor) {
      if (nuevoValor == null) {
        this.canPlayModal = true;
        setTimeout(() => {
          this.$router.push("/join");
        }, 2000);
      }
    },
  },
  computed: {
    setPartida() {
      if (state.partida.status == "error") {
        state.partida.status = "";
        this.$router.push("/sala");
      }

      this.idPlayer =
        state.partida.jugadores.findIndex(
          (jugador) => jugador.idSocket == socket.id
        ) == 0
          ? 0
          : 1;

      if (state.partida.idPartida != 0) {
        this.playing = true;
      }

      if (
        (this.playing == true && state.partida.idPartida == 0) ||
        state.partida.status == "finish"
      ) {
        //setTimeout(() => {
        this.$router.push("/sala");
        //}, 2000);
      }

      if (
        state.partida.jugadores[this.idPlayer].vida < this.usuaris.vidaAnterior1
      ) {
        this.hit = 0;
        //this.vidaRestada = state.partida.jugadores[this.idPlayer].vida - this.usuaris.vidaAnterior1;
        this.vidaRestada1 =
          state.partida.jugadores[this.idPlayer].vida -
          this.usuaris.vidaAnterior1;

        //console.log(vidaRestada);
        this.usuaris.vidaAnterior1 =
          state.partida.jugadores[this.idPlayer].vida;
        setTimeout(() => {
          this.hit = null;
        }, 100);

        //this.mouthPlayer1 = "unimpressed";

        if (this.vidaRestada1 == 0) {
          this.mouthPlayer1 = "teethSmile&skinColor=efcc9f";
        } else if (this.usuaris.vidaAnterior1 <= 10) {
          this.mouthPlayer1 = "unimpressed&skinColor=F44336";
        } else if (this.usuaris.vidaAnterior1 == 0) {
          this.mouthPlayer2 = "openedSmile&skinColor=efcc9f";
          console.log("partida acabada");
          party.confetti();
          party.sparkles();
        } else {
          this.mouthPlayer1 = "unimpressed";
        }
      }

      if (
        state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida <
        this.usuaris.vidaAnterior2
      ) {
        this.hit = 1;
        //this.vidaRestada = state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida - this.usuaris.vidaAnterior2;
        // console.log(vidaRestada);

        this.vidaRestada2 =
          state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida -
          this.usuaris.vidaAnterior2;

        this.usuaris.vidaAnterior2 =
          state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida;
        //this.mouth = "unimpressed";

        if (this.vidaRestada2 == 0) {
          this.mouthPlayer2 = "teethSmile&skinColor=efcc9f";
        } else if (this.usuaris.vidaAnterior2 <= 10) {
          this.mouthPlayer2 = "unimpressed&skinColor=F44336";
        } else if (this.usuaris.vidaAnterior2 == 0) {
          this.mouthPlayer1 = "openedSmile&skinColor=efcc9f";
          console.log("partida acabada");
          party.confetti();
          party.sparkles();
        } else {
          this.mouthPlayer2 = "unimpressed";
        }

        setTimeout(() => {
          this.hit = null;
        }, 100);
      }
      return state.partida;
    },
    statusGame() {
      return state.joinedSala;
    },
  },
};
</script>

<template>
  <v-app class="my-app-background">
    <div class="game-container" v-if="setPartida">
      <div class="content-wrap bg-transparent">
        <v-row class="px-12 py-5" style="margin: 0">
          <v-col>
            <h2>{{ setPartida.jugadores[idPlayer].username }}</h2>
            <div
              class="PS-container"
              :class="{ shake: hit == 0, damageAnimation: hit == 0 }"
            >
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
            <h2 v-if="hit == 1"></h2>
            <h2>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].username }}</h2>
            <div
              class="PS-container"
              :class="{ shake: hit == 1, damageAnimation: hit == 1 }"
              align="left"
            >
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
      </div>
      <v-container class="game-bar">
        <v-row>
          <v-col cols="3">
            <v-container class="avatar-container no-bottom-lg" id="avatar-one">
              <v-img
                :src="
                  'https://api.dicebear.com/7.x/big-smile/svg?seed=' +
                  setPartida.jugadores[idPlayer].avatar +
                  '&scale=100&flip=false&eyes=angry&mouth=' +
                  mouthPlayer1
                "
                alt="Avatar"
                style="width: 300px; max-width: 500px; height: 300px"
              />
              <!-- <span class="damage-container1">{{ vidaRestada1 }}</span> -->
            </v-container>
          </v-col>
          <v-col cols="6">
            <v-container class="input-container">
              <v-container
                class="operation-box"
                :class="
                  dificultad === 0
                    ? 'easy-border-color'
                    : dificultad === 1
                    ? 'medium-border-color'
                    : 'hard-border-color'
                "
              >
                <span class="operation-label"
                  ><b>{{
                    setPartida.jugadores[idPlayer].operacion == ""
                      ? ""
                      : setPartida.jugadores[idPlayer].operacion[
                          dificultad
                        ].includes("Math.sqrt")
                      ? setPartida.jugadores[idPlayer].operacion[
                          dificultad
                        ].replace(/Math\.sqrt\((\d+)\)/g, "√$1")
                      : setPartida.jugadores[idPlayer].operacion[
                          dificultad
                        ].includes("**")
                      ? setPartida.jugadores[idPlayer].operacion[
                          dificultad
                        ].replace(/\*\*(\d+)/g, "^$1")
                      : setPartida.jugadores[idPlayer].operacion[dificultad]
                  }}</b></span
                >
              </v-container>
              <v-container class="input-operation">
                <v-text-field
                  label="?"
                  variant="outlined"
                  id="result"
                  type="number"
                  class="rounded"
                  :class="{ shake: incorrectResult }"
                  v-model="result"
                ></v-text-field>
                <v-btn class="btnSolve" @click="solveOperation()"
                  >Resoldre</v-btn
                >
              </v-container>
            </v-container>
          </v-col>
          <v-col cols="3">
            <v-container class="avatar-container no-bottom-lg" id="avatar-two">
              <!-- <span class="damage-container2">{{ vidaRestada2 }}</span> -->
              <v-img
                :src="
                  'https://api.dicebear.com/7.x/big-smile/svg?seed=' +
                  setPartida.jugadores[idPlayer == 1 ? 0 : 1].avatar +
                  '&scale=100&flip=true&eyes=angry&mouth=' +
                  mouthPlayer2
                "
                alt="Avatar"
                style="width: 300px; max-width: 500px; height: 300px"
              />
            </v-container>
          </v-col>
          <v-col sm="12" lg="12" md="12" cols="2" class="bottom-aligned-col">
            <v-sheet align="center" class="bg-transparent">
              <v-row class="dificulty-container">
                <v-col align="center">
                  <v-btn
                    class="dificulty-option rounded-lg"
                    :class="dificultad == 0 ? 'focus-border-color' : ''"
                    style="background-color: #7ed776"
                    @click="changeDificulty(0)"
                    >Fàcil
                    <br />
                    <v-chip
                      color="amber-darken-2"
                      class="mt-2 chip-attack"
                      variant="elevated"
                      append-icon="mdi-sword-cross"
                    >
                      10
                    </v-chip>
                  </v-btn>
                </v-col>
                <v-col align="center">
                  <v-btn
                    class="dificulty-option rounded-lg"
                    :class="dificultad == 1 ? 'focus-border-color' : ''"
                    style="background-color: #768ed7"
                    @click="changeDificulty(1)"
                    >Mitjà
                    <br />
                    <v-chip
                      color="amber-darken-2"
                      class="mt-2 chip-attack"
                      variant="elevated"
                      append-icon="mdi-sword-cross"
                    >
                      15
                    </v-chip>
                  </v-btn>
                </v-col>
                <v-col align="center">
                  <v-btn
                    class="dificulty-option rounded-lg"
                    :class="dificultad == 2 ? 'focus-border-color' : ''"
                    style="background-color: #d77676"
                    @click="changeDificulty(2)"
                    >Difícil
                    <br />
                    <v-chip
                      color="amber-darken-2"
                      class="mt-5 chip-attack"
                      variant="elevated"
                      append-icon="mdi-sword-cross"
                    >
                      20
                    </v-chip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar
        v-model="canPlayModal"
        :timeout="2000"
        color="error"
        class="text-center"
      >
        <p class="text-center">El profesor ha tancat la sala</p>
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="canPlayModal = false">
            <svg
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              viewBox="0 -960 960 960"
              width="18"
            >
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<style scoped>
.avatar-container#avatar-one {
  margin-right: 15px;
}

.avatar-container#avatar-two {
  margin-left: 20px;
}

.my-app-background {
  background-color: lightblue;
  overflow: hidden;
}

.game-container {
  height: 100vh;
}

.avatar-container {
  display: flex;
}

.focus-border-color {
  border: 5px solid #00000057;
}

.damage-container1 {
  position: absolute;
  background-color: blueviolet;
  margin-top: 30px;
  margin-left: 250px;
  font-size: 45px;
}

.damage-container2 {
  position: absolute;
  background-color: blueviolet;
  margin-top: 30px;
  margin-left: 20px;
  font-size: 45px;
}

.input-operation {
  width: 500px;
  margin-top: 20px;
  align-items: center;
}

.bottom-aligned-col {
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
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 40px;
  right: 0;
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
  /* margin-top: 2px;
  margin-bottom: 2px; */
  position: relative;
  bottom: 10px;
}

.PS {
  font-weight: 800;
  font-size: 23px;
  width: 60%;
  background-color: rgb(153, 153, 153);
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
  background: url("../assets/BackgroundGreen.png") center center no-repeat;
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
  margin-top: 40px;
}

.game-bar {
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
}

.shake {
  animation: shake 0.12s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
}

@media only screen and (max-width: 830px) {
  .avatar-container {
    margin: 0;
  }

  .avatar-container#avatar-one {
    margin-right: 15px;
  }

  .avatar-container#avatar-two {
    margin-left: 15px;
  }

  .operation-label {
    position: relative;
    bottom: 10px;
    font-size: 47px;
  }

  .operation-box {
    width: 450px;
    height: 80px;
    margin-top: 40px;
  }

  .input-operation {
    margin-top: 5px;
  }

  .dificulty-option {
    margin-top: 20px;
    font-size: 25px !important;
    font-weight: 800 !important;
    height: 100px !important;
    width: 200px;
  }
}

@media only screen and (min-width: 831px) and (max-width: 960px) {
  .avatar-container {
    margin: 0;
  }

  .avatar-container#avatar-one {
    margin-right: 15px;
  }

  .avatar-container#avatar-two {
    margin-left: 15px;
  }

  .operation-label {
    position: relative;
    bottom: 10px;
    font-size: 47px;
  }

  .operation-box {
    width: 500px;
    height: 80px;
    margin-top: 10px;
  }

  .input-operation {
    margin-top: 5px;
  }

  .btnSolve {
    margin-bottom: 15px;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1280px) {
  .game-container {
    height: 100vh;
  }

  .operation-label {
    position: relative;
    bottom: 10px;
    font-size: 47px;
  }

  .operation-box {
    width: 500px;
    height: 80px;
    margin-top: 10px;
  }

  .input-operation {
    margin-top: 5px;
  }

  .btnSolve {
    margin-bottom: 15px;
  }
}

@media only screen and (max-width: 1919px) {
  .avatar-container {
    position: relative;
    bottom: 50px;
  }
}

@media only screen and (min-width: 1920px) {
  .no-bottom-lg {
    margin-bottom: 0 !important;
  }

  .btnSolve {
    margin-top: -3px;
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
    border: 1px solid red;
  }

  25% {
    transform: translateX(3px);
    border: 2px solid red;
  }

  50% {
    transform: translateX(-3px);
    border: 3px solid red;
  }

  75% {
    transform: translateX(3px);
    border: 2px solid red;
  }

  100% {
    transform: translateX(0);
    border: 1px solid red;
  }
}

@keyframes damageAnimation {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  25% {
    transform: translateY(20px) translateX(2px);
  }

  50% {
    opacity: 0.7;
    transform: translateY(30px) translateX(-2px);
  }

  75% {
    transform: translateY(40px) translateX(2px);
  }

  100% {
    opacity: 0;
    transform: translateY(50px) translateX(2px);
  }
}
</style>
