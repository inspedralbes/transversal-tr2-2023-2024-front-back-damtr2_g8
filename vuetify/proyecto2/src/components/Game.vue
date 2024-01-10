<script setup>
import { socket, state } from "@/services/socket";
import { useAppStore } from "@/store/app";
</script>

<script>
import party from 'party-js';

export default {
  data() {
    return {
      result: null,
      emptyGameData: true,
      store: useAppStore(),
      idPlayer: null,
      avatar: null,
      flip: true,
      hit: null,
      mouthPlayer1: "teethSmile",
      mouthPlayer2: "teethSmile",
      //vidaRestada: null,
      vidaRestada1: '',
      vidaRestada2: '',
      usuaris: {
        vidaAnterior1: 100,
        vidaAnterior2: 100,
      },
    };
  },
  mounted() {
    this.store.usuari.id == null ? this.$router.push("/inici") : null;
    this.avatar = this.store.usuari.avatar;
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
    getOperation(dificultad) {
      socket.emit("getOperation", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
        dificultad: dificultad,
      });
      this.result = "";
    },
    conectar() {
      socket.emit("conectarUsuario", {
        username: this.store.usuari.nom,
        avatar: this.store.usuari.avatar,
        id_sala: state.sala,
      });
    },
    solveOperation() {
      console.log(this.result);

      socket.emit("solveOperation", {
        idPartida: state.partida.idPartida,
        idJugador: this.idPlayer,
        result: this.result,
      });
      this.result = "";
    }
  },
  computed: {
    setPartida() {
      this.emptyGameData = false;
      this.idPlayer = state.partida.jugadores.findIndex((jugador) => jugador.idSocket == socket.id) == 0 ? 0 : 1;
      if (state.partida.status == "finish") {
        setTimeout(() => {
          this.$router.push("/sala");
        }, 2000);
      }

      if (state.partida.jugadores[this.idPlayer].vida < this.usuaris.vidaAnterior1) {
        this.hit = 0;
        //this.vidaRestada = state.partida.jugadores[this.idPlayer].vida - this.usuaris.vidaAnterior1;
        this.vidaRestada1 = state.partida.jugadores[this.idPlayer].vida - this.usuaris.vidaAnterior1;

        //console.log(vidaRestada);
        this.usuaris.vidaAnterior1 = state.partida.jugadores[this.idPlayer].vida;
        setTimeout(() => {
          this.hit = null;
        }, 100);

        this.mouthPlayer1 = "unimpressed";

        if(state.partida.jugadores[this.idPlayer].vida == 100){
          this.mouthPlayer1="teethSmile&skinColor=efcc9f";
        }else if(this.usuaris.vidaAnterior1 <= 10){
          this.mouthPlayer1="unimpressed&skinColor=F44336";
        }else if (this.usuaris.vidaAnterior1 == 0){
          this.mouthPlayer2 ="openedSmile";
          party.confetti();
          party.sparkles();
        }else{
          this.mouthPlayer1="unimpressed";
        if (this.usuaris.vidaAnterior1 <= 10) {
          this.mouthPlayer1 = "unimpressed&skinColor=F44336";
        } else if (this.usuaris.vidaAnterior1 == 0) {
          this.mouthPlayer2 = "openedSmile";
        }
      }

      if (state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida < this.usuaris.vidaAnterior2) {
        this.hit = 1;
        //this.vidaRestada = state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida - this.usuaris.vidaAnterior2;
       // console.log(vidaRestada);

       this.vidaRestada2 = state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida - this.usuaris.vidaAnterior2;

        this.usuaris.vidaAnterior2 = state.partida.jugadores[this.idPlayer == 1 ? 0 : 1].vida;
        //this.mouth = "unimpressed";
        

        if(state.partida.jugadores[this.idPlayer].vida == 100){
          this.mouthPlayer2="teethSmile&skinColor=efcc9f";
        }else if(this.usuaris.vidaAnterior2 <= 10){
          this.mouthPlayer2="unimpressed&skinColor=F44336";
        }else if (this.usuaris.vidaAnterior2 == 0){
          this.mouthPlayer1 ="openedSmile";
          party.confetti();
          party.sparkles();
        }else{
          this.mouthPlayer2="unimpressed";
        }

        setTimeout(() => {
          this.hit = null;
        }, 100);
      }

      return state.partida;
    },
  },
};
</script>

<template>
  <v-app class="my-app-background">
    <div class="game-container">
      <div class="content-wrap bg-transparent">
        <v-row class="px-12 py-5" style="margin: 0" v-if="!emptyGameData">
          <v-col>
            <h2>{{ setPartida.jugadores[idPlayer].username }}</h2>
            <div class="PS-container" :class="{ shake: hit == 0, damageAnimation: hit == 0 }">
              <div class="PS" v-bind:style="{ width: setPartida.jugadores[idPlayer].vida + '%', }">
                <p>{{ setPartida.jugadores[idPlayer].vida }}</p>
              </div>
            </div>
          </v-col>
          <v-col align="right">
            <h2 v-if="hit == 1"></h2>
            <h2>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].username }}</h2>
            <div class="PS-container" :class="{ shake: hit == 1, damageAnimation: hit == 1 }" align="left">
              <div class="PS" v-bind:style="{ width: setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida + '%',}">
                <p>{{ setPartida.jugadores[idPlayer == 1 ? 0 : 1].vida }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-container class="game-bar">
        <v-row>
          <v-col cols="3">
            <v-container class="avatar-container no-bottom-lg " id="avatar-one">
              <v-img :src="'https://api.dicebear.com/7.x/big-smile/svg?seed=' +
                setPartida.jugadores[idPlayer].avatar + '&scale=100&flip=false&eyes=angry&mouth=' + mouthPlayer1" alt="Avatar" style="width: 300px" />
              <!-- <span class="damage-container1">{{ vidaRestada1 }}</span> -->
            </v-container>
          </v-col>
          <v-col cols="6">
            <v-container class="input-container">
              <v-container class="operation-box">
                <span class="operation-label"><b>{{ setPartida.jugadores[idPlayer].operacion == "" ? "Escull una dificultat" : setPartida.jugadores[idPlayer].operacion }}</b></span>
              </v-container>
              <v-container class="input-operation">
                <v-text-field label="?" variant="outlined" id="result" type="number" v-model="result"></v-text-field>
                <v-btn class="btnSolve" @click="solveOperation()">Resoldre</v-btn>
              </v-container>
            </v-container>
          </v-col>
          <v-col cols="3">
            <v-container class="avatar-container no-bottom-lg "  id="avatar-two">
              <!-- <span class="damage-container2">{{ vidaRestada2 }}</span> -->
              <v-img :src="'https://api.dicebear.com/7.x/big-smile/svg?seed=' +
                setPartida.jugadores[idPlayer == 1 ? 0 : 1].avatar +
                '&scale=100&flip=true&eyes=angry&mouth=' + mouthPlayer2
                " alt="Avatar" style="width: 300px" />
            </v-container>
          </v-col>
          <v-col sm="12" lg="12" md="12" cols="2" class="bottom-aligned-col">
            <v-sheet align="center" class="bg-transparent">
              <v-row class="dificulty-container">
                <v-col align="center">
                  <v-btn class="dificulty-option rounded-lg" style="background-color: #7ed776"
                    @click="getOperation(1)">Fàcil</v-btn>
                </v-col>
                <v-col align="center">
                  <v-btn class="dificulty-option rounded-lg" style="background-color: #768ed7"
                    @click="getOperation(2)">Mitjà</v-btn>
                </v-col>
                <v-col align="center">
                  <v-btn class="dificulty-option rounded-lg" style="background-color: #d77676"
                    @click="getOperation(3)">Difícil</v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
  .avatar-container#avatar-one{
    margin-right: 15px;
  }

  .avatar-container#avatar-two{
    margin-left: 20px;
  }
.my-app-background{
  background-color: lightblue;
  overflow: hidden;
}
.game-container {
  height: 100vh;
}
.avatar-container {
  display: flex;
}

@media only screen and (min-width: 960px) and (max-width: 1919px) {
  .avatar-container {
    position: relative;
    bottom: 50px;
  }
}

@media only screen and (min-width: 1920px) {
  .no-bottom-lg {
    margin-bottom: 0 !important;
  }
}

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
}

.game-bar {
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
}

.shake {
  animation: shake 0.12s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(3px);
  }

  50% {
    transform: translateX(-3px);
  }

  75% {
    transform: translateX(3px);
  }

  100% {
    transform: translateX(0);
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
