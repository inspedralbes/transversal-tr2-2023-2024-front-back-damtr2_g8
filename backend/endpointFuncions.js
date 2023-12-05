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

function login(email, password) {
  if (!email || !password) {
    return { status: "Both email and password are required" };
  } else {
    let sql = `SELECT * FROM USUARIS WHERE correu = '${email}'`;

    conn.query(sql, (err, result) => {
      if (err) console.error(err);
      let ciphertext = CryptoJS.MD5(password).toString();
      if (result == 0 || result[0].pass != ciphertext) {
        return { status: "Wrong email or password" };
      } else {
        //req.session.user = result[0].CorreoElectronico;
        // res.cookie("user", req.session.user, { signed: true });
        //res.send({ cookie: req.session, userData: result[0] });
        return { userData: result[0] };
      }
    });
  }
}

function register(email, password, nom, admin) {
  console.log(email, password, nom, admin);
  if (!email || !password || !nom || !admin) {
    return { status: "Both email and password are required" };
  } else {
    const newUser = {
      nom: nom,
      pass: CryptoJS.MD5(password).toString(),
      correu: email,
      admin: admin,
    };
    let sql = `INSERT INTO USUARIS SET ?`;
    conn.query(sql, newUser, (err, result) => {
      if (err) console.error(err);
      return { userData: result };
    });
  }
}

module.exports = { login, register };