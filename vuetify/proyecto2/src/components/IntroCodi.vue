<template>
    <div class="full-container">
        <v-row class="d-flex justify-center align-center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="rounded-xl elevation-6">
                    <v-row>
                        <v-col class="pa-10">
                            <h2 class="my-2 text-center">Introdueix el codi</h2>
                            <v-text-field input="text" label="Codi"></v-text-field>
                            <v-btn type="submit" color="primary" @click="$router.push('/WaitingRoomStudent')">Entra</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
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

</style>
