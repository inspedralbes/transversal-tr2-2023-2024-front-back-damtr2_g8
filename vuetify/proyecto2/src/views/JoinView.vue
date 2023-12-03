<template>
    <div>
        <Configuration />
        <Information />
        <Join />

    </div>
</template>

<script>
import Join from '@/components/Join.vue'
import Configuration from '@/components/Configuration.vue';
import Information from '@/components/Information.vue';

export default {
    components: {
        Join,
        Configuration,
        Information
    },
};
</script>

<style scoped></style>

