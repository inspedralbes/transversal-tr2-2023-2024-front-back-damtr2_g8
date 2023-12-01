import io from "socket.io-client";
import { reactive } from "vue";

export const socket = io("http://localhost:3751");

export const state = reactive({
  partida: 
    {
      idPartida: 0,
      jugadores: [
        {
          username: "",
          vida: 100,
          operacion: "",
        },
        {
            username: "",
            vida: 100,
            operacion: "",
        },
      ],
    },
});

socket.on("enviaJson", (data) => {
  state.partida = data;
});

socket.on("actualizarVida", (data) => {
  state.partida.jugadores[data.jugador].vida = data.vida;
});

