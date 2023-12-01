//IMPORTAR MODULOS
const express = require("express");
const app = express();
const port = 3751;
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const http = require("http");
const { join, parse } = require("path");
const server = http.createServer(app);
var CryptoJS = require("crypto-js");
const { sockets } = require("./sockets.js");
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

sockets(io);
//REDIRECCIONAR AL INDEX.HTML
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
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

app.get("/clases", (req, res) => {
  const sql = "SELECT idClasse FROM CLASSE"
  conn.query(sql, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.json(result);
    }
  });
})

//ruta para hacer login
app.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(500).send("Both email and password are required");
  } else {
    var sql = `SELECT * FROM USUARIS WHERE correu = '${req.body.email}'`;

    conn.query(sql, (err, result) => {
      if (err) console.error(err);
      var ciphertext = CryptoJS.MD5(req.body.password).toString();
      if (result == 0 || result[0].pass != ciphertext) {
        res.status(500).send("Wrong email or password");
      } else {
        //req.session.user = result[0].CorreoElectronico;
        // res.cookie("user", req.session.user, { signed: true });
        //res.send({ cookie: req.session, userData: result[0] });
        res.send({ userData: result[0] });
      }
    });
  }
});

//ruta para registrar un usuario
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.nom || !req.body.admin || !req.body.idClasse) {
    res.status(500).send("Both email and password are required");
  } else {
    var sql = `INSERT INTO USUARIS VALUES (null, '${
      req.body.nom
    }', '${CryptoJS.MD5(req.body.password).toString()}', '${
      req.body.email
    }', '${req.body.admin}', '${req.body.idClasse}')`;
    conn.query(sql, (err, result) => {
      if (err) console.error(err);
      res.send({ userData: result });
    });
  }
});

//ruta para generar una operacion de nivel facil
app.get("/operacioFacil/:idPartida/:idJugador", (req, res) => {
  const idPartida = req.params.idPartida;
  const idJugador = req.params.idJugador;

  const num1 = Math.floor(Math.random() * 100) + 1;
  const num2 = Math.floor(Math.random() * 100) + 1;

  const operators = ["+", "-"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  const operation = num1 + " " + operator + " " + num2;
  const operacionGuardar = `${num1} ${operator} ${num2}`;
  const partidaIndex = partidas.findIndex((p) => p.idPartida == idPartida);
  const jugadorKey = `jugador${idJugador}`;
  let partida = partidas.find((p) => p.idPartida == idPartida);
  if (idJugador == 1) {
    partida.jugador1.operacion = operacionGuardar;
    console.log(partida.jugador1.operacion);
  } else {
    partida.jugador2.operacion = operacionGuardar;
    console.log(partida.jugador2.operacion);
  }

  res.send({ operation: operation });
});

//ruta para generar una operacion de nivel medio
app.get("/operacioMitg/:idPartida/:idJugador", (req, res) => {
  const idPartida = req.params.idPartida;
  const idJugador = req.params.idJugador;

  const num1 = Math.floor(Math.random() * 50) + 1;
  let num2 = Math.floor(Math.random() * (num1 / 2)) + 1;

  const operators = ["+", "-", "*", "/"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  const operation = num1 + " " + operator + " " + num2;
  const operacionGuardar = `${num1} ${operator} ${num2}`;
  const partidaIndex = partidas.findIndex((p) => p.idPartida == idPartida);
  const jugadorKey = `jugador${idJugador}`;
  let partida = partidas.find((p) => p.idPartida == idPartida);
  if (idJugador == 1) {
    partida.jugador1.operacion = operacionGuardar;
    console.log(partida.jugador1.operacion);
  } else {
    partida.jugador2.operacion = operacionGuardar;
    console.log(partida.jugador2.operacion);
  }

  res.send({ operation: operation });
});
//ruta para generar una operacion de nivel dificil
app.get("/operacioDificil/:idPartida/:idJugador", (req, res) => {
  const idPartida = req.params.idPartida;
  const idJugador = req.params.idJugador;

  const num1 = Math.floor(Math.random() * 50) + 1;
  let num2 = Math.floor(Math.random() * (num1 / 2)) + 1;

  const operators = ["+", "-", "*", "/", "^", "√"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  const operacion = "";

  if (operator == "^") {
    num2 = 2;
    operation = num1 + " " + operator + " " + num2;
  } else if (operator == "√") {
    num2 = "";
    operation = operator + "" + num1;
  }

  const operacionGuardar = operation;
  const partidaIndex = partidas.findIndex((p) => p.idPartida == idPartida);
  const jugadorKey = `jugador${idJugador}`;
  let partida = partidas.find((p) => p.idPartida == idPartida);
  if (idJugador == 1) {
    partida.jugador1.operacion = operacionGuardar;
    console.log(partida.jugador1.operacion);
  } else {
    partida.jugador2.operacion = operacionGuardar;
    console.log(partida.jugador2.operacion);
  }

  res.send({ operation: operation });
});

//ruta para resolver una operacion, le pasaremos la id de la partida, la del jugador que está resolviendo y el resultado que ha propuesto
app.get("/resoldre/:idPartida/:idJugador/:resultado", (req, res) => {
  const idPartida = req.params.idPartida;
  const idJugador = req.params.idJugador;
  const resultado = req.params.resultado;

  let partida = partidas.find((p) => p.idPartida == idPartida);
  let operacion =
    idJugador == 1 ? partida.jugador1.operacion : partida.jugador2.operacion;

  const regex = /(\d+)?([+\-*/^√]?)(\d+)?/;
  const matches = operacion.match(regex);

  const num1 = matches[1] ? parseInt(matches[1]) : null;
  const operator = matches[2];
  const num2 = matches[3] ? parseInt(matches[3]) : null;

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
      result = parseInt(num1) / num2;
      break;
    case "^":
      result = Math.pow(parseInt(num1), parseInt(num2));
      break;
    default:
      // Para la raíz cuadrada, se pasa solo el primer número
      result = Math.sqrt(parseInt(num2));
      result = Math.round(result);
      break;
  }

  console.log(result, " ", num1, " ", num2, " ", operator);
  if (result == resultado) {
    res.send({ resultado: true });
  } else {
    res.send({ resultado: false });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
