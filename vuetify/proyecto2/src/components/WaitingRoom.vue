<script>
import { socket, state } from "@/services/socket";
import { useAppStore } from "@/store/app";
import PlayersVS from "@/components/PlayersVS.vue";
import Jugador from "@/components/Jugador.vue";

export default {
    data() {
        return {
            myId: null,
            owner: false,
            kick: false,
            store: useAppStore(),
            playing: false,
            partidasFiltradas: [],
            playProf: false,
            canPlay: false,
            canPlayModal: false,
        };
    },
    methods: {
        startGame() {
            this.owner = true;
            if (this.sala.jugadores.length % 2 != 0 && this.playProf == false) {
                this.canPlay = true;
                this.canPlayModal = true;
                return;
            }
            socket.emit("startGame", { idClasse: this.store.usuari.classe, playProf: this.playProf });
        },
        leaveSala() {
            if (this.myId == this.sala.owner) {
                socket.emit("leaveAllSala", {});
                this.$router.push("/classes");
            } else {
                socket.emit("leaveSala", {});
                this.$router.push("/join");
            }
        },
        changePlayProf() {
            this.playProf = !this.playProf;
        },
        filterWins(partidas) {
            if (partidas) {
                let partidasFinalizadas = partidas.filter(partida => partida.status == "finish");
                if (partidasFinalizadas.length && this.sala != undefined) {
                    this.sala.jugadores.forEach(jugadorSala => {
                        jugadorSala.wins = 0;
                        partidasFinalizadas.forEach(partida => {
                            for (let i = 0; i < partida.jugadores.length; i++) {
                                if (partida.jugadores[i].idSocket == jugadorSala.id_jugador && partida.jugadores[i].vida != 0) {
                                    jugadorSala.wins++;
                                    i = partida.jugadores.length;
                                }
                            }
                        });
                    });
                }
            }
        }
    },
    components: {
        PlayersVS,
        Jugador,
    },
    watch: {
        'sala': function (nuevoValor, antiguoValor) {
            if (nuevoValor == false || nuevoValor == null) {
                setTimeout(() => {
                    this.$router.push("/join");
                }, 3000)
            } else {
                if (nuevoValor.owner == this.myId) {
                    this.owner = true;
                } else {
                    if (nuevoValor.owner_id == this.store.usuari.id) {
                        this.owner = false;
                        this.kick = true;
                        setTimeout(() => {
                            this.$router.push("/join");
                        }, 3000)
                    }
                }
            }
        },
        'play': function (nuevoValor, antiguoValor) {
            if (nuevoValor == true && this.owner == false || nuevoValor == true && this.playProf == true) {
                this.$router.push("/game");
            }
        },
        'partidas': function (nuevoValor, antiguoValor) {
        },
        'store.usuari.avatar': function () {
            socket.emit("changeAvatar", this.sala.id_sala, this.store.usuari.avatar);
        },
    },
    computed: {
        sala() {
            this.myId = socket.id;
            return state.joinedSala;
        },
        play() {
            return state.play;
        },
        partidas() {
            let partidasFiltro = state.partidas;

            if (state.partidas) {
                if (state.partidas.every(partida => partida.status == "finish")) {
                    this.playing = false;
                } else {
                    this.playing = true;
                }
                partidasFiltro = partidasFiltro.filter(partida => partida.status != "finish");
                this.filterWins(state.partidas);
            } else {
                this.playing = false;
            }

            if (partidasFiltro == null) {
                partidasFiltro = [];
            }

            this.partidasFiltradas = partidasFiltro;

            return state.partidas;
        },
    },
    mounted() {
        this.myId = socket.id;
        if (this.sala == null || this.sala == false) {
            socket.emit("getSala", this.store.usuari.id, this.store.usuari.classe);
        } else {
            if (this.store.usuari.classe != "") {
                if (this.sala.id_classe != this.store.usuari.classe) {
                    socket.emit("getSala", this.store.usuari.id, this.store.usuari.classe);
                }
            }
        }
    },
};
</script>

<template>
    <div class="full-container" v-if="sala && kick == false">
        <div class="button_leave">
            <v-btn variant="tonal" icon="mdi-arrow-left" @click="leaveSala()"></v-btn>
        </div>
        <h2 class="pt-16">Sala d'espera</h2>
        <h1 class="text-h1 font-weight-black" v-if="myId == sala.owner">Codi sala: {{ sala.codi }}</h1>
        <h2 class="text-h2 font-weight-black" v-else>Espera a que el professor comenci la partida</h2>
        <v-btn class="my-button" @click="startGame()" v-if="myId == sala.owner && playing == false">COMENÇA</v-btn>
        <h2 v-else-if="myId == sala.owner && playing == true">S'estan jugant les partides</h2>
        <div v-if="myId == sala.owner && playing == false">
            <v-checkbox label="Vols unir-te a la partida?" class="rounded mt-3 pr-2" :class="{ highlight: canPlay }" color="blue"
                @click="changePlayProf"></v-checkbox>
        </div>
        <div class="user-row" v-if="partidasFiltradas.length != 0">
            <div>
                <div class="playing-container">
                    <div class="partida-container" v-for="(partida, index) in partidasFiltradas" :key="index">
                        <PlayersVS :partida="partida" />
                    </div>
                </div>
            </div>
        </div>
        <div class="loader" v-else></div>
        <div class="footer">
            <div class="jugadors-container">
                <h1>Jugadors esperant: {{ this.sala.jugadores.length }}</h1>
                <div class="jugadors-list">
                    <div class="user-item" v-for="(jugador, index) in sala.jugadores" :key="index">
                        <Jugador :jugador="jugador" />
                    </div>
                </div>
            </div>
            <v-snackbar v-model="canPlayModal" :timeout="2000" color="error" class="text-center">
                <p class="text-center">El número de jugadors es imparell</p>
                <p class="text-center font-weight-bold">Uneix-te!</p>
                <template v-slot:actions>
                    <v-btn color="white" variant="text" @click="canPlayModal = false">
                        <svg fill="white" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960"
                            width="18">
                            <path
                                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    </v-btn>
                </template>
            </v-snackbar>
        </div>
    </div>
    <div class="full-container justify-center" v-else ref="elseBlock">
        <h2 class="text-h2 font-weight-black">El Professor ha tancat la Sala</h2>
        <div class="progress-loader">
            <div class="progress"></div>
        </div>
    </div>
</template>


<style scoped>
html,
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.btnBack {
    position: absolute;
    left: 0;
    margin: 10px;
}

.user-col {
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
}

.full-container {
    height: 100vh;
    background-color: #add8e6;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
}

.button_leave {
    margin-top: 20px;
    position: absolute;
    top: 17px;
    left: 40px;
}

.footer {
    background-color: #79b6c9;
    padding: 20px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

.jugadors-container {
    width: 70%;
    min-height: 200px;
    max-height: 200px;
    overflow-x: auto;
    margin: auto;
}

.jugadors-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 10px;
}

.my-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: fit-content;
    border-radius: 2px;
    color: #72BAE8;
}

.progress-loader {
    margin-top: 50px;
}

.progress-loader {
    width: 50%;
    background: rgba(48, 48, 48, 0.253);
    height: 3px;
    border-radius: 7px;
}

.progress {
    content: '';
    width: 1px;
    height: 3px;
    border-radius: 7px;
    background: rgb(0, 0, 0);
    transition: 0.5s;
    animation: loading1274 3s ease;
    animation-fill-mode: forwards;
}

@keyframes loading1274 {
    0% {
        width: 0%;
    }

    100% {
        width: 100%;
    }
}

.highlight {
    animation: highlight 2s ease-in-out infinite;
}

@keyframes highlight {
    0% {
        box-shadow: 0 0 0 0px rgba(0, 111, 145, 0.596);
    }

    100% {
        box-shadow: 0 0 0 10px rgba(49, 156, 189, 0);
    }
}

.playing-container {
    justify-content: center;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-height: 440px;
    overflow-y: auto;
}
</style>