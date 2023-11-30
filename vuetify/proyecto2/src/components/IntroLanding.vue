<template>
  <div class="full-container">
    <div class="center-container">
      <v-img src="../assets/MathBattleLogo.png" alt="Math Battle Logo" width="400" height="300" class="logo" />
      <v-btn @click="$router.push('/inici')">COMENÇAR</v-btn>
    </div>
  </div>
</template>

<style scoped>
.full-container {
  background-color: lightblue;
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo {
  margin-bottom: 4px;
}
</style>

<script setup>
</script>
