let salas = [];
let partidas = [];

function sockets(io) {
  io.on("connection", (socket) => {
    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user, io);
    });

    socket.on("getOperation", ({ idPartida, idJugador, dificultad }) => {
      getOperation(idPartida, idJugador, dificultad);
    });

    socket.on("solveOperation", ({ idPartida, idJugador, result }) => {
      solveOperation(idPartida, idJugador, result);
    });

    socket.on("createSala", (idClasse, idUser) => {
      crearSala(idClasse, socket.id, idUser);
    });

    socket.on("getSala", (idUser, idClasse) => {
      getSala(socket.id, idUser, idClasse);
    });

    socket.on("changeAvatar", (idSocket, avatar) => {
      changeAvatar(idSocket, socket.id, avatar);
    });

    socket.on("joinSala", (userInfo) => {
      joinSala(userInfo, socket.id);
    });

    socket.on("startGame", (idClasse) => {
      const sala = salas.find(sala => sala.owner == socket.id && sala.id_classe == idClasse);
      for (let i = 0; i < sala.jugadores.length; i++) {
        io.to(sala.jugadores[i].id_jugador).emit("startGame", sala.id_sala);
      }
      io.to(sala.owner).emit("startGame", sala.id_sala);
      io.to(sala.owner).emit("getPartidas", partidas.filter(partida => partida.id_sala == sala.id_sala));
    });

    socket.on("leaveSala", () => {
      desconectarJugador(socket.id);
    });

    socket.on("leaveAllSala", () => {
      desconectarTodosJugadores();
    })

    socket.on("disconnect", () => {
      // borrarSala(socket.id);
      desconectarJugador(socket.id)
    });
  });

  function borrarSala(id) {
    // let borrarSala = salas.find(sala => sala.owner == id);
    // if (borrarSala) {
    //   for (let i = 0; i < borrarSala.jugadores.length; i++) {
    //     io.to(borrarSala.jugadores[i].id_jugador).emit("join", false);
    //   }
    // }
    // borrarSala.status = "finish";
    // console.log(salas);
  }

  function desconectarTodosJugadores() {
    let sala = salas.find(sala => sala.owner == id);

    for (let i = 0; i < sala.jugadores.length; i++) {
      desconectarJugador(sala.jugadores[i].id_jugador);
    }
  }

  function desconectarJugador(socket) {
    for (let i = 0; i < salas.length; i++) {
      const sala = salas[i];
      const indexJugador = sala.jugadores.findIndex(jugador => jugador.id_jugador == socket);

      if (indexJugador !== -1) {
        sala.jugadores.splice(indexJugador, 1);

        io.to(sala.owner).emit("join", sala);
        for (let i = 0; i < sala.jugadores.length; i++) {
          io.to(sala.jugadores[i].id_jugador).emit("join", sala);
        }
        return;
      }
    }
  }


  function changeAvatar(idSala, idJugador, avatar) {
    if (salas.some(sala => sala.id_sala == idSala)) {
      const salaEncontrada = salas.find(sala => sala.id_sala == idSala);
      const jugador = salaEncontrada.jugadores.find(jugador => jugador.id_jugador == idJugador);
      jugador != undefined ? jugador.id_avatar = avatar : null;

      io.to(salaEncontrada.owner).emit("join", salaEncontrada);
      for (let i = 0; i < salaEncontrada.jugadores.length; i++) {
        io.to(salaEncontrada.jugadores[i].id_jugador).emit("join", salaEncontrada);
      }
    } else {
      io.to(id).emit("join", false);
    }
  }

  function joinSala(userInfo, id) {
    if (salas.some(sala => sala.codi == userInfo.codi)) {
      const salaEncontrada = salas.find(sala => sala.codi == userInfo.codi);
      salaEncontrada.jugadores.push({
        id_jugador: id,
        nombre: userInfo.username,
        winner: false,
        id_avatar: userInfo.idAvatar,
      });

      io.to(salaEncontrada.owner).emit("join", salaEncontrada);
      for (let i = 0; i < salaEncontrada.jugadores.length; i++) {
        io.to(salaEncontrada.jugadores[i].id_jugador).emit("join", salaEncontrada);
      }
    } else {
      io.to(id).emit("join", false);
    }
  }

  function crearSala(idClasse, socketId, idUser) {
    let existSala = salas.find((sala) => sala.owner_id == idUser && sala.status != "finish" && sala.id_classe == idClasse);

    if (!existSala) {
      let sala = {
        owner_id: idUser,
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
  }

  function getSala(idSocket, idUser, idClasse) {
    let sala = salas.find((sala) => sala.owner_id == idUser && sala.status != "finish" && sala.id_classe == idClasse);

    if (sala) {
      let previusOwner = sala.owner;
      sala.owner = idSocket;
      io.to(sala.owner).emit("join", sala);
      io.to(previusOwner).emit("join", sala);

      const partidasSala = partidas.filter(partida => partida.idSala == sala.id_sala);
      if (partidasSala) {
        io.to(sala.owner).emit("getPartidas", partidasSala);
      }
    }
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
    let realResult = null;

    if (result != null) {
      try {
        realResult = parseFloat(eval(partida.jugadores[idJugador].operacion).toFixed(2)); //Preguntar a la Aina
      } catch (e) { }
      console.log(realResult);
      if (realResult == result) {
        correcto = true;
        disminuirVida(idPartida, idJugador, partida.jugadores[idJugador].dificultad);
        getOperation(idPartida, idJugador, partida.jugadores[idJugador].dificultad);
      }
    }

    io.to(partida.jugadores[idJugador].idSocket).emit("evaluacionResultado", {
      result: correcto,
    });
  }

  function getOperation(idPartida, idJugador, dificultad) {
    const partida = partidas.find((p) => p.idPartida == idPartida);
    let numeros = [];
    let operacionesGuardar = []

    partida.jugadores[idJugador].dificultad = dificultad;

    let operators = generarOperatorRandom();

    for (let i = 0; i < operators.length; i++) {
      numeros.push({numero: generarNumeros(operators[i])})
    }

    for (let i = 0; i < operators.length; i++) {
      operacionesGuardar.push(`${numeros[i].numero[0]}${operators[i]}${numeros[i].numero[1]}`);
    }

    if (operators == "^") {
      operators = "**";
    }

    let operacionEval = `${numeros[0]}${operators}${numeros[1]}`;

    if (operators == "√") {
      operacionesGuardar = `${operators}${numeros[1]}`;
      operators = "Math.sqrt(";
      numeros[1] += ")";
      operacionEval = `${operators}${numeros[1]}`;
    }

    console.log(operacionesGuardar);

    partida.jugadores[idJugador].operacion = operacionEval;

    io.to(partida.jugadores[idJugador].idSocket).emit("actualizarOperacion", {
      operacion: operacionesGuardar,
      jugador: idJugador == 1 ? 1 : 0,
    });
  }

  function generarOperatorRandom() {
    const operators = ["+", "-", "*", "/", "^", "√"];

    return [
      operators[Math.floor(Math.random() * 2)],
      operators[Math.floor(Math.random() * 2) + 2],
      operators[Math.floor(Math.random() * 2) + 4]
    ]
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

  // Función para disminuir la vida de un jugador en una partida
  function disminuirVida(idPartida, idJugador) {
    let partida = partidas.find((p) => p.idPartida == idPartida);

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
      let sala = salas.find((sala) => sala.id_sala == partida.idSala);

      partida.jugadores[idJugador].vida = nuevaVida;

      io.to(sala.owner).emit("getPartidas", partidas);
      for (let i = 0; i < partida.jugadores.length; i++) {
        io.to(partida.jugadores[i].idSocket).emit("actualizarVida", {
          vida: nuevaVida,
          jugador: idJugador == 1 ? 0 : 1,
        });
      }

      if (nuevaVida == 0) {
        partida.status = "finish";
        io.to(sala.owner).emit("getPartidas", partidas);
        for (let i = 0; i < partida.jugadores.length; i++) {
          io.to(partida.jugadores[i].idSocket).emit("enviaJson", partida);
        }
      }
    }
  }
}

function gestionarPartida(socket, user, io) {
  let idPartida = joinPartida(user, socket);

  let idPartidaIndex = partidas.findIndex((partida) => partida.idPartida == idPartida);

  if (partidas[idPartidaIndex].jugadores.length == 2) {
    for (let i = 0; i < partidas[idPartidaIndex].jugadores.length; i++) {
      io.to(partidas[idPartidaIndex].jugadores[i].idSocket).emit(
        "enviaJson",
        partidas[idPartidaIndex]
      );
    }
  }

  const sala = salas.find(sala => sala.id_sala == user.id_sala);
  if (sala != undefined) {
    io.to(sala.owner).emit("getPartidas", partidas.filter(partida => partida.idSala == user.id_sala));
  } else {
    console.log("owner undefined");
  }
}

function joinPartida(user, socket) {
  let partidaId = partidas.length + 1;
  let jugador = {
    idSocket: socket.id,
    username: user.username,
    vida: 100,
    operacion: "",
    resultadoJugador: null,
    dificultad: 1,
    avatar: user.avatar,
  };

  let partida = {
    idPartida: partidas.length + 1,
    idSala: user.id_sala,
    jugadores: [jugador],
    status: "active"
  };

  if (partidas.length == 0) {
    partidas.push(partida);
  } else {
    if (partidas.every((partida) => partida.jugadores.length == 2)) {
      partidas.push(partida);
    } else {
      let terminado = false;

      for (let i = 0; i < partidas.length; i++) {
        if (partidas[i].jugadores.length < 2) {
          if (partidas[i].idSala == user.id_sala) {
            partidas[i].jugadores.push(jugador);
            i = partidas.length;
            terminado = true;
            partidaId = i;
          }
        }
      }

      if (terminado == false) {
        partidas.push(partidas.push(partida));
      }
    }
  }

  return partidaId;
}

module.exports = { sockets };
