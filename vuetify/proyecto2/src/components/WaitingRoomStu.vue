<template>
    <div class="full-container">
        <h2>Sala d'espera</h2>
        <h2 class="text-h2 font-weight-black">Espera a que el professor comenci la partida</h2>
        <div class="loader"></div>
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
    margin: 0 auto;
}

.full-container {
    padding-top: 70px;
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

:root {
    --divide-image: url(@/assets/divide.png);
    --equal-image: url(@/assets/equal.png);
    --more-less-image: url(@/assets/moreLess.png);
}


.loader {
    width: 80px;
    aspect-ratio: 2;
    --_g: no-repeat var(--divide-image), no-repeat var(--equal-image), no-repeat var(--more-less-image);
    background:
        var(--_g) 0% 50%,
        var(--_g) 50% 50%,
        var(--_g) 100% 50%;
    background-size: calc(100%/3) 50%;
    animation: l3 1s infinite linear;
    margin: 20px auto;
}

@keyframes l3 {
    20% {
        background-position: 0% 0%, 50% 50%, 100% 50%
    }

    40% {
        background-position: 0% 100%, 50% 0%, 100% 50%
    }

    60% {
        background-position: 0% 50%, 50% 100%, 100% 0%
    }

    80% {
        background-position: 0% 50%, 50% 50%, 100% 100%
    }
}
</style>

<script setup>
import divideImage from '@/assets/divide.png';
import equalImage from '@/assets/equal.png';
import moreLessImage from '@/assets/moreLess.png';
</script>