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
    status: "",
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

socket.on("startGame", (startInfo) => {
  state.play = startInfo.play;
  state.sala = startInfo.idSala;
  state.partida.status = "waiting";
});

socket.on("getPartidas", (data) => {
  state.partidas = data;
});

socket.on("finishGame", (data) => {
  state.partida.status = "error";
});

