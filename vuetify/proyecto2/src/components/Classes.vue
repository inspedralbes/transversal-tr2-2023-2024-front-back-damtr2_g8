<template>
    <div class="full-container">
        <v-container>
        <v-card class="vcard">
            <v-card-title class="titleCard">Matemàtiques B</v-card-title>

            <v-card-text class="txtCard">
                <b>Usuaris: 0</b>
                <div>
                    <v-btn class="my-button" @click="$router.push('/sala')">Uneix-te</v-btn>
                </div>
            </v-card-text>
        </v-card>

        <v-card class="vcard">
            <v-card-title class="titleCard2">Matemàtiques F</v-card-title>

            <v-card-text class="txtCard">
                <b>Usuaris: 0</b>
                <div>
                    <v-btn class="my-button" @click="$router.push('/')">Uneix-te</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
    </div>
    
</template>

<style scoped>

.full-container{
   
    background-color: lightblue;
}

.vcard{
    margin-top: 70px;
}
.titleCard {
    padding: 30px;
    background-image: url("../assets/Background.png");
}

.titleCard2{
    padding: 30px;
    background-image: url("../assets/BackgroundGreen.png");
}

.txtCard {
    padding: 20px;
    margin-top: 20px;
}

.my-button {
    margin-top: 10px;
    padding: auto;
    border-radius: 2px;
    background-color: #72BAE8;
    color: white;
}
</style>