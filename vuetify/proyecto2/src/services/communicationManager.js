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

export function getClassesFetch(idProfe) {
    return new Promise((resolve, reject) => {
        fetch(import.meta.env.VITE_NODE_ROUTE + `/classeProfe/${idProfe}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => resolve(response))
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

export function editClasse(classeEditar) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3751/editarClasse/`, {
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