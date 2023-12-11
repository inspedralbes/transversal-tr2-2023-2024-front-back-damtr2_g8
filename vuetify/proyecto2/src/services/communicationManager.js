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