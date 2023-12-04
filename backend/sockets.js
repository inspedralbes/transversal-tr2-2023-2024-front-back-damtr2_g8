function sockets(io, partidas) {
  io.on("connection", (socket) => {
    socket.on("restarVida", ({ idPartida, idJugador, idCantidad }) => {
      disminuirVida(idPartida, idJugador, idCantidad);
    });

    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user);
    });

    socket.on("getOperation", ({ idPartida, idJugador, dificultad }) => {
      getOperation(idPartida, idJugador, dificultad);
    });

    socket.on("solveOperation", ({ idPartida, idJugador, result }) => {
      solveOperation(idPartida, idJugador, result);
    });
  });

  function solveOperation(idPartida, idJugador, result) {
    let correcto = false;
    const partida = partidas.find((p) => p.idPartida == idPartida);
    try {
      realResult = parseFloat(eval(partida.jugadores[idJugador].operacion).toFixed(2)); //Preguntar a la Aina
    }catch(e) {
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

    if(operator == "^") {
      operator = "**";
    }

    let operacionEval = `${numeros[0]}${operator}${numeros[1]}`;

    if(operator == "√") {
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
    }else if (operator == "*" || operator == "/") {
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
      return operators[Math.floor(Math.random() * 2)  + 2];
    }else if (dificultad == 3) {
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
