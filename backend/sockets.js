const { MongoClient, ServerApiVersion } = require("mongodb");

//PARTE DE LA BASE DE DATOS MongoDB
const client = new MongoClient(
  "mongodb+srv://a21marsalval_bd:ToniNoRobes2021@tr2.eatpoha.mongodb.net/?retryWrites=true&w=majority",
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

let salas = [];
let partidas = [];
let countSala = 0;
let countPartida = 1;

function sendPartidas(owner, id, io) {
  const partidasSala = partidas.filter((partida) => partida.idSala == id);

  if (partidasSala) {
    io.to(owner).emit("getPartidas", partidasSala);
    let sala = salas.filter((sala) => sala.id_sala == id);
    if (sala[0]) {
      for (let i = 0; i < sala[0].jugadores.length; i++) {
        io.to(sala[0].jugadores[i].id_jugador).emit("getPartidas", partidasSala);
      }
    }
  }
}

function crearPartida(user, jugador) {
  let partida = {
    idPartida: countPartida,
    idSala: user.id_sala,
    jugadores: [jugador],
    status: "active",
  };

  partidas.push(partida);
  countPartida++;
}

function sockets(io) {
  io.on("connection", (socket) => {
    socket.on("conectarUsuario", (user) => {
      gestionarPartida(socket, user, io);
    });

    socket.on("changeDificulty", ({ idPartida, idJugador, dificultad }) => {
      changeDificulty(idPartida, idJugador, dificultad);
    });

    socket.on("solveOperation", ({ idPartida, idJugador, idUsuari, idClasse, result }) => {
      solveOperation(idPartida, idJugador, idUsuari, idClasse, result, socket.id);
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

    socket.on("startGame", (startGameInfo) => {
      const sala = salas.find(
        (sala) => sala.owner == socket.id && sala.id_classe == startGameInfo.idClasse
      );

      let totalPlayers = sala.jugadores.length;
      if (sala.jugadores.length % 2 != 0 && startGameInfo.playProf == false) {
        totalPlayers = totalPlayers - 1;
      }

      for (let i = 0; i < totalPlayers; i++) {
        io.to(sala.jugadores[i].id_jugador).emit("startGame", { idSala: sala.id_sala, play: true });
      }

      if (sala.jugadores.length % 2 != 0 && startGameInfo.playProf == true) {
        io.to(sala.owner).emit("startGame", { idSala: sala.id_sala, play: true });
      } else {
        io.to(sala.owner).emit("startGame", { idSala: sala.id_sala, play: false });
      }
    });

    socket.on("leaveSala", () => {
      desconectarJugador(socket.id);
    });

    socket.on("leaveAllSala", () => {
      desconectarTodosJugadores(socket.id);
    });

    socket.on("disconnect", () => {
      desconectarJugador(socket.id);
    });

  });

  function desconectarTodosJugadores(id) {
    let sala = salas.find((sala) => sala.owner == id);
    if (sala) {
      for (let i = 0; i < sala.jugadores.length; i++) {
        io.to(sala.jugadores[i].id_jugador).emit("join", null);
        desconectarPartida(sala.jugadores[i].id_jugador, id, sala.id_sala);
      }
      io.to(sala.owner).emit("join", null);
      sala.owner = null;
      sala.jugadores = [];
    }
  }

  function desconectarJugador(socket) {
    for (let i = 0; i < salas.length; i++) {
      let sala = salas[i];
      const indexJugador = sala.jugadores.findIndex(
        (jugador) => jugador.id_jugador == socket
      );

      if (sala.owner == socket) {
        desconectarTodosJugadores(socket);
      }

      if (indexJugador !== -1) {
        desconectarPartida(
          sala.jugadores[indexJugador].id_jugador,
          sala.owner,
          sala.id_sala
        );
        sala.jugadores.splice(indexJugador, 1);

        io.to(sala.owner).emit("join", sala);
        for (let i = 0; i < sala.jugadores.length; i++) {
          desconectarPartida(
            sala.jugadores[i].id_jugador,
            sala.owner,
            sala.id_sala
          );
          io.to(sala.jugadores[i].id_jugador).emit("join", sala);
        }
        return;
      }
    }
  }

  function desconectarPartida(id, owner, id_sala) {
    for (let i = 0; i < partidas.length; i++) {
      let partida = partidas[i];
      const indexPartida = partida.jugadores.findIndex(
        (jugador) => jugador.id_jugador == id
      );

      partidas.splice(indexPartida, 1);

      if (owner != null) {
        sendPartidas(owner, id_sala, io);
      }
    }
  }

  function changeAvatar(idSala, idJugador, avatar) {
    if (salas.some((sala) => sala.id_sala == idSala)) {
      const salaEncontrada = salas.find((sala) => sala.id_sala == idSala);
      const jugador = salaEncontrada.jugadores.find(
        (jugador) => jugador.id_jugador == idJugador
      );
      jugador != undefined ? (jugador.id_avatar = avatar) : null;

      io.to(salaEncontrada.owner).emit("join", salaEncontrada);
      for (let i = 0; i < salaEncontrada.jugadores.length; i++) {
        io.to(salaEncontrada.jugadores[i].id_jugador).emit(
          "join",
          salaEncontrada
        );
      }
    } else {
      io.to(id).emit("join", false);
    }
  }

  function joinSala(userInfo, id) {
    if (salas.some((sala) => sala.codi == userInfo.codi)) {
      const salaEncontrada = salas.find((sala) => sala.codi == userInfo.codi);
      if (salaEncontrada.owner != null) {
        salaEncontrada.jugadores.push({
          id_jugador: id,
          nombre: userInfo.username,
          id_avatar: userInfo.idAvatar,
        });

        io.to(salaEncontrada.owner).emit("join", salaEncontrada);
        for (let i = 0; i < salaEncontrada.jugadores.length; i++) {
          io.to(salaEncontrada.jugadores[i].id_jugador).emit(
            "join",
            salaEncontrada
          );
        }
        const partidasSala = partidas.filter((partida) => partida.idSala == salaEncontrada.id_sala);
        if (partidasSala) {
          io.to(id).emit("getPartidas", partidasSala);
        }
      } else {
        io.to(id).emit("join", false);
      }
    } else {
      io.to(id).emit("join", false);
    }
  }

  function crearSala(idClasse, socketId, idUser) {
    let existSala = salas.find(
      (sala) =>
        sala.owner_id == idUser &&
        sala.status != "finish" &&
        sala.id_classe == idClasse
    );

    if (!existSala) {
      let sala = {
        owner_id: idUser,
        owner: socketId,
        id_sala: countSala,
        id_classe: idClasse,
        jugadores: [],
        status: "waiting",
        codi: generateCodi(),
      };

      countSala++;
      salas.push(sala);
      io.to(socketId).emit("join", sala);
    }
  }

  function getSala(idSocket, idUser, idClasse) {
    let sala = salas.find(
      (sala) =>
        sala.owner_id == idUser &&
        sala.status != "finish" &&
        sala.id_classe == idClasse
    );

    if (sala) {
      let previusOwner = sala.owner;
      sala.owner = idSocket;
      io.to(sala.owner).emit("join", sala);
      io.to(previusOwner).emit("join", sala);

      sendPartidas(sala.owner, sala.id_sala, io);
    } else {
      io.to(idSocket).emit("join", false);
    }
  }

  function generateCodi() {
    let codigo;
    do {
      codigo = Math.floor(100000 + Math.random() * 900000).toString();
    } while (salas.some((sala) => sala.codi == codigo));

    return codigo;
  }

  function solveOperation(idPartida, idJugador, idUsuari, idClasse, result, idSocket) {
    let correcto = false;
    const partida = partidas.find((p) => p.idPartida == idPartida);
    let realResult = null;

    if (partida != undefined) {
      let dificultad = partida.jugadores[idJugador].dificultad;

      if (result != null) {
        try {
          realResult = parseFloat(
            eval(partida.jugadores[idJugador].operacion[dificultad]).toFixed(2)
          );
        } catch (e) { }
        console.log(realResult);
        if (realResult == result) {
          correcto = true;
          disminuirVida(idPartida, idJugador, dificultad);
          getOperation(idPartida, idJugador, dificultad);
          saveGameData(idUsuari, idClasse, dificultad);
        }
      }

      io.to(partida.jugadores[idJugador].idSocket).emit("evaluacionResultado", {
        result: correcto,
      });
    } else {
      io.to(idSocket).emit("finishGame", {});
    }
  }

  function changeDificulty(idPartida, idJugador, dificultad) {
    const partida = partidas.find((p) => p.idPartida == idPartida);
    if (partida) {
      partida.jugadores[idJugador].dificultad = dificultad;
    }
  }

  function getOperation(idPartida, idJugador, dificultad) {
    const partida = partidas.find((p) => p.idPartida == idPartida);
    let numeros = [];
    let operacionesGuardar = [];
    let operacionEval = [];
    let operators = generarOperatorRandom();

    partida.jugadores[idJugador].dificultad = dificultad;

    for (let i = 0; i < operators.length; i++) {
      numeros.push({ numero: generarNumeros(operators[i]) });
    }

    for (let i = 0; i < operators.length; i++) {
      operacionesGuardar.push(
        `${numeros[i].numero[0]}${operators[i]}${numeros[i].numero[1]}`
      );
    }

    operators = operators.map((o) => (o == "^" ? "**" : o));

    for (let i = 0; i < operators.length; i++) {
      operacionEval.push(
        `${numeros[i].numero[0]}${operators[i]}${numeros[i].numero[1]}`
      );
    }

    if (operators.some((o) => o.includes("√"))) {
      let numberIndex = operacionesGuardar.findIndex((o) => o.includes("√"));
      operacionesGuardar = operacionesGuardar.map((o) =>
        o.includes("√") ? (o = "√" + numeros[numberIndex].numero[1]) : o
      );

      operators[numberIndex] = "Math.sqrt(";
      numeros[numberIndex].numero[1] += ")";
      operacionEval[
        numberIndex
      ] = `${operators[numberIndex]}${numeros[numberIndex].numero[1]}`;
    }

    partida.jugadores[idJugador].operacion = operacionEval;

    io.to(partida.jugadores[idJugador].idSocket).emit("actualizarOperacion", {
      operacion: operacionesGuardar,
      jugador: idJugador == 1 ? 1 : 0,
    });
  }

  function saveGameData(idUsu, idClasse, dificultat) {
    return new Promise(async (resolve, reject) => {
      await client.connect();
      let dbo = client.db("mathbattle");
      dificultat == 0 ? (dificultat = "fàcil") : null;
      dificultat == 1 ? (dificultat = "mitjà") : null;
      dificultat == 2 ? (dificultat = "difícil") : null;
      let myobj = {
        id_usuari: idUsu,
        id_classe: idClasse,
        difficulty: dificultat,
      };

      dbo.collection("correctAnswers").insertOne(myobj, function (err, res) {
        if (err) throw reject({ err: err });
        db.close();
      });
      resolve({ userData: "ok" });
    });
  }

  function generarOperatorRandom() {
    const operators = ["+", "-", "*", "/", "^", "√"];

    return [
      operators[Math.floor(Math.random() * 2)],
      operators[Math.floor(Math.random() * 2) + 2],
      operators[Math.floor(Math.random() * 2) + 4],
    ];
  }

  function generarNumeros(operator) {
    let num1 = 0;
    let num2 = 0;

    if (operator == "-" || operator == "+") {
      do {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 20) + 10;
      } while (num1 <= num2);
    } else if (operator == "*") {
      num1 = Math.floor(Math.random() * 5) + 5;
      num2 = Math.floor(Math.random() * (num1 / 2)) + 3;
    } else if (operator == "/") {
      do {
        num1 = Math.floor(Math.random() * 19) + 5;
        num2 = Math.floor(Math.random() * (num1 / 2)) + 3;
      } while (num1 % num2 != 0);
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
      case 0:
        cantidad = 10;
        break;
      case 1:
        cantidad = 15;
        break;
      case 2:
        cantidad = 20;
        break;
    }

    if (partida) {
      const vidaActual = idJugador == 1 ? partida.jugadores[0].vida : partida.jugadores[1].vida;
      const nuevaVida = Math.max(0, vidaActual - cantidad);
      let sala = salas.find((sala) => sala.id_sala == partida.idSala);

      partida.jugadores[idJugador == 1 ? 0 : 1].vida = nuevaVida;
      if (sala) {
        sendPartidas(sala.owner, sala.id_sala, io);
        for (let i = 0; i < partida.jugadores.length; i++) {
          io.to(partida.jugadores[i].idSocket).emit("actualizarVida", {
            vida: nuevaVida,
            jugador: idJugador == 1 ? 0 : 1,
          });
        }

        if (nuevaVida == 0) {
          partida.status = "finish";
          sendPartidas(sala.owner, sala.id_sala, io);
          for (let i = 0; i < partida.jugadores.length; i++) {
            io.to(partida.jugadores[i].idSocket).emit("enviaJson", partida);
          }
        }
      }
    }
  }

  function gestionarPartida(socket, user, io) {
    let idPartida = joinPartida(user, socket);

    let idPartidaIndex = partidas.findIndex(
      (partida) => partida.idPartida == idPartida
    );

    if (partidas[idPartidaIndex].jugadores.length == 2) {
      for (let i = 0; i < partidas[idPartidaIndex].jugadores.length; i++) {
        io.to(partidas[idPartidaIndex].jugadores[i].idSocket).emit(
          "enviaJson",
          partidas[idPartidaIndex]
        );
      }
    }

    const sala = salas.find((sala) => sala.id_sala == user.id_sala);
    if (sala != undefined) {
      if (partidas[idPartidaIndex].jugadores.length == 2) {
        sendPartidas(sala.owner, user.id_sala, io);
      }
    } else {
      console.log("owner undefined");
    }
  }

  function joinPartida(user, socket) {
    let partidaId = countPartida;

    let jugador = {
      idSocket: socket.id,
      username: user.username,
      vida: 100,
      operacion: "",
      resultadoJugador: null,
      dificultad: 1,
      avatar: user.avatar,
    };

    if (partidas.length == 0) {
      crearPartida(user, jugador);
    } else {
      if (partidas.every((partida) => partida.jugadores.length == 2)) {
        crearPartida(user, jugador);
      } else {
        let terminado = false;

        for (let i = 0; i < partidas.length; i++) {
          if (partidas[i].jugadores.length < 2) {
            if (partidas[i].idSala == user.id_sala) {
              partidas[i].jugadores.push(jugador);
              partidaId = partidas[i].idPartida;
              i = partidas.length;
              terminado = true;
            }
          }
        }

        if (terminado == false) {
          crearPartida(user, jugador);
        }
      }
    }

    let partidaIndex = partidas.findIndex(
      (partida) => partida.idPartida == partidaId
    );
    let idJugador = partidas[partidaIndex].jugadores.findIndex(
      (jugador) => jugador.idSocket == socket.id
    );

    getOperation(partidaId, idJugador, 1);

    return partidaId;
  }
}

module.exports = { sockets };
