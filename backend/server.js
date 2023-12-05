//IMPORTAR MODULOS
const express = require("express");
const app = express();
const port = 3751;
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { sockets } = require("./sockets.js");
const {
  createClass,
  getClassByUserId,
  getUserById,
  login,
  register,
} = require("./endpointFuncions.js");
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
app.post("/crearClasse", async (req, res) => {
  res.send(await createClass(req.body.nomClasse, req.body.idUsu));
});

//ruta para obtener todos los usuarios de una clase
app.get("/classe/:idClasse", async (req, res) => {
  res.send(await getUserByClassId(req.params.idProfe));
});

//ruta para obtener las classes de un profesor
app.get("/classeProfe/:idProfe", async (req, res) => {
  res.send(await getClassByUserId(req.params.idProfe));
});

//ruta para obtener un usuario en concreto
app.get("/usuario/:idUsuari", async (req, res) => {
  res.send(await getUserById(req.params.idUsuari));
});

//ruta para hacer login
app.post("/login", async (req, res) => {
  res.send(await login(req.body.email, req.body.password));
});

//ruta para registrar un usuario
app.post("/register", async (req, res) => {
  res.send(
    await register(
      req.body.email,
      req.body.password,
      req.body.nom,
      req.body.admin
    )
  );
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
