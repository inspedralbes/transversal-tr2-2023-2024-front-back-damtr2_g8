<template>
  <div class="full-container">
    <div class="center-container">
      <v-img src="../assets/MathBattleLogo.png" alt="Math Battle Logo" width="600" height="300" class="logo" />
      <button class="button-landing" @click="$router.push(state.usuari.id == null ? '/inici' : '/join')">COMENÇAR</button>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
export default {
  data() {
    return {
      state: useAppStore(),
    };
  },
}
</script>

<style scoped>
* {
  background-color: lightblue;
}

.full-container {
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.logo {
  margin-bottom: 4px;
  animation: moveAndRotate 3s infinite ease-in-out;
}

@keyframes moveAndRotate {
  0% {
    transform: translateX(-20px) rotate(-5deg);
  }

  50% {
    transform: translateX(20px) rotate(5deg);
  }

  100% {
    transform: translateX(-20px) rotate(-5deg);
  }
}

.button-landing {
  position: relative;
  width: 300px;
  padding: 14px 28px;
  margin: 10px;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  background-image: linear-gradient(to bottom right, rgb(117, 207, 237), rgb(12, 165, 215));
  border: none;
  border-radius: 40px;
  box-shadow: 0px 4px 0px rgb(40, 126, 154);
  transition: all 0.2s ease-in-out;
  letter-spacing: 2.5px;
}

.button-landing:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 0px rgb(40, 126, 154);
}

.button-landing:active {
  transform: translateY(4px);
  box-shadow: none;
  background-image: linear-gradient(to bottom right, rgb(93, 158, 180), rgb(2, 123, 163));
}

.button-landing:before,
.button-landing:after {
  position: absolute;
  width: 0;
  height: 0;
}

.button-landing:before {
  border-radius: 40px;
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
}

.button-landing:after {
  bottom: -3px;
  right: -3px;
  border-radius: 40px;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
}
</style>

<script setup>
</script>
