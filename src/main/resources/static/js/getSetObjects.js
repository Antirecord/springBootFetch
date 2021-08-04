import {baseUrl} from "./constants.js";

export const getAllRoles = async () => {
    let allRoles = [];
    await fetch(baseUrl + "/admin/getAllRoles", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(response => response.json())
        .then(role => role.map((r, iter) => allRoles[iter] =
            {
                id: r.id,
                name: r.name.substr(r.name.indexOf("_") + 1),
                checked: false,
            }
        ));
    return allRoles;
}

export const getUser = async userId => {
    let user = null;
    await fetch(baseUrl + "/admin/getUser/" + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(response => response.json()).then(u => user = u);
    return user;
}

export const getAllUsers = async () => {
    let allUsers = [];
    await fetch(baseUrl + "/admin/getAllUsers", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(response => response.json())
        .then(user => user.map((u, iter) => allUsers[iter] = u));
    return allUsers;
}

export const setToken = (token) => {
    sessionStorage.setItem('tokenData', JSON.stringify(token));
}

export const getToken = () => {
    return sessionStorage.getItem('tokenData');
}