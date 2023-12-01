function sockets(io) {
  let partidas = [];

  io.on("connection", (socket) => {
    socket.on("restarVida", ({ idPartida, idJugador, idCantidad }) => {
      disminuirVida(idPartida, idJugador, idCantidad);
    });

    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user);
    });
  });

  // Función para disminuir la vida de un jugador en una partida
  function disminuirVida(idPartida, idJugador, idCantidad) {
    let cantidad = 0;
    switch (idCantidad) {
      case 1:
        cantidad = 5;
        break;
      case 2:
        cantidad = 10;
        break;
      case 3:
        cantidad = 15;
        break;
    }
    const partida = partidas.find((p) => p.idPartida == idPartida);

    if (partida) {
      const vidaActual =
        idJugador == 1 ? partida.jugadores[1].vida : partida.jugadores[0].vida;
      const nuevaVida = Math.max(0, vidaActual - cantidad);

      partida.jugadores[idJugador].vida = nuevaVida;

      for (let i = 0; i < partida.jugadores.length; i++) {
        io.to(partida.jugadores[i].idSocket).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: idJugador == 1 ? 1 : 0,
        });
      }
    }
  }

  function gestionarPartida(socket, user) {
    let jugador = {
      idSocket: socket.id,
      username: user.username,
      vida: 100,
      operacion: "",
      resultadoJugador: null,
    };

    if (partidas.length == 0) {
      partidas.push({
        idPartida: partidas.length + 1,
        jugadores: [jugador],
      });
    } else {
      if (partidas.every((partida) => partida.jugadores.length == 2)) {
        partidas.push({
          idPartida: partidas.length + 1,
          jugadores: [jugador],
        });
      } else {
        for (let i = 0; i < partidas.length; i++) {
          if (partidas[i].jugadores.length < 2) {
            partidas[i].jugadores.push(jugador);
            i = partidas.length;
          }
        }
      }
    }

    let idPartidaFind = partidas.findIndex((partida) =>
      partida.jugadores.some((jugador) => jugador.idSocket === socket.id)
    );

    if (partidas[idPartidaFind].jugadores.length == 2) {
      for (let i = 0; i < partidas[idPartidaFind].jugadores.length; i++) {
        io.to(partidas[idPartidaFind].jugadores[i].idSocket).emit(
          "enviaJson",
          partidas[idPartidaFind]
        );
      }
    }
  }
}

module.exports = { sockets };
