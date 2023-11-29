<template>
    <div class="full-container">
        <h2>Sala d'espera</h2>
        <h1 class="text-h1 font-weight-black">Codi sala: 222</h1>

        <v-btn class="my-button" @click="$router.push('/sala')">COMENÇA</v-btn>
    </div>
    <div class="footer">
        <div class="user-col">
            <div class="user-row">
                <div class="user-item">
                    <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                    <h3>ivetetetete</h3>
                </div>

                <div class="user-item">
                    <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                    <h3>ivetetetete</h3>
                </div>

                <div class="user-item">
                    <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                    <h3>ivetetetete</h3>
                </div>
            </div>
        </div>

        <div class="user-col">
            <div class="user-row">
                <div class="user-item">
                    <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                    <h3>ivetetetete</h3>
                </div>

                <div class="user-item">
                    <v-img class="img-avatar" src="../assets/avatar1.png" width="75px" />
                    <h3>ivetetetete</h3>
                </div>
            </div>
        </div>
    </div>
</template>


<style>


.footer {
    height: 300px;
    background-color: #79b6c9;
    margin-top: auto;
    padding: 20px;
    width: auto;
}

.user-col {
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-row {
    display: flex;
    align-items: center;
}

.user-item {
    margin: 5px 50px;
    text-align: center;
}

.img-avatar {
    display: block;
    /* Asegura que la imagen se comporte como un bloque */
    margin: 0 auto;
    /* Centra la imagen horizontalmente y agrega espacio en la parte inferior */
}

.full-container {
    padding-top: 20px;
    background-color: #add8e6;
    height: 310px;
    display: flex;
    flex-direction: column;
    text-align: center;
    overflow: hidden;
}

.my-button {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 10px;
    width: auto;
    /* padding: auto; */
    border-radius: 2px;
    background-color: #72BAE8;
    color: white;
}
</style>