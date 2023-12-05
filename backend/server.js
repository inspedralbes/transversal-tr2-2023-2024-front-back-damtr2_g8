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
let CryptoJS = require("crypto-js");
const { sockets } = require("./sockets.js");
const { login, register } = require("./endpointFuncions.js");
const { Server } = require("socket.io");

let partidas = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

sockets(io, partidas);

//PARTE DE LA BASE DE DATOS
let conn = mysql.createPool({
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

//ruta para crear classes
app.post("/crearClasse", (req, res) => {
  const sql = "INSERT INTO CLASSE VALUES (null, ?)";
  const VALUES = [req.body.nomClasse];
  let idClasse = 0;

  conn.query(sql, VALUES, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      idClasse = result.insertId;
      const sql2 = "INSERT INTO PERTANY VALUES (?, ?)";
      const VALUES2 = [idClasse, req.body.idUsu];

      conn.query(sql2, VALUES2, (err, result2) => {
        if (err) {
          console.error(err);
        } else {
          res.send(result2);
        }
      });
    }
  });
});

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

//ruta para obtener las classes de un profesor
app.get("/classeProfe/:idProfe", (req, res) => {
  const sql =
    "SELECT CLASSE.idClasse, CLASSE.nomClasse, COUNT(PERTANY.idUsu) AS numeroUsuarios FROM CLASSE LEFT JOIN PERTANY ON CLASSE.idClasse = PERTANY.idClasse WHERE PERTANY.idUsu = ? GROUP BY CLASSE.idClasse, CLASSE.nomClasse;";
  const VALUES = [req.params.idProfe];
  const values = [req.params.idProfe];
  conn.query(sql, VALUES, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.json(result);
    }
  });
});

//

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
  const sql = "SELECT idClasse, nomClasse FROM CLASSE";
  conn.query(sql, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.json(result);
    }
  });
});

//ruta para hacer login
app.post("/login", async (req, res) => {
  res.send(login(req.body.email, req.body.password));
});

//ruta para registrar un usuario
app.post("/register", (req, res) => {
  console.log(req.body);
  res.send(
    register(req.body.email, req.body.password, req.body.nom, req.body.admin)
  );
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
