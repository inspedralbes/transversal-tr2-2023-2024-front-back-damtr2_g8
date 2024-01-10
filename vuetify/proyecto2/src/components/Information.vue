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
                            <v-container class="private-block">
                                <svg width="600px" height="500px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" stroke="#000000">

                                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M3 3L21 21M17 10V8C17 5.23858 14.7614 3 12 3C11.0283 3 10.1213 3.27719 9.35386 3.75681M7.08383 7.08338C7.02878 7.38053 7 7.6869 7 8V10.0288M19.5614 19.5618C19.273 20.0348 18.8583 20.4201 18.362 20.673C17.7202 21 16.8802 21 15.2 21H8.8C7.11984 21 6.27976 21 5.63803 20.673C5.07354 20.3854 4.6146 19.9265 4.32698 19.362C4 18.7202 4 17.8802 4 16.2V14.8C4 13.1198 4 12.2798 4.32698 11.638C4.6146 11.0735 5.07354 10.6146 5.63803 10.327C5.99429 10.1455 6.41168 10.0647 7 10.0288M19.9998 14.4023C19.9978 12.9831 19.9731 12.227 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.773 10.0269 17.0169 10.0022 15.5977 10.0002M10 10H8.8C8.05259 10 7.47142 10 7 10.0288"
                                            stroke="#8c8c8c" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </g>

                                </svg>

                                <!-- <v-carousel hide-delimiters>
                                    <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" cover
                                        height="400px"></v-carousel-item>
                                </v-carousel> -->
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
.private-block{
    display: flex;
    align-items: center;
    justify-content: center;
}
.info-svg {
    position: absolute;
    top: 0;
    right: 0;
    margin: 30px;

}

.div-gear {
    position: relative;
}</style>