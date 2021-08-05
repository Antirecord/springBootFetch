import {actionButton, passwordMask} from "./constants.js";
import {getAllRoles, getUser} from "./getSetObjects.js";

export const editUser = async userId => {
    setDialogElements(userId, "Edit user", actionButton.EDIT);
    renderDialogFields(await getUser(userId), true);
}

export const delUser = async userId => {
    setDialogElements(userId, "Delete user", actionButton.DELETE);
    renderDialogFields(await getUser(userId), false);
}

const setDialogElements = (userId, captionText, actionButton) => {
    const caption = document.getElementById("staticBLabel");
    caption.innerText = captionText;
    const actionBtn = document.getElementsByName("action-btn")[0];
    // const formAction = document.querySelector(".form-horizontal");
    switch (actionButton) {
        case actionButton.EDIT: {
            // formAction.action = ""
            actionBtn.textContent = "Edit";
            actionBtn.classList.add("btn-primary");
            actionBtn.classList.remove("btn-danger");
            break;
        }
        case actionButton.DELETE: {
            // formAction.action = "/deleteUser/" + userId;
            actionBtn.textContent = "Delete";
            actionBtn.classList.remove("btn-primary");
            actionBtn.classList.add("btn-danger");
            break;
        }
    }
}

const renderDialogFields = async ({id, name, roles, surname, username}, enabledInputFields) => {
    const idField = document.getElementById("id");
    const inName = document.getElementById("name");
    const inSurname = document.getElementById("surname");
    const inUsername = document.getElementById("username");
    const inPassword = document.getElementById("password");
    const labelPassword = document.getElementById("labelPassword");
    const groupRole = document.getElementById("roles");
    groupRole.innerHTML = "";
    let allRoles = await getAllRoles();
    let listRoles = [];
    if (enabledInputFields) {
        allRoles.forEach(role => {
            roles.forEach(userRole => role.checked = (role.id === userRole.id));
        });
        inPassword.classList.remove("visually-hidden");
        labelPassword.classList.remove("visually-hidden");
        listRoles = allRoles;
    } else {
        inPassword.classList.add("visually-hidden");
        labelPassword.classList.add("visually-hidden");
        allRoles.forEach(role => roles.forEach((userRole, iter) => {
            if (role.id === userRole.id) {
                listRoles[iter] = role;
                listRoles[iter].checked = false;
            }
        }));
    }
    listRoles.sort(r => r.checked ? -1 : 1).forEach(role => {
        let option = document.createElement("option");
        option.append(document.createTextNode(role.name));
        option.selected = role.checked;
        option.disabled = !enabledInputFields;
        groupRole.append(option);
    });
    idField.setAttribute("value", id);
    inName.setAttribute("value", name);
    inName.disabled = !enabledInputFields;
    inSurname.setAttribute("value", surname);
    inSurname.disabled = !enabledInputFields;
    inUsername.setAttribute("value", username);
    inUsername.disabled = !enabledInputFields;
    inPassword.setAttribute("value", passwordMask);
}