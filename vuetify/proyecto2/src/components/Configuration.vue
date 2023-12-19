<template>
    <div class="div-gear">
        <div class="top-right-svg">
            <button @click="dialog = !dialog">
                <v-btn variant="text" icon="" size="large">
                    <v-icon icon="mdi-account" size="x-large" color="white" variant="text"></v-icon>
                </v-btn>
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
                                                </svg>
                                            </a>
                                            <a class="logOut" href="/" @click="logout()">
                                                <svg width="30px" viewBox="0 0 64.00 64.00"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff2414"
                                                    stroke-width="4.928">
                                                    <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <g id="SVGRepo_iconCarrier">
                                                        <polyline points="40 44 40 56 8 56 8 8 40 8 40 20" />
                                                        <polyline points="48 40 56 32 48 24" />
                                                        <line x1="28" y1="32" x2="56" y2="32" />
                                                    </g>
                                                </svg>
                                            </a>
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
        logout() {

            let store = useAppStore();
            store.usuari = {
                nom: "",
                cognom: "",
                email: "",
                avatar: null,
            };

        },
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
        this.surname = store.usuari.cognom;
        this.email = store.usuari.email;
        this.avatar = store.usuari.avatar;
    }
}

</script>

<style scoped>
.logOut{
    position: absolute;
    right: 0;
    margin-right: 50px;
}

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
}
</style>