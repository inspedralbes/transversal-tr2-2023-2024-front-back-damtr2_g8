<template>
    <v-container>
        <v-card>
            <v-card-title class="titleCard">Matemàtiques 4t B</v-card-title>

            <v-card-text class="txtCard">
                Usuaris: 0
                <div>
                    <v-btn class="my-button">
                        <router-link to="/modoOne">Uneix-te</router-link>
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style>
.titleCard{
    padding: 30px;
    background-image: url("../assets/Background.png");

}

.txtCard{
    margin-top: 10px;
}
.my-button {
    margin: 10px;
    padding: auto;
    border-radius: 2px;
    background-color: #72BAE8;
    color: white;
}
</style>