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
  await createClass(req.body.nomClasse, req.body.idUsu
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

//ruta para editar clases
app.post("/editarClasse", (req, res) => {
  console.log(req.body);
  const sql = "UPDATE CLASSE SET nomClasse = ? WHERE idClasse = ?";
  const VALUES = [req.body.nomClasse, req.body.idClasse];

  conn.query(sql, VALUES, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
});

//ruta para obtener todos los usuarios de una clase
app.get("/classe/:idClasse", async (req, res) => {
  await getUserByClassId(req.params.idProfe
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

//ruta para obtener las classes de un profesor
app.get("/classeProfe/:idProfe", async (req, res) => {
  await getClassByUserId(req.params.idProfe
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

//ruta para obtener un usuario en concreto
app.get("/usuario/:idUsuari", async (req, res) => {
  await getUserById(req.params.idUsuari
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

//ruta para hacer login
app.post("/login", async (req, res) => {
  await login(req.body.email, req.body.password
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });

});

//ruta para registrar un usuario
app.post("/register", async (req, res) => {
  await register(
    req.body.email,
    req.body.password,
    req.body.nom,
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
