<script>
import { socket, state } from "@/services/socket";

export default {
    data() {
        return {

        };
    },
    methods: {

    },
    // watch: {
    //     'sala': function (nuevoValor, antiguoValor) {

    //     },
    // },
    computed: {
        sala() {
            return state.joinedSala;
        },
    },
    mounted() {

    },
};
</script>

<template>
    <div class="full-container">
        <h2>Sala d'espera</h2>
        <h2 class="text-h2 font-weight-black">Espera a que el professor comenci la partida</h2>
        <div class="loader"></div>
    </div>
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
</template>


<style scoped>
.footer {
    background-color: #79b6c9;
    padding: 20px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

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
    padding-top: 50px;
    background-color: #add8e6;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;

}

.my-button {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 10px;
    width: auto;
    /* padding: auto; */
    border-radius: 2px;
    background-color: #72BAE8;
    color: white;
}

:root {
    --divide-image: url('../assets/divide.png');
    --equal-image: url('../assets/equal.png');
    --more-less-image: url('../assets/moreLess.png');
}

.loader {
    background:
        var(--divide-image) 0% 50% no-repeat,
        var(--equal-image) 50% 50% no-repeat,
        var(--more-less-image) 100% 50% no-repeat;
    background-size: calc(100% / 3) 50%;
    animation: l3 1s infinite linear;
    margin: 20px auto;
}

@keyframes l3 {
    20% {
        background-position: 0% 0%, 50% 50%, 100% 50%;
    }

    40% {
        background-position: 0% 100%, 50% 0%, 100% 50%;
    }

    60% {
        background-position: 0% 50%, 50% 100%, 100% 0%;
    }

    80% {
        background-position: 0% 50%, 50% 50%, 100% 100%;
    }
}
</style>

<script setup>
import divideImage from '@/assets/divide.png';
import equalImage from '@/assets/equal.png';
import moreLessImage from '@/assets/moreLess.png';
</script>