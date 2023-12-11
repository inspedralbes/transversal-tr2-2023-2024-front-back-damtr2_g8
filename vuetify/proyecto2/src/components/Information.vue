<template>
    <div class="div-gear">
        <div class="info-svg">
            <button @click="dialog = !dialog">
                <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"
                    stroke="#">

                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                    <g id="SVGRepo_iconCarrier">
                        <title>information-circle</title>
                        <g id="Layer_2" data-name="Layer 2">
                            <g id="invisible_box" data-name="invisible box">
                                <rect width="48" height="48" fill="none" />
                            </g>
                            <g id="icons_Q2" data-name="icons Q2">
                                <path
                                    d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm0,40A18,18,0,1,1,42,24,18.1,18.1,0,0,1,24,42Z" />
                                <path d="M24,20a2,2,0,0,0-2,2V34a2,2,0,0,0,4,0V22A2,2,0,0,0,24,20Z" />
                                <circle cx="24" cy="14" r="2" />
                            </g>
                        </g>
                    </g>
                </svg>
                <v-dialog v-model="dialog" activator="info-svg">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Como jugar</span>
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