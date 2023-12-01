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


<style scoped>
html,
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
    margin: 0 auto;
}

.full-container {
    height: 100vh;
    padding-top: 20px;
    background-color: #add8e6;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;

}

.footer {

    background-color: #79b6c9;
    padding: 20px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

}


.my-button {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 10px;
    width: fit-content;
    border-radius: 2px;
    color: #72BAE8;
}
</style>