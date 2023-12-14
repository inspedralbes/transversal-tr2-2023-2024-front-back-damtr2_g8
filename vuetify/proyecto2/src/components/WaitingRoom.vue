<script>
import { socket, state } from "@/services/socket";
import { useAppStore } from "@/store/app";

export default {
    data() {
        return {
            myId: null,
            owner: false,
            kick: false,
            store: useAppStore(),
            playing: false,
        };
    },
    methods: {
        startGame() {
            this.owner = true;
            socket.emit("startGame", {});
        }
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
            console.log(nuevoValor);
            if (nuevoValor == true && this.owner == false) {
                console.log("He llegado aquí " + nuevoValor);
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
            return state.joinedSala;
        },
        play() {
            return state.play;
        },
        partidas() {
            console.log("Partidas: " + state.partidas);
            if (state.partidas) {
                if (state.partidas.every(partida => partida.status == "finish")) {
                    this.playing = false;
                } else {
                    this.playing = true;
                }
            } else {
                this.playing = false;
            }
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
        <h2 class="pt-5">Sala d'espera</h2>
        <h1 class="text-h1 font-weight-black" v-if="myId == sala.owner">Codi sala: {{ sala.codi }}</h1>
        <h2 class="text-h2 font-weight-black" v-else>Espera a que el professor comenci la partida</h2>

        <v-btn class="my-button" @click="startGame()" v-if="myId == sala.owner && playing == false">COMENÇA</v-btn>
        <div v-else-if="myId == sala.owner && playing == true">S'estan jugant les partides</div>
        <div class="loader" v-else></div>
        <div class="footer">
            <div class="user-col">
                <div class="user-row">
                    <div class="user-item" v-for="jugador in sala.jugadores">
                        <v-img class="img-avatar"
                            :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + jugador.id_avatar' width="75px" />
                        <h3>{{ jugador.nombre }}</h3>
                    </div>
                </div>
                <!-- <div class="user-row" v-else>
                    <div class="user-item" v-for="partida in partidas">
                        <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                        <h3>{{ partida.jugadores[0].username }}</h3>
                        <h3>VS</h3>
                        <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                        <h3>{{ partida.jugadores[1].username }}</h3>
                    </div>
                </div> -->
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


.user-col {
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-row {
    display: flex;
    align-items: center;
}

.user-item {
    margin: 5px 50px;
    text-align: center;
}

.img-avatar {
    display: block;
    margin: 0 auto;
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
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

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
</style>