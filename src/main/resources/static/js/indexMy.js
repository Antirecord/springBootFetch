const baseUrl = "http://localhost:8080/api";
const ACTIONBUTTON = {
    EDIT: 1,
    DELETE: 2,
}

const getAllRoles = () => {
    let allRoles = [];
    fetch(baseUrl + "/getAllRoles", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(response => response.json())
        .then(role => role.map((r, iter) => allRoles[iter] =
            {
                id: r.id,
                name: r.roleName,
                checked: false,
            }
        ));
    return allRoles;
}

let allRoles = getAllRoles();

const getUser = (userId, isEnabled) => {
    fetch(baseUrl + "/getUser/" + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(response => response.json()).then(user => setFields(user, isEnabled));
}

const setFields = ({email, id, name, roles, surname, username}, isEnabled) => {
    const inName = document.getElementById("name");
    const inSurname = document.getElementById("surname");
    const inEmail = document.getElementById("email");
    const inUsername = document.getElementById("username");
    const inPassword = document.getElementById("password");
    const labelPassword = document.getElementById("labelPassword");
    const groupRole = document.getElementById("roleGroup");
    allRoles.forEach(role => {
        roles.forEach(userRole => role.checked = (role.id === userRole.id));
        let checkboxRole = document.getElementById("roleCheck" + role.id);
        if (checkboxRole) {
            checkboxRole.parentElement.removeChild(
                document.getElementById("roleCheckLabel" + role.id)
            );
            checkboxRole.parentElement.removeChild(checkboxRole);
        }
    });
    let listRoles = [];
    if (isEnabled) {
        inPassword.classList.remove("visually-hidden");
        labelPassword.classList.remove("visually-hidden");
        listRoles = allRoles;
    } else {
        inPassword.classList.add("visually-hidden");
        labelPassword.classList.add("visually-hidden");
        allRoles.forEach(roleAll => roles.forEach((roleUser, iter) => {
            if (roleAll.id === roleUser.id) {
                listRoles[iter] = roleAll;
                listRoles[iter].checked = false;
            }
        }));
    }
    listRoles.sort(r => r.checked ? -1 : 1).forEach(role => {
        let checkboxRole = document.getElementById("roleCheck" + role.id);
        let labelRole;
        if (!checkboxRole) {
            checkboxRole = document.createElement("input");
            checkboxRole.setAttribute("type", "checkbox");
            checkboxRole.classList.add("btn-check");
            checkboxRole.setAttribute("id", "roleCheck" + role.id);
            labelRole = document.createElement("label");
            labelRole.setAttribute("for", "roleCheck" + role.id);
            labelRole.setAttribute("id", "roleCheckLabel" + role.id);
        } else {
            labelRole = document.getElementById("roleCheckLabel" + role.id);
        }
        if (isEnabled) {
            labelRole.classList.add("btn-outline-primary");
            labelRole.classList.remove("btn-outline-secondary");
            labelRole.classList.remove("disabled");
        } else {
            labelRole.classList.add("btn-outline-secondary");
            labelRole.classList.add("disabled");
            labelRole.classList.remove("btn-outline-primary");
        }
        checkboxRole.disabled = !isEnabled;
        checkboxRole.checked = role.checked;
        labelRole.innerText = role.name;
        groupRole.append(checkboxRole, labelRole);
    });
    inName.setAttribute("value", name);
    inName.disabled = !isEnabled;
    inSurname.setAttribute("value", surname);
    inSurname.disabled = !isEnabled;
    inEmail.setAttribute("value", email);
    inEmail.disabled = !isEnabled;
    inUsername.setAttribute("value", username);
    inUsername.disabled = !isEnabled;
    inPassword.setAttribute("value", "_`@$secret$@`_");
}

const editUser = userId => {
    setCaption("Edit user");
    setActionAndButton(ACTIONBUTTON.EDIT, userId);
    getUser(userId, true);
}

const delUser = userId => {
    setCaption("Delete user");
    setActionAndButton(ACTIONBUTTON.DELETE, userId);
    getUser(userId, false);
}

const setCaption = text => {
    const caption = document.getElementById("staticBLabel");
    caption.innerText = text;
}

const setActionAndButton = (actionButton, userId) => {
    const actionBtn = document.getElementsByName("action-btn")[0];
    const formAction = document.querySelector(".form-horizontal");
    switch (actionButton) {
        case ACTIONBUTTON.EDIT: {
            formAction.action = ""
            actionBtn.textContent = "Edit";
            actionBtn.classList.add("btn-primary");
            actionBtn.classList.remove("btn-danger");
            break;
        }
        case ACTIONBUTTON.DELETE: {
            formAction.action = "/deleteUser/" + userId;
            actionBtn.textContent = "Delete";
            actionBtn.classList.remove("btn-primary");
            actionBtn.classList.add("btn-danger");
            break;
        }
    }
}