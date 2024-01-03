import io from "socket.io-client";
import { reactive } from "vue";
import _ from 'lodash';

export const socket = io(import.meta.env.VITE_NODE_ROUTE);
let num = 0;

export const state = reactive({
  partida: {
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
  state.play = false;
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
  state.play = false;
});

socket.on("startGame", (idSala) => {
  state.play = true;
  state.sala = idSala;
  state.partida.status = "waiting";
});

const debouncedUpdate = _.debounce((data) => {
  state.partidas = data;
}, 500);

socket.on("getPartidas", (data) => {
  debouncedUpdate(data);
  num++;
});

