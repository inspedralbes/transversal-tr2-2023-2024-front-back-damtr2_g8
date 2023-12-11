function sockets(io, partidas) {
  let salas = [];

  io.on("connection", (socket) => {
    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user);
    });

    socket.on("getOperation", ({ idPartida, idJugador, dificultad }) => {
      getOperation(idPartida, idJugador, dificultad);
    });

    socket.on("solveOperation", ({ idPartida, idJugador, result }) => {
      solveOperation(idPartida, idJugador, result);
    });

    socket.on("createSala", (idClasse) => {
      crearSala(idClasse, socket.id);
    });

    socket.on("joinSala", (userInfo) => {
      joinSala(userInfo, socket.id);
    });

    socket.on("startGame", () => {
      const sala = salas.find(sala => sala.owner == socket.id);
      for (let i = 0; i < sala.jugadores.length; i++) {
        io.to(sala.jugadores[i].id_jugador).emit("startGame", sala.id_sala);
      }
      io.to(sala.owner).emit("startGame", sala.id_sala);
      io.to(sala.owner).emit("getPartidas", partidas.filter(partida => partida.id_sala == sala.id_sala));
    });

    socket.on("disconnect", () => {
      borrarSala(socket.id);
      desconectarJugador(socket)
    });
  });

  function borrarSala(id) {
    const borrarSala = salas.find(sala => sala.owner == id);
    salas = salas.filter(sala => sala.owner != id);
    if (borrarSala) {
      for (let i = 0; i < borrarSala.jugadores.length; i++) {
        io.to(borrarSala.jugadores[i].id_jugador).emit("join", false);
      }
    }
  }

  function desconectarJugador(socket) {
    for (let i = 0; i < salas.length; i++) {
      const sala = salas[i];
      const indexJugador = sala.jugadores.findIndex(jugador => jugador.id_jugador == socket.id);

      if (indexJugador !== -1) {
        sala.jugadores.splice(indexJugador, 1);

        if (sala.jugadores.length === 0) {
          salas.splice(i, 1);
        }

        io.to(sala.owner).emit("join", sala);
        for (let i = 0; i < sala.jugadores.length; i++) {
          io.to(sala.jugadores[i].id_jugador).emit("join", sala);
        }
        return;
      }
    }
  }

  function joinSala(userInfo, id) {
    if (salas.some(sala => sala.codi == userInfo.codi)) {
      const salaEncontrada = salas.find(sala => sala.codi == userInfo.codi);
      salaEncontrada.jugadores.push({
        id_jugador: id,
        nombre: userInfo.username,
        winner: false,
      });
      io.to(salaEncontrada.owner).emit("join", salaEncontrada);
      for (let i = 0; i < salaEncontrada.jugadores.length; i++) {
        io.to(salaEncontrada.jugadores[i].id_jugador).emit("join", salaEncontrada);
      }
    } else {
      io.to(id).emit("join", false);
    }
  }

  function crearSala(idClasse, socketId) {
    let sala = {
      owner: socketId,
      id_sala: salas.length + 1,
      id_classe: idClasse,
      jugadores: [],
      status: "waiting",
      codi: generateCodi(),
    }

    salas.push(sala);
    io.to(socketId).emit("join", sala);
  }

  function generateCodi() {
    let codigo;
    do {
      codigo = Math.floor(100000 + Math.random() * 900000).toString();
    } while (salas.some(sala => sala.codi == codigo));

    return codigo;
  }

  function solveOperation(idPartida, idJugador, result) {
    let correcto = false;
    const partida = partidas.find((p) => p.idPartida == idPartida);
    try {
      realResult = parseFloat(eval(partida.jugadores[idJugador].operacion).toFixed(2)); //Preguntar a la Aina
    } catch (e) {
      console.log(e);
    }
    console.log(realResult);
    if (realResult == result) {
      correcto = true;
      disminuirVida(idPartida, idJugador, partida.jugadores[idJugador].dificultad);
    }

    io.to(partida.jugadores[idJugador].idSocket).emit("evaluacionResultado", {
      result: correcto,
    });
  }

  function getOperation(idPartida, idJugador, dificultad) {

    const partida = partidas.find((p) => p.idPartida == idPartida);

    partida.jugadores[idJugador].dificultad = dificultad;

    operator = generarOperatorRandom(dificultad);
    numeros = generarNumeros(operator);

    let operacionGuardar = `${numeros[0]}${operator}${numeros[1]}`;

    if (operator == "^") {
      operator = "**";
    }

    let operacionEval = `${numeros[0]}${operator}${numeros[1]}`;

    if (operator == "√") {
      operacionGuardar = `${operator}${numeros[1]}`;
      operator = "Math.sqrt(";
      numeros[1] += ")";
      operacionEval = `${operator}${numeros[1]}`;
    }

    partida.jugadores[idJugador].operacion = operacionEval;

    io.to(partida.jugadores[idJugador].idSocket).emit("actualizarOperacion", {
      operacion: operacionGuardar,
      jugador: idJugador == 1 ? 1 : 0,
    });
  }

  function generarNumeros(operator) {
    let num1 = 0;
    let num2 = 0;

    if (operator == "-" || operator == "+") {
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
    } else if (operator == "*" || operator == "/") {
      num1 = Math.floor(Math.random() * 19) + 5;
      num2 = Math.floor(Math.random() * (num1 / 2)) + 3;
    } else if (operator == "^") {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 3) + 2;
    } else if (operator == "√") {
      num1 = Math.floor(Math.random() * 9) + 8;
      num2 = num1 * num1;
    }

    return [num1, num2];
  }

  function generarOperatorRandom(dificultad) {
    const operators = ["+", "-", "*", "/", "^", "√"];

    if (dificultad == 1) {
      return operators[Math.floor(Math.random() * 2)];
    } else if (dificultad == 2) {
      return operators[Math.floor(Math.random() * 2) + 2];
    } else if (dificultad == 3) {
      return operators[Math.floor(Math.random() * 2) + 4];
    }

  }

  // Función para disminuir la vida de un jugador en una partida
  function disminuirVida(idPartida, idJugador) {

    const partida = partidas.find((p) => p.idPartida == idPartida);

    switch (partida.jugadores[idJugador].dificultad) {
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

    if (partida) {
      const vidaActual =
        idJugador == 1 ? partida.jugadores[1].vida : partida.jugadores[0].vida;
      const nuevaVida = Math.max(0, vidaActual - cantidad);

      partida.jugadores[idJugador].vida = nuevaVida;

      for (let i = 0; i < partida.jugadores.length; i++) {
        io.to(partida.jugadores[i].idSocket).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: idJugador == 1 ? 0 : 1,
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
        idSala: user.id_sala,
        jugadores: [jugador],
      });
    } else {
      if (partidas.every((partida) => partida.jugadores.length == 2)) {
        partidas.push({
          idPartida: partidas.length + 1,
          idSala: user.id_sala,
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

    const sala = salas.find(sala => sala.id_sala == user.id_sala);
    io.to(sala.owner).emit("getPartidas", partidas.filter(partida => partida.idSala == user.id_sala));
  }
}

module.exports = { sockets };
