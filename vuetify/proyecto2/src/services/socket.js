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
        },
        {
            username: "",
            vida: 100,
        },
      ],
    },
});

socket.on("enviaJson", (...data) => {
  state.partida = data[0];
});

