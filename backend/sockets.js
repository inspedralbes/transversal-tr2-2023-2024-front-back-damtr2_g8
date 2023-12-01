function sockets(io, partidas) {
  io.on("connection", (socket) => {
    socket.on("restarVida", ({ idPartida, idJugador, idCantidad }) => {
      disminuirVida(idPartida, idJugador, idCantidad);
    });

    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user);
    });

    socket.on("getOperation", ({ idPartida, idJugador }) => {
      getOperation(idPartida, idJugador);
    });

    socket.on("solveOperation", ({ idPartida, idJugador, result }) => {
      solveOperation(idPartida, idJugador, result);
    });
  });

  function solveOperation(idPartida, idJugador, result) {
    let correcto = false;
    const partida = partidas.find((p) => p.idPartida == idPartida);
    realResult = eval(partida.jugadores[idJugador].operacion);
    if (realResult == result) {
      correcto = true;
      disminuirVida(idPartida, idJugador, partida.jugadores[idJugador].dificultad);
    }

    io.to(partida.jugadores[idJugador].idSocket).emit("evaluacionResultado", {
      result: correcto,
    });
  }

  function getOperation(idPartida, idJugador) {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;

    const operators = ["+", "-"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    const operacionGuardar = `${num1} ${operator} ${num2}`;

    const partida = partidas.find((p) => p.idPartida == idPartida);
    partida.jugadores[idJugador].operacion = operacionGuardar;

    io.to(partida.jugadores[idJugador].idSocket).emit("actualizarOperacion", {
      operacion: operacionGuardar,
      jugador: idJugador == 1 ? 1 : 0,
    });
  }

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
      dificultad: 1,
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
