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
  joinedSala: null,
  play: false,
  sala: null,
  partidas: null,
});

socket.on("enviaJson", (data) => {
  state.partida = data;
});

socket.on("actualizarVida", (data) => {
  state.partida.jugadores[data.jugador].vida = data.vida;
});

socket.on("actualizarOperacion", (data) => {
  state.partida.jugadores[data.jugador].operacion = data.operacion;
});

socket.on("join", (data) => {
  state.joinedSala = data;
});

socket.on("startGame", (idSala) => {
  state.play = true;
  state.sala = idSala;
});

socket.on("getPartidas", (data) => {
  console.log(data);
  state.partidas = data;
});

