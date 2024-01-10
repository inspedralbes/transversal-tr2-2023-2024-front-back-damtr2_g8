<template>
    <div class="div-gear">
        <div class="info-svg">
            <button @click="dialog = !dialog">
                <v-btn variant="text" icon="" size="large">
                    <v-icon icon="mdi-information-outline" size="x-large" color="white" variant="text"></v-icon>
                </v-btn>
                <v-dialog v-model="dialog" activator="info-svg">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Com jugar</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-carousel hide-delimiters>
                                    <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" cover
                                        height="400px"></v-carousel-item>
                                </v-carousel>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </button>
        </div>


    </div>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            items: [
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
                },
            ],
        }
    },
}
</script>

<style scoped>
.info-svg {
    position: absolute;
    top: 0;
    right: 0;
    margin: 30px;

}

.div-gear {
    position: relative;
}
</style>