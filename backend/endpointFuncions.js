const mysql = require("mysql2");
const CryptoJS = require("crypto-js");

let conn = mysql.createPool({
  host: "dam.inspedralbes.cat",
  user: "a22oscmungar_proyecto2",
  password: "Proyecto2",
  database: "a22oscmungar_proyecto2",
  connectionLimit: 100,
  queueLimit: 5,
  waitForConnections: true,
});

function createClass(nomClasse, idProfe) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO CLASSE SET ?";
    const VALUES = { nomClasse: nomClasse, idUsuari: idProfe };

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function getClassByUserId(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM `CLASSE` WHERE idUsuari = ?";
    const VALUES = [id];
    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USUARIS WHERE idUsu = ?";
    const VALUES = [id];

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function login(email, password) {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      reject({ err: "Both email and password are required" });
    } else {
      let sql = `SELECT * FROM USUARIS WHERE correu = '${email}'`;

      conn.query(sql, (err, result) => {
        if (err) console.error(err);
        let ciphertext = CryptoJS.MD5(password).toString();
        if (result == 0 || result[0].pass != ciphertext) {
          reject({ err: "Wrong email or password" });
        } else {
          //req.session.user = result[0].CorreoElectronico;
          // res.cookie("user", req.session.user, { signed: true });
          //res.send({ cookie: req.session, userData: result[0] });
          resolve({ userData: result[0] });
        }
      });
    }
  });
}

function register(email, password, nom) {
  return new Promise((resolve, reject) => {
    if (!email || !password || !nom) {
      reject({ err: "All elements are required" });
    } else {
      const newUser = {
        nom: nom,
        pass: CryptoJS.MD5(password).toString(),
        correu: email,
      };
      let sql = `INSERT INTO USUARIS SET ?`;
      conn.query(sql, newUser, (err, result) => {
        if (err) reject({ err: err.sqlMessage });
        resolve({ userData: result });
      });
    }
  });
}

module.exports = {
  createClass,
  getClassByUserId,
  getUserById,
  login,
  register,
};
