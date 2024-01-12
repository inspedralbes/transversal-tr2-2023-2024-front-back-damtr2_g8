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
                                <v-carousel hide-delimiters>
                                    <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src"
                                        height="750px"></v-carousel-item>
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
                    src: 'https://lh3.googleusercontent.com/u/1/drive-viewer/AEYmBYSHGCwaM5dxHu9cgzTNsIYKqXvj9pJyNVqhXQwwQLYvKGUqrmc4E8HZLxUY82OuXiJpLrqbfQvZpm9d_QQs_DO2twNrQw=w1920-h888',
                },
                {
                    src: 'https://lh3.googleusercontent.com/fife/AGXqzDm_et6E4j8Y6mTuXwQB_Czw4XhUUDBYsd--T_oM5LU6wE-BkDBXhBBWJ2zFPQPEwn6TxDpAzKhGTDy5b1d6wTcdnEjgAchxQ_Xsrokxor5m4OeG8QVwM8YB3oGLSm2MK4OYBtSSEm-FQBcVXXYr8UjadeV72lM7fjOWs7bIX4-TP6tABRaB80BVOQ92LDJd43C0zYS_jTZ8OFCYc1V1bs6ZQfP1pqhmFref3MNADiFDlvccARm-I1MAyPMaZBemXkMzMRYWAI0HQyjJoic93g4sdeCJKaItDGxm-mmHATQWXsRSDbIYxg-z7s-EKN25u9-ELGijrERghtj5Lh5zwB-nGIM2uWEsB_J0MLo5j1RJtMjQ1B6rD2uq38DlBQpgQwJ01A5pHkSEFWQbtFwOOa3aEVUFFrzC3nsBKXfNZLitWppWE8UyYd3rpN45gXFr3_-N6nrX0EOorE0mc4Kx7eDRwM7YyFKDv5baIGosDsU4N7dYXm6tQMGgsUTFs8AKM3w7u2n0mVKS_PDQQ_MHdWR2_fhJiDVTlseTL5PZwKbus5QqT5mU-14vN9r_LvhQOZFa2uuOQ97Lk7YX6gIJ7QhGkGeq5O_fApscFSqAGeiIHXxMz7-JgDYlqQ5qmG3q9seXo9ab4MpocO0CZBQ1nyTLHy6rSXA1N_LaRThJW64t82Dh8k0lHoy-a0oGQOzRpNTeGtFpVJiOczB604N4cLbGr3gj7qeHdPIFoWue5r1KqMwcIsmlU6xH1ezPlZpj0bA3D4Ru5Ax4I_kolHnUHtCGu1EJK23-5oI-Avztw9QHs1KaRwOu-IlPt8lSeE4YQlKft8qtWHz94pOUA2BSlp2wMijqY-uJwVk2eOWP1V5I7q3g_3FkIGoNaFsSDJZMcCWzSQ3NPcR1Q6nFHAN5Oofn-bQ5mEn80_zaQZgneYQTGU9Mrvax7aocbxlf4njWNPDPrAmA80cu8vBiNukgac1MqGxL2gTMYcuI0uYEcASdMrx-xJfOJXJsNrLGKBg4tu_p6hKUED2AYf16Zp8mC7T5xzGL_7LZNLv2y7iNsgehC09U2ZZ8xk5SL4aFF6I3hxGBi5yzB4YkYbbL37-Qcd4nXg0ePfvs4W60m_hrc2eHzw2zOycy1MQSpBtBPxgXg4P2gVwbWHPUISx1bzElySEdVBl_idO5saUabM49jtrgqJqk8go6hGLQYdkhEKPz1W_yPw4WIM8-bKWD63uKc_WoSPHl2DClVzPstywyMOhKYrfc6UJgORAtmpuFtoYJ7uwN0sDWHxfc32IU2AnMC5bPo6O9SKBLXf9q-8AoDWt_m6kkQ4lUivt2rACGkczmDvmAZXieMXedvKYbsUl9bdJDXkn02xx86tEEQHT8Tcmnv30Byy8tCWamiN6vKsReE5rNVMsop_A4Zg56S14DuQ0QiNK_DpU54AG0b0ITBRhqzpLFSbW8DwTkqMPtX83kWb9FHZkN5toNv94ZBvF61SA4ZN6bKiIaXgzEnzueHJXeDT-n71L0R79T-bEGWt8aXnou94aV4jDBBMeoq2_W6iEcabeS91VE=w1920-h888',
                },
                {
                    src: 'https://lh3.googleusercontent.com/fife/AGXqzDnD3DZsoDm-YQbmh-Hp4wm_MWyhdhBNE-3N3_s0ZAXQVqLPUz0pSlCMbsF9VLyJYGoA2QMLQXO2pNgbwpY7OkrrgV-VXKCpnTtbrWQJzvUZKhcj8fPJ-RwaTHSZSiKwBD_L7KelaPsHmTolYBMZtf0i5LO8chFw3ibzUwNdNHL_dXcgq8ldDBBL_o-EVUKO-GH5ImPLFdJppAJUJF4_41JbUpOaNOKUjbaue_A8lzGJL0sxS987Xlmh2e6m0U5luZs2MmMl32wHlHWdIKVbeB1xhNmuZ5I8a6euviLUlk7xN13du5_QN8mxvK0ci_anqo3JUrr7fUN0ZzDZ6N6tISMUrTBr_EV7kYVkxKUQmYfCpElAeVJPpcbsTxTQC04Dr14AAPzRmHedQw7jgtd02q6TleRgmu4YibL4HbClIZZorCbgPIg_0psk6Ikx2ERa9vFrcw70_1_chGdB79rQXHVgBRvwFX2ykIV6NIcoJyzEPJmbL8aVx3dciYwE3uDYz3HQSdb9574Djh6Yn1SG6yAEQ-CJxbp0i9q90eunSKnLArrGzyesTAIysjx6c-Pa-0PLmyi_3lweR0MgtfptWclyz4lB0VvRSGfPULQ43PgQoxSJ1FACwjGui_T_sfvWlWfKlSYK1rkj75md4pqDiG7kvDYaj-3k2iLkSDfrN0_PVUF4YHG2bccvo27U8n3AtqnaBYK2SvV1j8uPjQqc1MFgfyl2lCIM4t05CwEBHQjofJC8qWy3TprVXNPXkB917IIDNTTeyyaOSz312M8LXVvhgZ_55UYGRa6HnCM5sEbLcAoj5noqZlqKZJrrOzQwBckGGWHPOSDvWLwfgH0boj_YMnzauViI33wgdqWMn9z-BMJpAMaxFB1iscL81KIwguFf7YCy9hFSrwSLWSoRng7DW8iQwFasHtJrak2WvwjDuNhq00c94f8UsGWkcBKaSlt8lbhqcOwVIW3c6JvA7ddxXp17VFLO7J18gMzFYBZcUtiS6Z-qXLD0OocHWIW1hh-8Epeitzs0GhLKTJLarkNSsdKvBy6MGaQXCoq_kZHBZGHAk9pCKDxrXNrlZsaMnVfcwAzVD-KFgjACnBaCYqQIjjTbEVTHoqpqh1RIcqONkFR6rExiyiJFdr71p0rrNQc-kmymI6QDZSIanW9nVX0yTs56p6PsYcNK1Oa4FrOnxxdjxP3Ldm60ldBWapISNqETjgsa4qzcCOz2ML68hwA7MZDaYGwEDC-SX2PCFjEyiN0Ua3DA_i6gxAYfZDI7QN9ZL1iNYmkQAyaE7TuATszV6qRkCTwJfOPONI_H-7RjYNqRL9y0CUQWmjD0DhoBGU1Zk2OX4P_9IhZR7ELiOcee3-mOf8qYzzIAZibqFJMybOVMZgHVJtf7AiODU4noFwV0LUZr6Ed79ZTVf3R0TmQqOYN2y_lcN4dQsvlJdi6OX7liDTlqBjy2V9kTWUECWH8iYSjVBXetmZyTeosK0Lw6b3SLQgatEZ0g9iIuvYeUWIh5AeArjgjF7v1I4ws3r8FRvHjza8uPUaZovmtOX6NrMQrTnhEB=w1920-h888',
                }
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