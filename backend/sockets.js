function sockets(io) {
  let partidas = [];

  io.on("connection", (socket) => {
    socket.on("restarVida", ({ idPartida, idJugador, cantidad }) => {
      console.log(idPartida, idJugador, cantidad);
      disminuirVida(idPartida, idJugador, cantidad);
    });

    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user);
    });


  });

  // Función para disminuir la vida de un jugador en una partida
  function disminuirVida(idPartida, idJugador, cantidad) {
    const partida = partidas.find((p) => p.idPartida == idPartida);

    if (partida) {
      const vidaActual =
        idJugador == 1 ? partida.jugador1.vida : partida.jugador2.vida;
      const nuevaVida = Math.max(0, vidaActual - cantidad);

      if (idJugador == 1) {
        partida.jugador1.vida = nuevaVida;
        io.to(partida.jugador1.idSocket).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: 1,
        });
        io.to(partida.socket2).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: 2,
        });
      } else {
        partida.jugador2.vida = nuevaVida;
        io.to(partida.socket1).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: 1,
        });
        io.to(partida.socket2).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: 2,
        });
      }
    }
  }

  function gestionarPartida(socket, user) {
    let jugador = {
      idSocket: socket.id,
      username: user.username,
      vida: 100,
      operacion: "√12",
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
