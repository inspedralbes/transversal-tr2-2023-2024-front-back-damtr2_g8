<template>
    <div class="full-container">
        <v-row class="d-flex justify-center align-center">
            <v-col cols="12" sm="8">
                <v-card class="rounded-xl elevation-6">
                    <v-row>
                        <v-col cols="6" class=" pl-10 py-10">
                            <h2 class="my-2 text-center">Registra't</h2>
                            <v-form @submit.prevent="register" class="mr-6">
                                <div class="name-field">
                                    <v-text-field v-model="emailRegistration.name" :rules="emailRegistration.nameRules"
                                        label="Nom*" type="name" class="pr-6" required></v-text-field>
                                    <v-text-field v-model="emailRegistration.surname" :rules="emailRegistration.nameRules"
                                        label="Cognom*" type="cognom" required></v-text-field>
                                </div>
                                <v-text-field v-model="emailRegistration.email" :rules="emailRegistration.emailRules"
                                    label="Email*" type="email" required></v-text-field>

                                <v-text-field v-model="emailRegistration.password"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="emailRegistration.passwordRules" :type="show1 ? 'text' : 'password'"
                                    name="input-10-1" label="Contrassenya*" @click:append="show1 = !show1"
                                    required></v-text-field>
                                <div class="name-field">
                                    <v-checkbox id="profeRegistro" type="checkbox" label="Soc professor/a"></v-checkbox>
                                </div>
                                <v-btn id="btnSubmit" type="submit" color="primary">Registra't</v-btn>
                            </v-form>
                        </v-col>
                        <v-col cols="6" class="container-right pr-10 py-10">
                            <h2 class="my-2 ml-6 text-center">Inicia sessió</h2>
                            <v-form @submit.prevent="login" class="ml-6">
                                <v-text-field v-model="usernameLogin.email" :rules="emailRegistration.emailRules"
                                    label="Email*" type="email" required></v-text-field>
                                <v-text-field v-model="usernameLogin.password"
                                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="emailRegistration.passwordRules" :type="show2 ? 'text' : 'password'"
                                    name="input-10-1" label="Contrassenya*" @click:append="show2 = !show2"
                                    required></v-text-field>
                                <v-checkbox type="checkbox" id="profeLogin" label="Soc professor/a"></v-checkbox>
                                <v-btn type="submit" color="primary">Inicia sessió</v-btn>

                            </v-form>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { register, login } from '@/services/communicationManager';
import { useAppStore } from '@/store/app';
import party from 'party-js';

export default {
    data() {
        return {
            show1: false,
            show2: false,
            emailRegistration: {
                name: '',
                surname: '',
                email: '',
                password: '',
                isAdmin: false,
                nameRules: [
                    value => {
                        if (value) return true
                        return 'Aquest camp és obligatori.'
                    },
                    value => {
                        if (value?.length <= 10) return true

                        return 'El nom ha de ser més curt.'
                    },
                ],
                emailRules: [
                    value => {
                        if (value) return true

                        return 'Aquest camp és obligatori.'
                    },
                    value => {
                        if (/.+@.+\..+/.test(value)) return true
                        return "L'email ha de ser vàlid."
                    },
                ],

                passwordRules: [
                    value => {
                        if (value) return true
                        return 'Aquest camp és obligatori.'
                    },

                ],
            },
            usernameLogin: {
                email: '',
                password: '',
                admin: false,
            },
        };
    },
    methods: {
        lanzarConfeti() {
            const btnSubmit = document.getElementById('btnSubmit');

            party.confetti(btnSubmit);

            party.sparkles(btnSubmit);
        },
        async register() {
            this.emailRegistration.isAdmin = document.getElementById("profeRegistro").checked;

            let data = await register(this.emailRegistration);

            if (data.err) {
                console.log(data.err);
            } else {
                let store = useAppStore();
                store.usuari.nom = this.emailRegistration.name;
                store.usuari.cognom = this.emailRegistration.surname;
                store.usuari.email = this.emailRegistration.email;
                store.usuari.id = data.userData.insertId;
                this.$router.push(this.emailRegistration.isAdmin ? '/classes' : '/join');
            }
        },
        async login() {
            this.usernameLogin.admin = document.getElementById("profeLogin").checked;

            let data = await login(this.usernameLogin);

            if (data.err) {
                window.alert("L'usuari o la contrasenya no són correctes o no existeixen")
            } else {
                let store = useAppStore();
                store.usuari.nom = data.userData.nom;
                store.usuari.cognom = data.userData.cognom;
                store.usuari.email = data.userData.correu;
                store.usuari.id = data.userData.idUsu;
                this.$router.push(this.usernameLogin.admin ? '/classes' : '/join');
            }
        },

    },
};
</script>

<style scoped>
.name-field {
    display: flex;
    flex-wrap: wrap;
}

.imgFondo {
    z-index: 1;
}

.full-container {
    background-color: lightblue;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container-right {
    /* background-color: #72BAE8; */
    width: 100%;
    background-image: url("../assets/Background.png");

}</style>
