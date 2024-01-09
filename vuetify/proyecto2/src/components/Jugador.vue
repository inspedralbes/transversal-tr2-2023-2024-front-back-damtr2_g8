<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCrownOutline } from '@mdi/js';

export default {
    props: ["jugador"],
    name: "Jugador",
    mounted() {
    },
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiCrownOutline,
        }
    }
};
</script>

<template>
    <div class="jugador">
        <div class="winner" v-if="jugador.wins">
            <svg-icon type="mdi" :path="path"></svg-icon>
            <p>{{ jugador.wins }}</p>
        </div>
        <v-img style="height: 100px;" class="img-avatar"
            :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + jugador.id_avatar' />
        <h3>{{ jugador.nombre }}</h3>
    </div>
</template>

<style>
.jugador {
    width: 130px;
}

.img-avatar {
    display: block;
    margin: 0 auto;
    width: 100px;
}

/* Cuando sea md se hará esto (portatil) 
@media only screen and (min-width: 960px) and (max-width: 1919px) {
    .img-avatar {
        width: 90px;
    }
} */

.winner {
    position: absolute;
    margin-left: 10px;
    background-color: rgb(255, 255, 93);
    width: 50px;
    height: 30px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.winner p {
    font-weight: 700;
}
</style>
