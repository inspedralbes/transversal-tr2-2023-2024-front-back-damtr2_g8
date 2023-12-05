function register(email, password, nom, admin, idClasse) {
  if (!email || !password || !nom || !admin || !idClasse) {
    return { status: "Both email and password are required" };
  } else {
    let sql = `INSERT INTO USUARIS VALUES (null, '${nom}', '${CryptoJS.MD5(
      password
    ).toString()}', '${email}', '${admin}', '${idClasse}')`;
    conn.query(sql, (err, result) => {
      if (err) console.error(err);
      return { userData: result };
    });
  }
}

module.exports = { register };
