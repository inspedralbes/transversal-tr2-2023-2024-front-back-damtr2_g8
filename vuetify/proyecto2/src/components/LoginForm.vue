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
                                        label="Nom" type="name" class="pr-6" required></v-text-field>
                                    <v-text-field v-model="emailRegistration.surname" :rules="emailRegistration.nameRules"
                                        label="Cognom" type="cognom" required></v-text-field>
                                </div>
                                <v-text-field v-model="emailRegistration.email" :rules="emailRegistration.emailRules"
                                    label="Email" type="email" required></v-text-field>
                                <v-text-field v-model="emailRegistration.password" :rules="emailRegistration.passwordRules" label="Password" type="password"
                                    required></v-text-field>
                                <div class="name-field">
                                    <v-checkbox id="profeRegistro" type="checkbox" label="Soc professor/a"></v-checkbox>

                                </div>

                                <v-btn type="submit" color="primary">Registra't</v-btn>
                            </v-form>
                        </v-col>

                        <v-col cols="6" class="container-right pr-10 py-10">
                            <h2 class="my-2 ml-6 text-center">Inicia sessió</h2>
                            <v-form @submit.prevent="login" class="ml-6">
                                <v-text-field v-model="usernameLogin.email" :rules="emailRegistration.emailRules" label="Email" type="email"
                                    required></v-text-field>
                                <v-text-field v-model="usernameLogin.password" :rules="emailRegistration.passwordRules" label="Password" type="password"
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
import { useAppStore } from '@/store/app';
export default {
    data() {
        return {
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

                        return 'Name must be less than 10 characters.'
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
        async register() {
            this.emailRegistration.isAdmin = document.getElementById("profeRegistro").checked;

            fetch(import.meta.env.VITE_NODE_ROUTE + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: this.emailRegistration.name,
                    cognom: this.emailRegistration.surname,
                    email: this.emailRegistration.email,
                    password: this.emailRegistration.password,
                }),
            }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                if(data.err) {
                    console.log(data.err);
                } else {
                    if(this.emailRegistration.isAdmin) {
                        const store = useAppStore();
                        store.setIdProfessor(data.userData.idUsu);
                        this.$router.push('/classes');
                    } else {
                        this.$router.push('/join');
                    }
                    
                }
            });

        },
        async login() {
            console.log('Logging in user:', this.usernameLogin.email, this.usernameLogin.password);

            this.usernameLogin.admin = document.getElementById("profeLogin").checked;

            fetch(import.meta.env.VITE_NODE_ROUTE + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.usernameLogin.email,
                    password: this.usernameLogin.password,
                }),
            }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                if(data.err) {
                    console.log(data.err);
                } else {
                    if (this.usernameLogin.admin) {
                        const store = useAppStore();
                        store.setIdProfessor(data.userData.idUsu);
                        this.$router.push('/classes');
                    } else {
                        this.$router.push('/join');
                    }
                }
            });
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

}
</style>
