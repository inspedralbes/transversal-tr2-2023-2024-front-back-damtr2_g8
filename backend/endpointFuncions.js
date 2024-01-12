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
    const VALUES = { nomClasse: nomClasse, idPropietari: idProfe };

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function addDifficulty(nomDificultat, idProfe) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO DIFICULTAT SET ?";
    const VALUES = { nomDificultat: nomDificultat, idProfe: idProfe };

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function addOperation(num1Min, num1Max, operador, num2Min, num2Max, idDificultat, nivell) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO OPERACIO SET ?";
    const VALUES = { minNum1: num1Min, maxNum1: num1Max, operador: operador, minNum2: num2Min, maxNum2: num2Max, idDificultat: idDificultat, nivell: nivell };

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function editClass(nomClasse, idClasse) {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE CLASSE SET nomClasse = ? WHERE idClasse = ?";
    const VALUES = [nomClasse, idClasse];

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function deleteClass(idClasse) {
  console.log(idClasse);
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM CLASSE WHERE idClasse = ?";
    const VALUES = [idClasse];

    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function getClassByUserId(idPropietari) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM `CLASSE` WHERE idPropietari = ?";
    const VALUES = [idPropietari];
    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        const promises = [];
        for (let i = 0; i < result.length; i++) {
          promises.push(
            new Promise((resolve, reject) => {
              const sql2 =
                "SELECT CLASSE.idClasse, CLASSE.nomClasse, COUNT(PERTANY.idUsu) AS numeroUsuarios FROM CLASSE LEFT JOIN PERTANY ON CLASSE.idClasse = PERTANY.idClasse WHERE CLASSE.idPropietari = ? AND CLASSE.idClasse = ? GROUP BY CLASSE.idClasse, CLASSE.nomClasse;";
              const VALUES2 = [idPropietari, result[i].idClasse];
              conn.query(sql2, VALUES2, (err2, result2) => {
                if (err2) {
                  reject({ err: err2 });
                } else {
                  resolve(result2[0]);
                }
              });
            })
          );
        }
        Promise.all(promises)
          .then((results) => {
            resolve(results);
          })
          .catch((err) => reject({ err: err }));
      }
    });
  });
}

function getUserIdByClassId(idClass) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT idUsu FROM PERTANY WHERE idClasse = ?";
    const VALUES = [idClass];
    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function getClassNameByClassId(idClass) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT nomClasse FROM CLASSE WHERE idClasse = ?";
    const VALUES = [idClass];
    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

function joinClasse(idClass, idUsu) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO `PERTANY` (`idClasse`, `idUsu`) VALUES (?, ?);";
    const VALUES = [idClass, idUsu];
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

function register(email, password, nom, cognom) {
  return new Promise((resolve, reject) => {
    if (!email || !password || !nom || !cognom) {
      reject({ err: "All elements are required" });
    } else {
      const newUser = {
        nom: nom,
        pass: CryptoJS.MD5(password).toString(),
        correu: email,
        cognom: cognom,
      };
      let sql = `INSERT INTO USUARIS SET ?`;
      conn.query(sql, newUser, (err, result) => {
        if (err) reject({ err: err.sqlMessage });
        resolve({ userData: result });
      });
    }
  });
}

function changePassword(email, password) {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      reject({ err: "Both email and password are required" });
    } else {
      let sql = "UPDATE USUARIS SET pass = ? WHERE correu = ?";
      let VALUES = [CryptoJS.MD5(password).toString(), email];
      conn.query(sql, VALUES, (err, result) => {
        if (err) reject({ err: err });
        resolve({ userData: result });
      })
    }
  })
}

function getDificultats(idProfe) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT idDificultat, nomDificultat FROM DIFICULTAT WHERE idProfe = (?) or nomDificultat = 'Per defecte'";
    const VALUES = [idProfe];
    conn.query(sql, VALUES, (err, result) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  createClass,
  addDifficulty,
  addOperation,
  editClass,
  deleteClass,
  getClassByUserId,
  getUserIdByClassId,
  getClassNameByClassId,
  joinClasse,
  getUserById,
  login,
  register,
  changePassword,
  getDificultats
};
