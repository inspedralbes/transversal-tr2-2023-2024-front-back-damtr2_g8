<script>
import { socket, state } from '@/services/socket';
import { useAppStore } from "@/store/app";

export default {
    data() {
        return {
            errorCode: false,
            errorText: "",
            proveSala: false,
            store: useAppStore(),
            codi: "",
        };
    },
    methods: {
        onSubmit() {
            this.proveSala = true;
            const form = document.querySelector('form');
            const inputs = form.querySelectorAll('input');
            for (let i = 0; i < inputs.length; i++) {
                this.codi += (inputs[i].value).toString();
            }
            socket.emit("joinSala", { codi: this.codi, username: this.store.usuari.nom, idAvatar: this.store.usuari.avatar });
        },
        async pasteCode() {
            try {
                this.errorCode = false;
                const form = document.querySelector('form');
                const inputs = form.querySelectorAll('input');
                const paste = await navigator.clipboard.readText();
                inputs.forEach((input, i) => {
                    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""].includes(paste[i])) {
                        input.value = paste[i];
                    } else {
                        this.errorCode = true;
                        this.errorText = "Error al copiar el codi";
                    }
                })
            } catch (error) {
                console.error(error);
                this.errorCode = true;
                this.errorText = "Error al copiar el codi";
            }
        }
    },
    watch: {
        'setSala': function (nuevoValor, antiguoValor) {
            if (nuevoValor == false) {
                this.errorCode = true;
                this.errorText = "El codi de la sala no existeix";
                this.proveSala = false;
                state.joinedSala = null;
            } else if (nuevoValor != null && nuevoValor != false && this.codi != "") {
                this.$router.push('/sala');
            }
            this.codi = "";
        },
    },
    computed: {
        setSala() {
            return state.joinedSala;
        },
    },
    mounted() {
        this.store.usuari.id == null ? this.$router.push("/inici") : null;
        const form = document.querySelector('form')
        const inputs = form.querySelectorAll('input')
        const KEYBOARDS = {
            backspace: 8,
            arrowLeft: 37,
            arrowRight: 39,
        }

        function handleInput(e) {
            const input = e.target;
            const nextInput = input.nextElementSibling;

            if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""].includes(input.value)) {
                if (nextInput && input.value) {
                    nextInput.focus();

                    if (nextInput.value) {
                        nextInput.select();
                    }
                }
            } else {
                input.value = "";
            }
        }

        function handlePaste(e) {
            e.preventDefault()
            const paste = e.clipboardData.getData('text')
            inputs.forEach((input, i) => {
                if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""].includes(paste[i])) {
                    input.value = paste[i];
                }
            })
        }

        function handleBackspace(e) {
            const input = e.target;
            if (input.value) {
                input.value = ''
                return
            }

            if (input.previousElementSibling != null) {
                input.previousElementSibling.focus()
            }
        }

        function handleArrowLeft(e) {
            const previousInput = e.target.previousElementSibling
            if (!previousInput) return
            previousInput.focus()
        }

        function handleArrowRight(e) {
            const nextInput = e.target.nextElementSibling
            if (!nextInput) return
            nextInput.focus()
        }

        form.addEventListener('input', handleInput)
        inputs[0].addEventListener('paste', handlePaste)

        inputs.forEach(input => {
            input.addEventListener('focus', e => {
                setTimeout(() => {
                    e.target.select()
                }, 0)
            })

            input.addEventListener('keydown', e => {
                switch (e.keyCode) {
                    case KEYBOARDS.backspace:
                        handleBackspace(e)
                        break
                    case KEYBOARDS.arrowLeft:
                        handleArrowLeft(e)
                        break
                    case KEYBOARDS.arrowRight:
                        handleArrowRight(e)
                        break
                    default:
                }
            })
        })
    },
};
</script>

<template>
    <div class="full-container">
        <div class="center-container">
            <v-card class="pa-10 bg-grey-lighten-5 elevation-5 rounded-xl">
                <h1 class="title">UNEIX-TE</h1>
                <form @submit.prevent="">
                    <div class="d-flex my-3">
                        <input type="text" maxlength="1" class="form-control">
                        <input type="text" maxlength="1" class="form-control">
                        <input type="text" maxlength="1" class="form-control">
                        <input type="text" maxlength="1" class="form-control">
                        <input type="text" maxlength="1" class="form-control">
                        <input type="text" maxlength="1" class="form-control">
                        <div class="paste-btn-container">
                            <button class="paste-btn" @click="() => pasteCode()">
                                <svg fill="black" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <v-snackbar v-model="errorCode" :timeout="3000" color="error" class="text-center">
                        {{ errorText }}
                        <template v-slot:actions>
                            <v-btn color="white" variant="text" @click="errorCode = false">
                                <svg fill="white" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960"
                                    width="18">
                                    <path
                                        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </svg>
                            </v-btn>
                        </template>
                    </v-snackbar>

                    <div class="btn-container">
                        <button class="btn" @click="onSubmit">JUGAR</button>
                    </div>

                    <p clickable class="text-center mt-3 linkClasses " @click="$router.push('/classes')"><b>Crea una
                            sala</b></p>
                </form>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
.linkClasses {
    cursor: pointer;
}

.title {
    text-align: center;
    letter-spacing: 2.5px;
    margin-bottom: 25px;
    font-size: 42px;
}

.full-container {
    background-color: lightblue;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.logo {
    margin-bottom: 4px;
}

.form-control {
    display: block;
    width: 48px;
    height: 60px;
    margin-right: 0.5rem;
    text-align: center;
    font-size: 1.25rem;
    min-width: 0;
    border: 1.5px solid lightgrey;
    outline: none;
}

.form-control:active {
    transform: scale(0.95);
    border: 2px solid lightgrey;
}

.form-control:hover {
    border: 2px solid lightgrey;
    box-shadow: 0px 0px 20px -17px;
}

.form-control:focus {
    border: 2px solid lightgrey;
}

.form-control:last-child {
    margin-right: 0;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}

.btn-container {
    display: flex;
    justify-content: center;
}

.btn {
    margin-top: 25px;
    border: none;
    color: #fff;
    background: linear-gradient(30deg, #3431b4, #07bad1);
    border-radius: 30px;
    background-size: 200% auto;
    background-position: center center;
    font-size: 17px;
    padding: 0.6em 1.5em;
    font-weight: 400;
    letter-spacing: 2.5px;
    transition: background-position 0.15s ease-in-out;
}

.btn:hover {
    background-position: left center;
    animation: pulse512 1.5s infinite;
}

@keyframes pulse512 {
    0% {
        box-shadow: 0 0 0 0 #05bada66;
    }

    70% {
        box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
    }

    100% {
        box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
    }
}

.paste-btn {
    width: 28px;
    height: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background-color: lightblue;
    transition: background-color 0.15s ease-in-out;
    margin-left: 5px;
}

.paste-btn:hover {
    background-color: rgb(141, 196, 214);
}

.paste-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>