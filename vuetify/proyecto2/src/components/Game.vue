<script>
export default {
    data() {
        return {
            user1: {
                name: "Marti",
                ps: 100
            },
            user2: {
                name: "Damia",
                ps: 100
            },
            operacion: "",
            seeOperation: false,
            result: null
        };
    },
    methods: {
        getOperation(option) {
            let url = "http://localhost:3751/";

            switch (option) {
                case 0:
                    url += "operacioFacil";
                    break;
                case 1:
                    url += "operacioMitg";
                    break;
                case 2:
                    url += "operacioDificil";
                    break;
            }

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.operacion = data;
                    this.seeOperation = true;
                });
        },
        solveOperation() {
            console.log(this.result);
            let url = "http://localhost:3751/resoldre/" + this.operacion.num1 + "/" + this.operacion.num2 + "/" + this.operacion.operator;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                });
        }
    },
    mounted() {
    }
};
</script>

<template>
    <v-container>
        <h1>Game</h1>
        <div>
            <h2>{{ user1.name }}</h2>
            <h2>{{ user1.ps }}</h2>
        </div>
        <div>
            <h2>{{ user2.name }}</h2>
            <h2>{{ user2.ps }}</h2>
        </div>
        <div>
            <v-btn @click="getOperation(0)">Facil</v-btn>
            <v-btn @click="getOperation(1)">Medio</v-btn>
            <v-btn @click="getOperation(2)">Dificil</v-btn>
        </div>
        <div v-if="seeOperation">
            <div>Operacion: {{ operacion.num1 + " " + operacion.operator + " " + operacion.num2 }}</div>
            <v-text-field label="Resultado" type="number" v-model="result"></v-text-field>
            <v-btn @click="solveOperation()">Resolver</v-btn>
        </div>
    </v-container>
</template>

<style></style>