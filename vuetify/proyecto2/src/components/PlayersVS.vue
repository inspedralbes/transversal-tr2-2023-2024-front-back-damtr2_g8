<script>
export default {
  props: ["partida"],
  name: "PlayersVS",
  mounted() {
    console.log(this.partida);
  },
};
</script>

<template>
  <div v-if="partida.jugadores != undefined">
    <div class="player-container-mini">
      <v-img
        class="img-avatar-mini"
        :src="
          'https://api.dicebear.com/7.x/big-smile/svg?seed=' +
          partida.jugadores[0]?.avatar
        "
      />
      <h4>
        {{ partida.jugadores[0]?.username }}
      </h4>
      <div class="PS-container-mini">
        <div
          class="PS-mini"
          v-bind:style="{
            width: partida.jugadores[0]?.vida + '%',
          }"
        ></div>
      </div>
    </div>
    <h2>VS</h2>
    <div class="player-container-mini">
      <v-img
        class="img-avatar-mini"
        :src="
          'https://api.dicebear.com/7.x/big-smile/svg?seed=' +
          partida.jugadores[1]?.avatar
        "
      />
      <h4>
        {{ partida.jugadores[1]?.username }}
      </h4>
      <div class="PS-container-mini">
        <div
          class="PS-mini"
          v-bind:style="{
            width: partida.jugadores[1]?.vida + '%',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style>
.partida-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background-color: #FFF;
  border-radius: 15px;
  margin: 5px;
  box-sizing: border-box;
  padding: 20px;
  padding-left: 40px;
  padding-right: 40px;
}

.PS-container-mini {
  background: rgb(255, 92, 92);
  margin-left: auto;
  margin-right: auto;
  width: 6vw;
  height: 5px;
  display: flex;
}

.PS-mini {
  background-color: rgb(5, 241, 5);
  background-size: cover;
}

.img-avatar-mini {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100px;
}
</style>
