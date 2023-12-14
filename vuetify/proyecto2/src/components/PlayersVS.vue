<script>
export default {
    props: ["partida"],
    name: 'PlayersVS',
    mounted() {
        console.log(this.partida);
    }
};
</script>

<template>
    <div class="player-container">
        <v-img class="img-avatar" :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + partida.jugadores[0].avatar'
            width="50px" />
        <h4>
            {{ partida.jugadores[0].username }}
        </h4>
        <div class="PS-container" :class="{ shake: hit == 1 }" align="left">
            <div class="PS" v-bind:style="{
                width: partida.jugadores[0].vida + '%',
            }">
            </div>
        </div>
    </div>
    <h3>VS</h3>
    <div class="player-container-mini">
        <v-img class="img-avatar" :src='"https://api.dicebear.com/7.x/big-smile/svg?seed=" + partida.jugadores[1].avatar'
            width="50px" />
        <h4>
            {{ partida.jugadores[1].username }}
        </h4>
        <div class="PS-container-mini" :class="{ shake: hit == 1 }" align="left">
            <div class="PS-mini" v-bind:style="{
                width: partida.jugadores[1].vida + '%',
            }">
            </div>
        </div>
    </div>
</template>

<style>
.partida-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 2px;
    background-color: aliceblue;
    border-radius: 15px;
    margin: 5px;
    margin-top: 20px;
    box-sizing: border-box;
}

.player-container {
    margin: 10px;
}

.PS-container-mini {
    background: rgb(255, 92, 92);
    width: 100%;
    height: 3px;
    display: flex;
}

.PS-mini {
    background-color: rgb(5, 241, 5);
    background-size: cover;
}
</style>