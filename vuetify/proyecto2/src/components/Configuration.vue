<template>
    <div class="div-gear">
        <div class="top-right-svg">
            <button @click="dialog = !dialog">
                <svg fill="#ffffff" height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.64 29.64" xml:space="preserve"
                    stroke="#ffffff" stroke-width="0.00029643">

                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <path
                                d="M18.621,12.397l-0.546-1.295c0,0,1.267-2.859,1.157-2.969l-1.678-1.639c-0.117-0.113-2.978,1.191-2.978,1.191l-1.32-0.533 c0,0-1.169-2.898-1.327-2.898h-2.37c-0.164,0-1.242,2.906-1.242,2.906L6.998,7.695c0,0-2.922-1.242-3.034-1.135L2.287,8.203 c-0.116,0.115,1.219,2.916,1.219,2.916l-0.544,1.295c0,0-2.962,1.139-2.962,1.295v2.322c0,0.16,2.969,1.217,2.969,1.217 l0.545,1.291c0,0-1.268,2.861-1.157,2.971l1.679,1.641c0.113,0.111,2.976-1.195,2.976-1.195l1.321,0.537 c0,0,1.166,2.896,1.326,2.896h2.37c0.163,0,1.244-2.906,1.244-2.906l1.32-0.535c0,0,2.918,1.242,3.031,1.135l1.678-1.643 c0.115-0.111-1.221-2.914-1.221-2.914l0.546-1.295c0,0,2.963-1.143,2.963-1.299v-2.32C21.591,13.453,18.621,12.397,18.621,12.397z M10.795,18.207c-1.905,0-3.459-1.52-3.459-3.387c0-1.865,1.554-3.385,3.459-3.385c1.908,0,3.459,1.52,3.459,3.385 C14.254,16.688,12.703,18.207,10.795,18.207z" />
                            <path
                                d="M28.538,9.693l0.014-0.676c0,0,1.118-1.006,1.091-1.076l-0.414-1.048c-0.031-0.072-1.544-0.062-1.544-0.062l-0.474-0.492 c0,0,0.058-1.502-0.013-1.533l-1.041-0.467c-0.074-0.033-1.117,1.035-1.117,1.035l-0.684-0.027c0,0-1.039-1.119-1.109-1.092 l-1.061,0.393c-0.071,0.025-0.036,1.518-0.036,1.518l-0.495,0.463c0,0-1.523-0.082-1.554-0.014l-0.457,1.02 c-0.032,0.072,1.065,1.119,1.065,1.119l-0.014,0.672c0,0-1.117,1.008-1.09,1.078l0.415,1.049c0.03,0.07,1.543,0.059,1.543,0.059 l0.473,0.494c0,0-0.055,1.502,0.016,1.533l1.041,0.465c0.072,0.033,1.116-1.029,1.116-1.029l0.685,0.023 c0,0,1.037,1.119,1.109,1.094l1.058-0.393c0.073-0.025,0.038-1.52,0.038-1.52l0.494-0.459c0,0,1.523,0.078,1.555,0.01l0.457-1.02 C29.634,10.74,28.538,9.693,28.538,9.693z M26.145,9.9c-0.367,0.82-1.347,1.184-2.187,0.809c-0.836-0.373-1.22-1.346-0.853-2.168 c0.365-0.818,1.348-1.18,2.184-0.807C26.126,8.111,26.51,9.082,26.145,9.9z" />
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                            <g> </g>
                        </g>
                    </g>

                </svg>
                <v-dialog v-model="dialog" activator="top-right-svg" width="auto">
                    <v-card class="card rounded-xl">
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col class="modal-row" cols="12">
                                        <div class="design-avatar">
                                            <img :src="getAvatarUrl(this.avatar)" alt="Avatar" style="width:90px;">
                                            <a href="#" @click.prevent="openAvatarModal"><svg width="30px" height="30px"
                                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="Edit / Edit_Pencil_Line_01">
                                                        <path id="Vector"
                                                            d="M4 20.0001H20M4 20.0001V16.0001L12 8.00012M4 20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"
                                                            stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                                                            stroke-linejoin="round" />
                                                    </g>
                                                </svg></a>
                                        </div>
                                    </v-col>
                                    <v-col class="modal-row" cols="12" sm="6">
                                        <p><b>Nom</b></p>
                                        <v-text-field type="name" variant="solo" disabled>{{ this.name }}</v-text-field>
                                    </v-col>
                                    <v-col class="modal-row" cols="12" sm="6">
                                        <p><b>Cognom</b></p>
                                        <v-text-field type="name" variant="solo" disabled>{{ this.surname }}</v-text-field>
                                    </v-col>
                                    <v-col class="modal-row" cols="12">
                                        <p><b>Correu</b></p>
                                        <v-text-field type="name" variant="solo" disabled>{{ this.email }}</v-text-field>
                                    </v-col>
                                    <v-col class="modal-row" cols="12">
                                        <v-text-field v-model="password1" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="show1 ? 'text' : 'password'" name="password1" label="Contrassenya"
                                            @click:append="show1 = !show1"></v-text-field>
                                        <v-text-field v-model="password2" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="show2 ? 'text' : 'password'" name="password2"
                                            label="Confirmar contrassenya" @click:append="show2 = !show2"></v-text-field>
                                        <!-- <div class="error-message">{{ errorMessage }}</div> -->
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1 buttons" variant="text" @click="dialog = false">Close</v-btn>
                            <v-btn color="blue-darken-1 buttons" variant="text" @click="checkPassword()">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="avatarModal" max-width="600px">
                    <v-card>
                        <v-card-title class="headline">
                            <p><b>Escull un avatar</b></p>

                        </v-card-title>
                        <v-btn class="btnCloseAvatar" icon @click="closeAvatarModal">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-card-text>
                            <v-row justify="center">
                                <v-col v-for="avatarId in avatarIds" :key="avatarId" cols="12" sm="6" md="4" lg="3">
                                    <v-avatar class="mx-auto" size="120" @click="handleAvatarClick(avatarId)"
                                        @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                                        <img :src="getAvatarUrl(avatarId)" alt="Avatar" style="width: 100%; height: 100%;">
                                    </v-avatar>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </button>
        </div>
    </div>
</template>

<script>
import {
    useAppStore
} from "@/store/app";

export default {
    data() {
        return {
            dialog: false,
            errorMessage: "",
            avatarModal: false,
            avatarIds: Array.from({ length: 40 }, (_, i) => i),
            name: "",
            surname: "",
            email: "",
            password1: "",
            password2: "",
            avatar: null,
            show1: false,
            show2: false,
            // rules: {
            //     required: value => !!value || 'Required.',
            //     min: v => v.length >= 8 || 'Min 8 characters',
            //     emailMatch: () => (`The email and password you entered don't match`),
            // }
        };
    },

    methods: {
        checkPassword() {
            /*  console.log("Dentro")
              this.password1 = password1.value;
              this.password2 = password2.value;
  
              console.log(password1);
              console.log(password2);
  
              // If Not same return False.     
              if (password1 != password2) {
                  alert("\nPassword did not match: Please try again...")
                  return false;
              }
  
              // If same return True. 
              else {
                  alert("Password Match: Welcome to GeeksforGeeks!")
                  cambiarContrasena();
                  return true;
              }*/

            console.log("Dentro");
            console.log("Contraseña 1", this.password1);
            console.log("Contraseña 2", this.password2);

            // If Not same return False.     
            if (this.password1 != this.password2) {
                //this.errorMessage = "Les contrassenyes no coincideixen";
                return false;
            } else {
                // If same return True. 
                this.cambiarContrasena();
                console.log("Iguales")
                return true;
            }

        },
        openAvatarModal() {
            this.avatarModal = true;
        },
        getAvatarUrl(avatarId) {
            return `https://api.dicebear.com/7.x/big-smile/svg?seed=${avatarId}&scale=80`;

        },
        closeAvatarModal() {
            this.avatarModal = false;
        },
        handleAvatarClick(avatarId) {
            //Aqui haremos para guardar el avatar en bd
            console.log(`Avatar ${avatarId} clicado`);
            this.avatar = avatarId;
            console.log(this.avatar);
            let store = useAppStore();
            store.usuari.avatar = this.avatar;

        },
        handleMouseEnter(event) {
            event.target.style.transform = 'scale(1.1)';
            event.target.style.transition = 'transform 0.3s ease';
            event.target.style.cursor = 'pointer';
        },
        handleMouseLeave(event) {
            event.target.style.transform = 'scale(1)';
            event.target.style.transition = 'transform 0.3s ease';
            event.target.style.cursor = 'default';
        },
        async cambiarContrasena() {

            console.log("Dentro")
            let store = useAppStore();
            let email = store.usuari.email;

            let response = await fetch(import.meta.env.VITE_NODE_ROUTE + "/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password2: this.password2,

                }),

            });
            if (!response.ok) {
                window.alert("Error al cambiar la contraseña");
                this.dialog = false;
                console.log(response);
            } else {
                window.alert("Contraseña cambiada correctamente");
                this.dialog = false;
            }
        }
    }, mounted() {
        let store = useAppStore();
        this.name = store.usuari.nom;
        console.log(this.name);
        this.surname = store.usuari.cognom;
        console.log(this.surname);
        this.email = store.usuari.email;
        console.log(this.email);
        this.avatar = store.usuari.avatar;
        console.log(this.avatar);
    }
}

</script>

<style scoped>
.headline {
    margin-top: 20px;
    font-size: 30px;
    font-weight: bold;
}

.btnCloseAvatar {
    position: absolute;
    right: 0;
    margin: 15px;
}

.buttons {
    background-color: white;
    margin-right: 10px;
    margin-bottom: 10px;
}

.card {
    background-color: #5CBBF6;
    width: 600px;
    overflow: hidden;


}

.design-avatar {
    display: flex;
    align-items: center;
}

.top-right-svg {
    position: absolute;
    top: 0;
    right: 0;

    margin-top: 30px;
    margin-right: 90px;
}

.div-gear {
    position: relative;
}

.modal-row {
    margin-bottom: -15px;
    margin-top: -10px;
}</style>