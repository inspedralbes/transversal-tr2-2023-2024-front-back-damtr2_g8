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
        };
    },
    methods: {
        startGame() {
            this.owner = true;
            socket.emit("startGame", this.store.usuari.classe);
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
        filterWins() {
            if (this.partidas) {
                let partidasFinalizadas = this.partidas.filter(partida => partida.status == "finish");
                if (partidasFinalizadas.length) {
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
            if (nuevoValor == true && this.owner == false) {
                this.$router.push("/game");
            }
        },
        'partidas': function (nuevoValor, antiguoValor) {
        },
        'store.usuari.avatar': function () {
            socket.emit("changeAvatar", this.sala.id_sala, this.store.usuari.avatar);
        }
    },
    computed: {
        sala() {
            this.myId = socket.id;
            this.filterWins();
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
            } else {
                this.playing = false;
            }

            if (partidasFiltro == null) {
                partidasFiltro = [];
            }

            this.partidasFiltradas = partidasFiltro;
            this.filterWins();

            return state.partidas;
        },
    },
    mounted() {
        this.myId = socket.id;
        if (this.sala == null || this.sala == false) {
            socket.emit("getSala", this.store.usuari.id, this.store.usuari.classe);
        } else {
            if (this.sala.id_classe != this.store.usuari.classe) {
                socket.emit("getSala", this.store.usuari.id, this.store.usuari.classe);
            }
        }
    },
};
</script>

<template>
    <div class="full-container" v-if="sala && kick == false">
        <v-btn variant="tonal" icon="mdi-arrow-left" class="mt-5" @click="leaveSala()"></v-btn>
        <h2 class="pt-5">Sala d'espera</h2>
        <h1 class="text-h1 font-weight-black" v-if="myId == sala.owner">Codi sala: {{ sala.codi }}</h1>
        <h2 class="text-h2 font-weight-black" v-else>Espera a que el professor comenci la partida</h2>
        <v-btn class="my-button" @click="startGame()" v-if="myId == sala.owner && playing == false">COMENÇA</v-btn>
        <h2 v-else-if="myId == sala.owner && playing == true">S'estan jugant les partides</h2>
        <div class="user-row" v-if="partidasFiltradas.length != 0">
            <div>
                <div class="playing-container">
                    <div class="partida-container" v-for="partida in partidasFiltradas">
                        <PlayersVS :partida="partida" />
                    </div>
                </div>
            </div>
        </div>
        <div class="loader" v-else></div>
        <div class="footer">
            <div class="jugadors-container">
                <h1>Jugadors esperant</h1>
                <div class="jugadors-list">
                    <div class="user-item" v-for="jugador in sala.jugadores">
                        <Jugador :jugador="jugador" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="full-container justify-center" v-else>
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

.playing-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>