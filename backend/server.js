//IMPORTAR MODULOS
const express = require("express");
const app = express();
const port = 3751;
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");
const { join } = require('path');
const server = http.createServer(app);

//REDIRECCIONAR AL INDEX.HTML
app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'index.html'));
  });

//PARTE DEL SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let partidas = [
  partida = {
    idPartida: 1,
    jugador1: {
      idSocket: 1,
      vida: 100,
      operacion: "1+3"
    },
    jugador2: {
      idSocket: 2,
      vida: 100,
      operacion: "1+3"
    },
  },
];

// Función para disminuir la vida de un jugador en una partida
function disminuirVida(idPartida, idJugador, cantidad) {
  const partida = partidas.find((p) => p.idPartida == idPartida);

  if (partida) {
    const vidaActual = idJugador == 1 ? partida.vida1 : partida.vida2;
    const nuevaVida = Math.max(0, vidaActual - cantidad);

    if (idJugador == 1) {
      partida.vida1 = nuevaVida;
      io.to(partida.socket1).emit("actualizarVida", { vida: nuevaVida, jugador: 1 });
      io.to(partida.socket2).emit("actualizarVida", { vida: nuevaVida, jugador: 2 });
    } else {
      partida.vida2 = nuevaVida;
      io.to(partida.socket1).emit("actualizarVida", { vida: nuevaVida, jugador: 1 });
      io.to(partida.socket2).emit("actualizarVida", { vida: nuevaVida, jugador: 2 });
    }
  }
}

io.on("connection", (socket) => {
  socket.on("disminuirVida", ({ idPartida, idJugador, cantidad }) => {
    disminuirVida(idPartida, idJugador, cantidad);
  });
});

  //PARTE DE LA BASE DE DATOS
var conn = mysql.createPool({
  host: "dam.inspedralbes.cat",
  user: "a22oscmungar_proyecto2",
  password: "Proyecto2",
  database: "a22oscmungar_proyecto2",
  connectionLimit: 100,
  queueLimit: 5,
  waitForConnections: true,
});

conn.getConnection((err, connection) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json());



//PARTE DE LAS RUTAS

//ruta para obtener todos los usuarios de una clase
app.get("/classe/:idClasse", (req, res) => {
  const sql = "SELECT * FROM USUARIS WHERE idClasse = ?";
  const VALUES = [req.params.idClasse];

  conn.query(sql, VALUES, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.json(result);
    }
  });
});

//ruta para obtener un usuario en concreto
app.get("/usuario/:idUsuari", (req, res) => {
  const sql = "SELECT * FROM USUARIS WHERE idUsu = ?";
  const VALUES = [req.params.idUsuari];

  conn.query(sql, VALUES, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.json(result);
    }
  });
});

//ruta para generar una operacion de nivel facil
app.get("/operacioFacil", (req, res) => {
  const num1 = Math.floor(Math.random() * 100) + 1;
  const num2 = Math.floor(Math.random() * 100) + 1;

  const operators = ["+", "-"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  const operation = num1 + " "+ operator + " " + num2;

  res.send({operation:operation});
});

//ruta para generar una operacion de nivel medio
app.get("/operacioMitg", (req, res) => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * (num1 / 2)) + 1;

  const operators = ["+", "-", "*", "/"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  const operation = num1 + " "+ operator + " " + num2;

  res.send({operation:operation});
});
//ruta para generar una operacion de nivel dificil
app.get("/operacioDificil", (req, res) => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * (num1 / 2)) + 1;

  const operators = ["+", "-", "*", "/", "^", "√"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  if (operator == "^") {
    num2 = 2;
  } else if (operator == "√") {
    num2 = null;
  }
  const operation = num1 + " "+ operator + " " + num2;

  res.send({operation:operation});
});

//ruta para resolver una operacion, le pasaremos los dos numeros y el operador
app.get("/resoldre/:num1/:num2/:operator", (req, res) => {
  const num1 = req.params.num1;
  const num2 = req.params.num2;
  const operator = req.params.operator;

  let result = 0;
  switch (operator) {
    case "+":
      result = parseInt(num1) + parseInt(num2);
      break;
    case "-":
      result = parseInt(num1) - parseInt(num2);
      break;
    case "*":
      result = parseInt(num1) * parseInt(num2);
      break;
    case "/":
      result = parseInt(num1) / parseInt(num2);
      break;
    case "^":
      result = Math.pow(parseInt(num1), parseInt(num2));
      break;
    default: //para la raiz cuadrada le pasaremos solo el primer numero y null como segundo y como operador lo mismo
      result = Math.sqrt(parseInt(num1));
      break;
  }
  res.send(JSON.stringify(result, null, 2));
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
