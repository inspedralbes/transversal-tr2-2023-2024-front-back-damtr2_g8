export function register(emailRegistration) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: emailRegistration.name,
        cognom: emailRegistration.surname,
        email: emailRegistration.email,
        password: emailRegistration.password,
      }),
    }).then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
}

export function login(usernameLogin) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: usernameLogin.email,
        password: usernameLogin.password,
      }),
    }).then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
}

export function getClassesFetch(idPropietari) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/classeProfe/${idPropietari}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => resolve(response))
  });
}

export function joinClasse(idClasse, idUsuari) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/joinClasse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idClasse: idClasse,
          idUsu: idUsuari,
        }),
      }).then((response) => resolve(response));
  });
}

export function createClasse(nombreNuevaClase, idProfe) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/crearClasse/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomClasse: nombreNuevaClase,
        idUsu: idProfe,
      }),
    }).then((response) => resolve(response));
  });
}

export function addDificultat(nomDificultat, idProfe) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/addDificultat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomDificultat: nomDificultat,
        idProfe: idProfe,
      }),
    }).then((response) => response.json())
    .then((data) => {
      resolve(data.insertId);
    });
  });
}

export function addOperation(num1Min, num1Max, operador, num2Min, num2Max, idDificultat, nivell) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/addOperation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        num1Min: num1Min,
        num1Max: num1Max,
        operador: operador,
        num2Min: num2Min,
        num2Max: num2Max,
        idDificultat: idDificultat,
        nivell: nivell,
      }),
    }).then((response) => response.json())
    .then((data) => {
      resolve(data.insertId);
    });
  });
}

export function editClasse(classeEditar) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/editarClasse/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomClasse: classeEditar.nombreNuevaClasse,
        idClasse: classeEditar.idClasse,
      }),
    }).then((response) => resolve(response));
  });
}

export function deleteClasse(classeEditar) {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_NODE_ROUTE + `/eliminarClasse/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idClasse: classeEditar.idClasse,
      }),
    }).then((response) => resolve(response));
  });
}

export function getDificultatsFetch(idProfe){  
  return new Promise((resolve, reject) => {
    
    fetch(import.meta.env.VITE_NODE_ROUTE + `/getDificultats/?idProfe=${idProfe}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => resolve(response))
  });
}