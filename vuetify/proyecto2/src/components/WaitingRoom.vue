<script>
import { socket, state } from "@/services/socket";
import { io } from "socket.io-client";

export default {
    data() {
        return {
            myId: null,
            owner: false,
        };
    },
    methods: {
        startGame() {
            this.owner = true;
            console.log("aaa");
            socket.emit("startGame", {});
        }
    },
    watch: {
        'sala': function (nuevoValor, antiguoValor) {
            if (nuevoValor == false) {
                console.log('no hay sala');
            }
        },
        'play': function (nuevoValor, antiguoValor) {
            console.log("play")
            if (nuevoValor == true && this.owner == false) {
                this.$router.push("/game");
            }
        },
    },
    computed: {
        sala() {
            if (state.joinedSala == false) {
                setTimeout(() => {
                    this.$router.push("/join");
                }, 3000)
            }
            return state.joinedSala;
        },
        play() {
            return state.play;
        },
    },
    mounted() {
        this.myId = socket.id;
    },
};
</script>

<template>
    <div class="full-container" v-if="sala">
        <h2 class="pt-5">Sala d'espera</h2>
        <h1 class="text-h1 font-weight-black" v-if="myId == sala.owner">Codi sala: {{ sala.codi }}</h1>
        <h2 class="text-h2 font-weight-black" v-else>Espera a que el professor comenci la partida</h2>

        <v-btn class="my-button" @click="startGame()" v-if="myId == sala.owner">COMENÇA</v-btn>
        <div class="loader" v-else></div>
        <div class="footer">
            <div class="user-col">
                <div class="user-row">
                    <div class="user-item" v-for="jugador in sala.jugadores">
                        <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                        <h3>{{ jugador.nombre }}</h3>
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