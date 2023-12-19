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
    <div class="winner">
        <svg-icon type="mdi" :path="path"></svg-icon>
        <p>1</p>
    </div>
    <v-img class="img-avatar" :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + jugador.id_avatar' />
    <h3>{{ jugador.nombre }}</h3>
</template>

<style>
.img-avatar {
    display: block;
    margin: 0 auto;
}

.winner {
    position: relative;
    top: 15px;
    left: 10px;
    background-color: white;
    width: 50px;
    height: 30px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.winner p {
    font-weight: 700;
}
</style>
