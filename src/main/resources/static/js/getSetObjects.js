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
                name: roleName(r.name),
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

export const roleName = role => {
    return role.substr(role.indexOf("_") + 1).toUpperCase();
}

export const getCurrentUser = async () => {
    let user = null;
    await fetch(baseUrl + "/login", {
        method: 'POST',
        headers: {
            "Authorization": "Basic YWRtaW46YWRtaW4="
        }
    })
        .then(response => response.json())
        .then(u => user = u)
        .catch(error => console.log('error', error));
    return user;
}
