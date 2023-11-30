<template>
    <div class="full-container">
        <v-row class="d-flex justify-center align-center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="rounded-xl elevation-6">
                    <v-row>
                        <v-col cols="6" class=" pl-10 py-10">
                            <h2 class="my-2 text-center">Registra't</h2>
                            <v-form @submit.prevent="register" class="mr-6">
                                <v-text-field v-model="emailRegistration.email" label="Email" type="email"
                                    required></v-text-field>
                                <v-text-field v-model="emailRegistration.password" label="Password" type="password"
                                    required></v-text-field>
                                    <v-btn type="submit" color="primary">Registra't</v-btn>
                            </v-form>
                        </v-col>

                        <v-col cols="6" class="container-right pr-10 py-10">
                            <h2 class="my-2 ml-6 text-center">Inicia sessió</h2>
                            <v-form @submit.prevent="login" class="ml-6">
                                <v-text-field v-model="usernameLogin.email" label="Email" type="email"
                                    required></v-text-field>
                                <v-text-field v-model="usernameLogin.password" label="Password" type="password"
                                    required></v-text-field>
                                <v-checkbox type="checkbox"  id="profe" label="Soc professor/a"></v-checkbox>
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
export default {
    data() {
        return {
            emailRegistration: {
                username: '',
                email: '',
                password: '',
            },
            usernameLogin: {
                email: '',
                password: '',
            },
        };
    },
    methods: {
        register() {
            console.log('Registering user:', this.emailRegistration.username, this.emailRegistration.email, this.emailRegistration.password);
        },
        async login() {
            console.log('Logging in user:', this.usernameLogin.email, this.usernameLogin.password);

            var element = document.getElementById("profe");

            const response = await fetch('http://192.168.16.27:3751/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.usernameLogin.email,
                    password: this.usernameLogin.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else{
                const data = await response.json();

            console.log('Server Response:', data);

            // Use this.$router instead of $router
            if (element.checked && data.userData.admin == 1) {
                this.$router.push('/classes');
            } else {
                this.$router.push('/join');
            }
            }

            
        },
    },
};
</script>

<style scoped>
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

.image {
    right: 50px;
    bottom: -50px;
    z-index: 1;
}

.imageMultiplication {
    right: -600px;
    bottom: 60px;
    z-index: 1;
}


</style>
