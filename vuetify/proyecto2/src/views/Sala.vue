<template>
  <div>
    <Configuration />
    <Information />
    <WaitingRoom />
    
  </div>
</template>

<script>
import WaitingRoom from "@/components/WaitingRoom.vue";
import Configuration from "@/components/Configuration.vue";
import Information from "@/components/Information.vue";

export default {
  components: {
    WaitingRoom,
    Configuration,
    Information,
  },
};
</script>
